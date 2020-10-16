import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { SheetService } from '../services/sheet.service';
import * as vega from 'vega';
import * as moment from 'moment';
import vegaTooltip from 'vega-tooltip';

import { ReportService } from '../report/report.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ControlComponent } from '../control/control.component';
import { TreeService } from './tree.service';
import { BimodalService, ASCTD } from '../services/bimodal.service';
import { SconfigService } from '../services/sconfig.service';
import { Router } from '@angular/router';

import { VegaConfig } from './vega.config';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
})
export class TreeComponent implements OnInit, OnChanges, OnDestroy {
  sheetData: any;
  treeData: any;
  multiParentLinksData: any;
  updatedTreeData: any;
  treeView: any;
  graphWidth: number;
  bimodalDistance: number;
  shouldRenderASCTBiomodal = false;
  prevData: ASCTD = {
    nodes: [],
    links: [],
    compareDD: [],
    searchIds: []
  };
  treeWidth = 0;
  treeWidthOffset = 0;
  screenWidth = 0;
  asctData: ASCTD;
  controlDialog: MatDialogRef<ControlComponent>;
  isFullScreen = false;

  @Input() dataVersion = this.sc.VERSIONS[0].folder;
  @Input() settingsExpanded: boolean;
  @Input() currentSheet: any;
  @Input() public refreshData = false;
  @Input() public shouldReloadData = false;
  @Input() public compareData = [];
  @Input() public searchIds = [];

  @Output() returnRefresh = new EventEmitter();
  @Output() fullscreen = new EventEmitter();
  @ViewChild('bimodal') biomodal;

  bimodalSortOptions = ['Alphabetically', 'Degree'];

  bimodalSizeOptions = ['None', 'Degree'];

  bimodalCTSizeOptions = ['None', 'Degree', 'Indegree', 'Outdegree'];

  bimodalConfig = {
    BM: {
      sort: this.bimodalSortOptions[0],
      size: this.bimodalSizeOptions[0],
    },
    CT: {
      sort: this.bimodalSortOptions[0],
      size: this.bimodalCTSizeOptions[0],
    },
  };

  constructor(
    private dialog?: MatDialog,
    public sheet?: SheetService,
    public report?: ReportService,
    public ts?: TreeService,
    public bms?: BimodalService,
    public sc?: SconfigService,
    public router?: Router
  ) { }

  ngOnInit(): void {
    this.searchIds = [-1];
  }

  ngOnDestroy() {
    if(this.controlDialog)
      this.controlDialog.close();
    this.shouldReloadData = false;
  }

  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
    this.fullscreen.emit(this.isFullScreen);

    if (this.isFullScreen === true) {
      const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
        mozRequestFullScreen(): Promise<void>;
        webkitRequestFullscreen(): Promise<void>;
        msRequestFullscreen(): Promise<void>;
      };

