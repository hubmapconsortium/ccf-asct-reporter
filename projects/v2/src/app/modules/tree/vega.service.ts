import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import vegaTooltip from 'vega-tooltip';
import * as vega from 'vega';
import { Signals } from './spec/signals';
import { Data } from './spec/data';
import { Scales } from './spec/scales';
import { Legends } from './spec/legends';
import { Marks } from './spec/marks';
import { UpdateVegaView, UpdateLinksData } from '../../actions/tree.actions';
import { BimodalService } from './bimodal.service';
import { OpenBottomSheet, CloseLoading, HasError, OpenBottomSheetDOI } from '../../actions/ui.actions';
import { Error } from '../../models/response.model';
import { ReportLog } from '../../actions/logs.actions';
import { LOG_TYPES, LOG_ICONS } from '../../models/logs.model';
import { Sheet, SheetConfig } from '../../models/sheet.model';
import { TNode } from '../../models/tree.model';
import { Signal } from 'vega';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { GaAction, GaCategory } from '../../models/ga.model';
import { TreeState } from '../../store/tree.state';

@Injectable({
  providedIn: 'root'
})
export class VegaService {

  /**
   * Sheet configuration to be applied while building
   * the tree and the bimodal network
   */
  sheetConfig: SheetConfig;

  constructor(
    public readonly store: Store,
    public readonly bm: BimodalService,
    public readonly ga: GoogleAnalyticsService) { }

  /**
   * Function to create the partonomy tree
   *
   * @param config vega spec
   */
  async renderGraph(config: any) {
    try {
      const runtime: vega.Runtime = vega.parse(config, {});
      const treeView: any = new vega.View(runtime)
        .renderer('svg')
        .initialize('#vis')
        .hover();

      vegaTooltip(treeView, { theme: 'custom' });
      treeView.runAsync();

      this.addSignalListeners(treeView);
      this.store.dispatch(new CloseLoading('Visualization Rendered'));
      this.store.dispatch(new UpdateLinksData(0, 0, treeView.data('links').length));
      this.makeBimodal(treeView);

    } catch (error) {
      console.log(error);
      const err: Error = {
        msg: `${error.name} (Status: ${error.status})`,
        status: error.status,
        hasError: true
      };
      this.store.dispatch(new ReportLog(LOG_TYPES.MSG, 'Failed to create Tree', LOG_ICONS.error));
      this.store.dispatch(new HasError(err));
    }
  }

  /**
   * Function to add various event listeners to the visualization
   * 
   * @param view vega view
   */
  addSignalListeners(view: any) {
    // node name click event to open bottom sheet
    view.addSignalListener('bimodal_text__click', (signal: Signal, node: any) => {
      if (Object.entries(node).length) {
        this.store.dispatch(new OpenBottomSheet(node));
      }

      this.ga.eventEmitter('graph_label_click', GaCategory.GRAPH, 'Clicked a node label', GaAction.CLICK, this.ga.makeNodeInfoString(node));
    });
    
    // node click listener to emit ga event
    view.addSignalListener('node__click', (signal: Signal, nodeId: any) => {
      if (nodeId != null) {
        const clickedNode = this.store.selectSnapshot(TreeState.getBimodal).nodes.find(node => node.id === nodeId);
        this.ga.eventEmitter('graph_node_select', GaCategory.GRAPH, 'Selected (clicked) a node', GaAction.CLICK,
          this.ga.makeNodeInfoString(clickedNode));
      } else {
        this.ga.eventEmitter('graph_node_deselect', GaCategory.GRAPH, 'Deselected a node', GaAction.CLICK);
      }
    });
    
    // path click event to show doi/references
    view.addSignalListener('path__click', (signal: Signal, text: any) => {
      if ((text).length) {
        this.store.dispatch(new OpenBottomSheetDOI(text));
      }
    });
  }
  
  /**
   * Function to create the biomodal network
   * Uses the data, tree data and the various configurations
   * 
   * @param view vega view
   */
  makeBimodal(view: any) {
    this.store.dispatch(new UpdateVegaView(view)).subscribe(states => {
      const data = states.sheetState.data;
      const sheet = states.sheetState.sheet;
      const treeData = states.treeState.treeData;
      const bimodalConfig = states.treeState.bimodal.config;
      const sheetConfig = states.sheetState.sheetConfig;

      if (data.length) {
        try {
          this.bm.makeBimodalData(data, treeData, bimodalConfig, sheetConfig);
        } catch (err) {
          console.log(err);
        }
      }
    });
  }
  
  /**
   * Function to creat the vega spec
   * 
   * @param currentSheet selected organ sheet
   * @param treeData partonomy/vega tree data
   * @param sheetConfig sheet configurations 
   * @param multiParentLinksData depricated
   */
  makeVegaConfig(currentSheet: Sheet, treeData: TNode[], sheetConfig: SheetConfig, multiParentLinksData?: []) {
    const config: any = {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      autosize: 'pad',
      padding: {
        right: 0,
        top: 20,
        bottom: 20,
        left: 30,
      },
      signals: new Signals(sheetConfig),
      data: new Data(currentSheet, treeData, sheetConfig),
      scales: new Scales(),
      legends: new Legends(),
      marks: new Marks(),
    };
    return config;
  }

}
