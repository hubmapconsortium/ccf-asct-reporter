import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { SheetService } from '../services/sheet.service';
import * as vega from 'vega';
import * as moment from 'moment';
import vegaTooltip from 'vega-tooltip';

import { ReportService } from '../report/report.service';
import { TreeService } from './tree.service';
import { BimodalService, ASCTD } from '../services/bimodal.service';
import { SconfigService } from '../services/sconfig.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit, OnChanges, OnDestroy {
  sheetData: any;
  treeData: any;
  updatedTreeData: any;
  treeView: any;
  graphWidth: number;
  bimodalDistance: number;
  shouldRenderASCTBiomodal = false;
  prevData: ASCTD = {
    nodes: [],
    links: []
  };
  treeWidth = 0;
  treeWidthOffset = 0;
  screenWidth = 0;
  asctData: ASCTD;
  
  @Input() dataVersion=this.sc.VERSIONS[0].folder;
  @Input() settingsExpanded: boolean;
  @Input() currentSheet: any;
  @Input() public refreshData = false;
  @Input() public shouldReloadData = false;
  @Output() returnRefresh = new EventEmitter();
  @ViewChild('bimodal') biomodal;

  bimodalSortOptions = [
    'Alphabetically',
    'Degree'
  ];

  bimodalSizeOptions = [
    'None',
    'Degree'
  ];

  bimodalCTSizeOptions = [
    'None',
    'Degree',
    'Indegree',
    'Outdegree'
  ];

  bimodalConfig = {
    BM: {
      sort: this.bimodalSortOptions[0],
      size: this.bimodalSizeOptions[0]
    },
    CT: {
      sort: this.bimodalSortOptions[0],
      size: this.bimodalCTSizeOptions[0]
    }
  };

  constructor(public sheet: SheetService, public report: ReportService, public ts: TreeService, public bms: BimodalService, public sc: SconfigService,
    public router: Router) { }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.shouldReloadData = false;
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
    }

    if (this.shouldReloadData && !this.refreshData) {
      this.ts.setCurrentSheet(this.currentSheet);
      this.getData();
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

  /**
   * Creates teh vega specification
   *
   * @param width - Width the tree
   * @param height - Height of the tree branches
   */

  async makeVegaSpec(width, height) {
    const config: any = {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      autosize: 'pad',
      padding: {
        right: 0,
        top: 20,
        bottom: 20,
        left: 30
      },
      signals: [
        {
          name: 'node__hover', value: null,
          on: [
            { events: '@bimodal-symbol:mouseover', update: 'datum.id' },
            { events: 'mouseover[!event.item]', update: 'null' }
          ]
        },
        {
          name: 'node_targets__hover',
          value: [],
          on: [
            { events: '@bimodal-symbol:mouseover', update: 'datum.targets' },
            { events: 'mouseover[!event.item]', update: '[]' }
          ]
        },
        {
          name: 'node_sources__hover',
          value: [],
          on: [
            { events: '@bimodal-symbol:mouseover', update: 'datum.sources' },
            { events: 'mouseover[!event.item]', update: '[]' }
          ]
        },
        {
          name: 'node__click', value: null,
          on: [
            { events: '@bimodal-symbol:click', update: 'datum.id === node__click ? null : datum.id' },
            { events: 'click[!event.item]', update: 'null' }
          ]
        },
        {
          name: 'targets__click', value: [],
          on: [
            { events: '@bimodal-symbol:click', update: 'datum.targets === targets__click ? [] : datum.targets' },
            { events: 'click[!event.item]', update: '[]' }
          ]
        },
        {
          name: 'sources__click',
          value: [],
          on: [
            { events: '@bimodal-symbol:click', update: 'datum.sources === sources__click ? [] : datum.sources' },
            { events: 'click[!event.item]', update: '[]' }
          ]
        }
      ],
      data: [
        {
          name: 'tree',
          values: this.treeData,
          transform: [
            {
              type: 'stratify',
              key: 'id',
              parentKey: 'parent'
            },
            {
              type: 'tree',
              method: 'cluster',
              size: [{ signal: height + this.currentSheet.config.height_offset }, { signal: width - this.bimodalDistance * 3 }],
              separation: { value: false },
              as: ['y', 'x', 'depth', 'children']
            }
          ]
        },
        {
          name: 'links',
          source: 'tree',
          transform: [
            { type: 'treelinks' },
            {
              type: 'linkpath',
              orient: 'horizontal',
              shape: 'diagonal'
            }
          ]
        },
        {
          name: 'nodes',
          values: [],
        },
        {
          name: 'edges',
          values: [],
          transform: [
            {
              type: 'lookup',
              from: 'nodes',
              key: 'id',
              fields: ['s', 't'],
              as: ['source', 'target']
            },
            {
              type: 'linkpath',
              sourceX: 'source.x',
              sourceY: 'source.y',
              targetX: 'target.x',
              targetY: 'target.y',
              orient: 'horizontal',
              shape: 'diagonal'
            }
          ]
        },
        {
          name: 'targets_hovered_array',
          source: 'nodes',
          transform: [
            { type: 'filter', expr: 'indexof(node_targets__hover, datum.id) !== -1' }
          ]
        },
        {
          name: 'sources_hovered_array',
          source: 'nodes',
          transform: [
            { type: 'filter', expr: 'indexof(node_sources__hover, datum.id) !== -1' }
          ]
        },
        {
          name: 'targets_clicked_array',
          source: 'nodes',
          transform: [
            {
              type: 'filter',
              expr: 'indexof(targets__click, datum.id) !== -1'
            }
          ]
        },
        {
          name: 'sources_clicked_array',
          source: 'nodes',
          transform: [
            {
              type: 'filter',
              expr: 'indexof(sources__click, datum.id) !== -1'
            }
          ]
        },
        {
          name: 'targets_clicked_array__bold',
          source: 'nodes',
          transform: [
            {
              type: 'filter',
              expr: 'indexof(targets__click, datum.id) !== -1'
            },
            {
              type: 'flatten',
              fields: ['targets']
            }
          ]
        },
        {
          name: 'sources_clicked_array__bold',
          source: 'nodes',
          transform: [
            {
              type: 'filter',
              expr: 'indexof(sources__click, datum.id) !== -1'
            },
            {
              type: 'flatten',
              fields: ['sources']
            }
          ]
        }
      ],
      scales: [
        {
          name: 'bimodal',
          type: 'ordinal',
          domain: { data: 'nodes', field: 'groupName' },
          range: ['#E41A1C', '#377EB8', '#4DAF4A']
        },
        {
          name: 'treeLegend',
          type: 'ordinal',
          domain: { data: 'tree', field: 'groupName' },
          range: ['#E41A1C']
        }
      ],
      legends: [
        {
          type: 'symbol',
          orient: 'top-left',
          fill: 'bimodal',
          title: 'Legend',
          offset: -15,
          titlePadding: 20,
          titleFontSize: 16,
          labelFontSize: 14,
          labelOffset: 10,
          symbolSize: 200,
          rowPadding: 10,
        },
        {
          type: 'symbol',
          orient: 'none',
          legendX: -15,
          legendY: 98,
          fill: 'treeLegend',
          labelFontSize: 14,
          labelOffset: 10,
          symbolSize: 200,
          rowPadding: 10,
          encode: {
            symbols: {
              update: {
                stroke: { value: 'black' },
                strokeWidth: { value: 2 }
              }
            }
          }
        }

      ],
      marks: [
        {
          type: 'group',
          name: 'asTree',
          marks: [
            {
              type: 'path',
              from: { data: 'links' },
              encode: {
                update: {
                  path: { field: 'path' },
                  stroke: { value: '#ccc' },
                  opacity: { value: 0.4 },
                  strokeWidth: { value: 1.5 }
                }
              }
            },
            {
              type: 'symbol',
              from: { data: 'tree' },
              encode: {
                enter: {
                  size: { value: 300 },
                  stroke: { signal: 'datum.problem ? "#000": "#fff"' },
                  strokeWidth: { signal: 'datum.problem ? 3: 0' }
                },
                update: {
                  x: { field: 'x' },
                  y: { field: 'y' },
                  tooltip: [
                    { field: 'uberonId', type: 'quantitative' }
                  ],
                  opacity: { signal: 'datum.children ? 1 : 0' },
                  fill: { field: 'color' }
                }
              }
            },
            {
              type: 'text',
              from: { data: 'tree' },
              encode: {
                enter: {
                  text: { field: 'name' },
                  limit: { value: 180 },
                  fontSize: { value: 14 },
                  baseline: { value: 'middle' },
                  fontWeight: { value: 400 }
                },
                update: {
                  x: { field: 'x' },
                  y: { field: 'y' },
                  dx: { signal: 'datum.children ? 15: -15' },
                  opacity: { signal: 'datum.children ? 1 : 0' },
                  align: { signal: 'datum.children ? \'left\' : \'right\'' },
                }
              }
            }
          ]
        },
        {
          type: 'group',
          marks: [
            {
              type: 'path',
              from: { data: 'edges' },
              encode: {
                enter: {
                  stroke: { value: '#ccc' },
                  strokeWidth: { value: 1.5 },
                  x: { value: 0 },
                  y: { value: 5 }
                },
                update: {
                  path: { field: 'path' },
                  stroke: [
                    // red: E41A1C, green: 4DAF4A, blue: 377EB8
                    { test: 'datum.source.id === node__hover && datum.source.group == 1', value: '#E41A1C' }, // for hover
                    { test: 'datum.source.id === node__hover && datum.source.group == 2', value: '#377EB8' }, // for hover
                    { test: 'datum.target.id === node__hover && datum.target.group == 2', value: '#E41A1C' }, // for hover
                    { test: 'datum.target.id === node__hover && datum.target.group == 3', value: '#4DAF4A' }, // for hover

                    { test: 'datum.source.id === node__click && datum.source.group == 1', value: '#E41A1C' }, // for click
                    { test: 'datum.source.id === node__click && datum.source.group == 2', value: '#377EB8' }, // for click
                    { test: 'datum.target.id === node__click && datum.target.group == 2', value: '#E41A1C' }, // for click
                    { test: 'datum.target.id === node__click && datum.target.group == 3', value: '#4DAF4A' }, // for click
                    // for getting AS -> CT -> B
                    {
                      test: 'indata(\'targets_hovered_array\', \'id\', datum.source.id)',
                      value: '#377EB8'
                    },

                    {
                      test: 'indata(\'targets_clicked_array\', \'id\', datum.source.id)',
                      value: '#377EB8'
                    },
                    // for getting B -> CT -> AS
                    {
                      test: 'indata(\'sources_hovered_array\', \'id\', datum.target.id) && datum.source.group !== 2',
                      value: '#377EB8'
                    },
                    {
                      test: 'indata(\'sources_clicked_array\', \'id\', datum.target.id) && datum.source.group !== 2',
                      value: '#377EB8'
                    },
                    { value: '#ccc' }
                  ],
                  opacity: [
                    { test: 'datum.target.id === node__click', value: 0.65 },
                    { test: 'datum.source.id === node__click', value: 0.65 },
                    {
                      test: 'indata(\'targets_clicked_array\', \'id\', datum.source.id)',
                      value: 0.65
                    },
                    {
                      test: 'indata(\'sources_clicked_array\', \'id\', datum.target.id) && datum.source.group !== 2',
                      value: 0.65
                    },
                    { value: 0.4 }
                  ],
                  zindex: [
                    { test: 'datum.source.id === node__hover', value: 2 },
                    { test: 'datum.target.id === node__hover', value: 2 },
                    { test: 'datum.source.id === node__click', value: 2 },
                    { test: 'datum.target.id === node__click', value: 2 },
                    {
                      test: 'indata(\'targets_clicked_array\', \'id\', datum.source.id)',
                      value: 2
                    },
                  ]
                }
              }
            },
            {
              type: 'symbol',
              name: 'bimodal-symbol',
              from: { data: 'nodes' },
              encode: {
                enter: {
                  size: { field: 'nodeSize' },
                  fill: { field: 'color' },
                  x: { field: 'x' },
                  y: { field: 'y', offset: 5 },
                  cursor: { value: 'pointer' },
                  tooltip: { signal: '{\'Name\': datum.name, \'Degree\': datum.group === 1 ? length(datum.sources) + length(datum.targets) + 1 : length(datum.sources) + length(datum.targets), "Indegree": datum.group == 1 ? 1 : length(datum.sources), "Outdegree": length(datum.targets), "Uberon/Link": datum.uberonId}'}
                },
                update: {
                  stroke: { signal: 'datum.problem ? "#000": "#fff"' },
                  strokeWidth: { signal: 'datum.problem ? 3: 0' }
                }
              }
            },
            {
              type: 'text',
              zindex: 5,
              dx: 5,
              from: { data: 'nodes' },
              encode: {
                update: {
                  x: { field: 'x' },
                  y: { field: 'y', offset: 5 },
                  dx: { value: 20 },
                  align: { value: 'left' },
                  baseline: { value: 'middle' },
                  text: { field: 'name' },
                  fontSize: { field: 'fontSize' },
                  fontWeight: [
                    {
                      test: 'indata(\'targets_clicked_array\', \'id\', datum.id)',
                      value: 'bold'
                    },
                    {
                      test: 'datum.id === node__click', value: 'bold'
                    },
                    {
                      test: 'indata(\'sources_clicked_array\', \'id\', datum.id)',
                      value: 'bold'
                    },
                    {
                      test: 'indata(\'targets_clicked_array__bold\', \'targets\', datum.id)',
                      value: 'bold'
                    },
                    {
                      test: 'indata(\'sources_clicked_array__bold\', \'sources\', datum.id)  && datum.group !== 2 && datum.group !== 3',
                      value: 'bold'
                    }
                  ],
                  opacity: { value: 1 },
                  limit: { value: 180 }
                }
              }
            },
          ]
        }
      ],
    };

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

    vegaTooltip(this.treeView, {theme: 'custom'});
    this.treeView.runAsync();

    this.updatedTreeData = this.treeView.data('tree');
    this.treeWidth = this.treeView._runtime.group.context.data.asTree.values.value[0].bounds.x2;

    await this.makeBimodalGraph();
  }

  /**
   * Fetched the data to form the visualization on load.
   */
  async getData() {
    try {
      this.sheetData = await this.sheet.getSheetData(this.currentSheet, this.dataVersion);
      if (this.sheetData.status == 404) {
        this.router.navigateByUrl('/error');
        throw new Error;
      }
 
    this.treeData = await this.ts.makeTreeData(this.sheetData.data);

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
      this.report.reportLog(`${this.currentSheet.display} tree successfully rendered`, 'success', 'msg');

      this.returnRefresh.emit({
        msg: this.sheetData.msg,
        status: this.sheetData.status,
        comp: 'Tree',
        val: true
      });
    } catch (err) {
      console.log(err);
      if (err.status === 404) {
        this.router.navigateByUrl('/error');
      }
      this.returnRefresh.emit({
        comp: 'Tree',
        msg: err.msg,
        status: err.status,
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
    this.asctData = await this.bms.makeASCTData(this.sheetData.data, this.updatedTreeData, this.bimodalConfig, this.currentSheet);
    this.treeView._runtime.signals.node__click.value = null; // removing clicked highlighted nodes if at all
    this.treeView._runtime.signals.sources__click.value = []; // removing clicked bold source nodes if at all
    this.treeView._runtime.signals.targets__click.value = []; // removing clicked bold target nodes if at all

    this.treeView.change('nodes', vega.changeset().remove(this.prevData.nodes).insert(this.asctData.nodes)).runAsync();
    this.treeView.change('edges', vega.changeset().remove(this.prevData.links).insert(this.asctData.links)).runAsync();

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
    const dt = moment(new Date).format('YYYY.MM.DD_hh.mm');
    const sn = this.currentSheet.display.toLowerCase().replace(' ', '_');
    const formatType = format.toLowerCase();

    if (format === 'Vega Spec') {
      const height = document.getElementsByTagName('body')[0].clientHeight;
      const config: any = await this.makeVegaSpec(this.screenWidth, height);
      config.data[config.data.findIndex(i => i.name === 'nodes')].values = this.asctData.nodes;
      config.data[config.data.findIndex(i => i.name === 'edges')].values = this.asctData.links;

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 4));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', `asct+b_${sn}_${dt}` + '.json');
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else {
      const fileName = `asct+b_${sn}_${dt}.${formatType}`;
      this.treeView.background('white');
      this.treeView.toImageURL(formatType).then((url) => {
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('target', '_blank');
        link.setAttribute('download', fileName);
        link.dispatchEvent(new MouseEvent('click'));
        this.treeView.background('transparent');
      }).catch((error) => {
        console.log(error);
      });
    }
  }
}