      if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
        docElmWithBrowsersFullScreenFunctions.requestFullscreen();
      } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) { /* Firefox */
        docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
      } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
      } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) { /* IE/Edge */
        docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
      }
    } else {
      const docWithBrowsersExitFunctions = document as Document & {
        mozCancelFullScreen(): Promise<void>;
        webkitExitFullscreen(): Promise<void>;
        msExitFullscreen(): Promise<void>;
      };

      if (docWithBrowsersExitFunctions.exitFullscreen) {
        docWithBrowsersExitFunctions.exitFullscreen();
      } else if (docWithBrowsersExitFunctions.mozCancelFullScreen) { /* Firefox */
        docWithBrowsersExitFunctions.mozCancelFullScreen();
      } else if (docWithBrowsersExitFunctions.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        docWithBrowsersExitFunctions.webkitExitFullscreen();
      } else if (docWithBrowsersExitFunctions.msExitFullscreen) { /* IE/Edge */
        docWithBrowsersExitFunctions.msExitFullscreen();
      }
    }

  }

  /**
   * Re-renders the bimodal graph on getting function (sorting and sizing) selections.
   */

  getBimodalSelecion() {
    this.makeBimodalGraph();
  }

  ngOnChanges() {

    if (this.refreshData) {
      this.ts.setCurrentSheet(this.currentSheet);
      this.getData();
      if (this.controlDialog) {
        this.controlDialog.componentInstance.heightValue = document.getElementsByTagName('body')[0].clientHeight;
      }
    }

    if (this.shouldReloadData && !this.refreshData) {
      this.controlDialog.componentInstance.heightValue = document.getElementsByTagName('body')[0].clientHeight;
      this.ts.setCurrentSheet(this.currentSheet);
      this.getData();
    }
  }

  showControl() {
    if (!this.dialog.getDialogById('control-dialog')) {
      this.controlDialog = this.dialog.open(ControlComponent, {
        id: 'control-dialog',
        disableClose: false,
        autoFocus: false,
        hasBackdrop: false,
        width: '400px',
        position: {
          bottom: '20px',
          left: '35px'
        },
        panelClass: 'control-class',
        data: {
          height: document.getElementsByTagName('body')[0].clientHeight
        }
      });

      this.controlDialog.componentInstance.height.subscribe(async (emmitedValue) => {
        const config: any = await this.makeVegaSpec(this.screenWidth, emmitedValue);
        await this.renderGraph(config);
      });
    }
  }

  /**
   * Re-renders the graph on window size reset.
   *
   * @param e - Resize event
   *
   */

  async onResize(e) {
    const width = e.target.innerWidth;
    this.screenWidth = width;
    if (width < 1450) {
      this.screenWidth = 1450;
    }
    const height = document.getElementsByTagName('body')[0].clientHeight;
    const config: any = await this.makeVegaSpec(this.screenWidth, height);
    await this.renderGraph(config);
  }

  public async setGraphToCompare(data) {
    const treeServiceData = await this.ts.makeTreeData(this.sheetData.data, data);
    this.treeData = treeServiceData.tree;
    this.multiParentLinksData = treeServiceData.multiParentLinks;

    const height = document.getElementsByTagName('body')[0].clientHeight;
    const config: any = await this.makeVegaSpec(this.screenWidth, height);
    await this.renderGraph(config);
  }

  public async setGraphToShowSearch(data) {
    this.treeView.data('search', data);
    this.treeView.runAsync();
    this.prevData.searchIds = data;
  }

  /**
   * Creates the vega specification
   *
   * @param width - Width the tree
   * @param height - Height of the tree branches
   */

  async makeVegaSpec(width, height) {

    const a = new VegaConfig();
    const config: any = await a.makeVegaConfig(
      this.currentSheet,
      this.bimodalDistance,
      height,
      width,
      this.treeData,
      this.multiParentLinksData
    );

    return config;
  }

  /**
   * Renderes the vega visualization
   *
   * @param config - The vega specification
   */
  async renderGraph(config) {
    const runtime: vega.Runtime = vega.parse(config, {});
    this.treeView = new vega.View(runtime)
      .renderer('svg')
      .initialize('#vis')
      .hover();

    vegaTooltip(this.treeView, { theme: 'custom' });
    this.treeView.runAsync();

    this.updatedTreeData = this.treeView.data('tree');
    this.treeWidth = this.treeView._runtime.group.context.data.asTree.values.value[0].bounds.x2;
    await this.makeBimodalGraph();
    this.showControl();
  }

  /**
   * Fetched the data to form the visualization on load.
   */
  async getData() {
    try {
      this.sheetData = await this.sheet.getSheetData(this.currentSheet, this.dataVersion);
      if (this.sheetData.status === 404) {
        this.router.navigateByUrl('/error');
        throw new Error();
      }

      const treeServiceData = await this.ts.makeTreeData(this.sheetData.data, this.compareData);
      this.treeData = treeServiceData.tree;
      this.multiParentLinksData = treeServiceData.multiParentLinks;

      const height = document.getElementsByTagName('body')[0].clientHeight;
      this.screenWidth = document.getElementsByTagName('body')[0].clientWidth;

      if (this.screenWidth < 1450) {
      this.screenWidth = 1450;
    }

      this.bimodalDistance = this.currentSheet.config.bimodal_distance;
      this.treeWidthOffset = this.currentSheet.config.width_offset;


      const config: any = await this.makeVegaSpec(this.screenWidth, height);
      await this.renderGraph(config);
      this.shouldRenderASCTBiomodal = true;

      this.report.reportLog(
        `${this.currentSheet.display} tree succesfully rendered`,
        'success',
        'msg'
      );

      this.returnRefresh.emit({
        msg: this.sheetData.msg,
        status: this.sheetData.status,
        comp: 'Tree',
        val: true,
      });
    } catch (err) {
      console.log(err);
      if (err.status === 404) {
        this.router.navigateByUrl('/error');
      }
      this.returnRefresh.emit({
        comp: 'Tree',
        msg: err,
        status: 500,
        val: false
      });
      this.report.reportLog(`Tree failed to render`, 'error', 'msg');
    }
  }

  /**
   * Creates the bimodal graph after the tree has been rendered.
   * Inputs the nodes and edges data into the vega spec
   *
   */

  public async makeBimodalGraph() {
    this.asctData = await this.bms.makeASCTData(
      this.sheetData.data,
      this.updatedTreeData,
      this.bimodalConfig,
      this.currentSheet,
      this.compareData
    );
    this.treeView._runtime.signals.node__click.value = null; // removing clicked highlighted nodes if at all
    this.treeView._runtime.signals.sources__click.value = []; // removing clicked bold source nodes if at all
    this.treeView._runtime.signals.targets__click.value = []; // removing clicked bold target nodes if at all


    this.treeView
      .change(
        'nodes',
        vega.changeset().remove(this.prevData.nodes).insert(this.asctData.nodes)
      )
      .runAsync();
    this.treeView
      .change(
        'edges',
        vega.changeset().remove(this.prevData.links).insert(this.asctData.links)
      )
      .runAsync();

    const didViewRender = await this.treeView.resize().runAsync();
    await this.treeView.runAsync();
    if (didViewRender) {
      this.prevData = this.asctData;
      this.graphWidth = didViewRender._viewWidth;
      return true;
    }
    return false;
  }

  /**
   * Creates a download link for the current vis.
   *
   * @param format - Download format can be of the following types:
   * 1. PNG
   * 2. SVG
   * 3. Vega Spec
   */

  async downloadVis(format) {
    const dt = moment(new Date()).format('YYYY.MM.DD_hh.mm');
    const sn = this.currentSheet.display.toLowerCase().replace(' ', '_');
    const formatType = format.toLowerCase();

    if (format === 'Vega Spec') {
      const height = document.getElementsByTagName('body')[0].clientHeight;
      const config: any = await this.makeVegaSpec(this.screenWidth, height);
      config.data[
        config.data.findIndex((i) => i.name === 'nodes')
      ].values = this.asctData.nodes;
      config.data[
        config.data.findIndex((i) => i.name === 'edges')
      ].values = this.asctData.links;

      const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(config, null, 4));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute(
        'download',
        `asct+b_${sn}_${dt}` + '.json'
      );
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else {
      const fileName = `asct+b_${sn}_${dt}.${formatType}`;
      this.treeView.background('white');
      this.treeView
        .toImageURL(formatType)
        .then((url) => {
          const link = document.createElement('a');
          link.setAttribute('href', url);
          link.setAttribute('target', '_blank');
          link.setAttribute('download', fileName);
          link.dispatchEvent(new MouseEvent('click'));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
}

