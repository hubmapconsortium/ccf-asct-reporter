import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Spec, View, parse } from 'vega';
import vegaTooltip from 'vega-tooltip';
import { ReportLog } from '../../actions/logs.actions';
import { UpdateLinksData, UpdateVegaView } from '../../actions/tree.actions';
import {
  CloseLoading,
  HasError,
  OpenBottomSheet,
  OpenBottomSheetDOI,
} from '../../actions/ui.actions';
import { GaAction, GaCategory, GaNodeInfo } from '../../models/ga.model';
import { LOG_ICONS, LOG_TYPES } from '../../models/logs.model';
import { Error } from '../../models/response.model';
import { DOI, Sheet, SheetConfig } from '../../models/sheet.model';
import { TNode } from '../../models/tree.model';
import { OpenBottomSheetData } from '../../models/ui.model';
import { BimodalService } from './bimodal.service';
import { Data } from './spec/data';
import { Legends } from './spec/legends';
import { Marks } from './spec/marks';
import { Scales } from './spec/scales';
import { Signals } from './spec/signals';

@Injectable({
  providedIn: 'root',
})
export class VegaService {
  /**
   * Sheet configuration to be applied while building
   * the tree and the bimodal network
   */
  sheetConfig!: SheetConfig;

  constructor(
    public readonly store: Store,
    public readonly bm: BimodalService,
    public readonly ga: GoogleAnalyticsService
  ) {}

  /**
   * Function to create the partonomy tree
   *
   * @param config vega spec
   */
  async renderGraph(config: Spec) {
    try {
      const runtime = parse(config, {});
      const treeView = new View(runtime)
        .renderer('svg')
        .initialize('#vis')
        .hover();

      vegaTooltip(treeView, { theme: 'custom' });
      treeView.runAsync();

      this.addSignalListeners(treeView);
      this.store.dispatch(new CloseLoading('Visualization Rendered'));
      this.store.dispatch(
        new UpdateLinksData(0, 0, {}, {}, treeView.data('links').length, {})
      );
      this.makeBimodal(treeView);
    } catch (error) {
      console.log(error);
      const error2 = error as { name: string; status: number };
      const err: Error = {
        msg: `${error2.name} (Status: ${error2.status})`,
        status: error2.status,
        hasError: true,
      };
      this.store.dispatch(
        new ReportLog(LOG_TYPES.MSG, 'Failed to create Tree', LOG_ICONS.error)
      );
      this.store.dispatch(new HasError(err));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public makeNodeInfoString(node: any) {
    const nodeInfo: GaNodeInfo = {
      name: node.name,
      groupName: node.groupName,
      oid: node.ontologyId,
      type: node.type,
      x: node.x,
      y: node.y,
    };
    return JSON.stringify(nodeInfo);
  }

  /**
   * Function to add various event listeners to the visualization
   *
   * @param view vega view
   */
  addSignalListeners(view: View) {
    // node name click event to open bottom sheet
    view.addSignalListener(
      'bimodal_text__click',
      (_signal: unknown, node: OpenBottomSheetData) => {
        if (node && Object.entries(node).length) {
          this.store.dispatch(new OpenBottomSheet(node));
          this.ga.event(
            GaAction.CLICK,
            GaCategory.GRAPH,
            `Clicked a node label: ${this.makeNodeInfoString(node)}`
          );
        }
      }
    );

    // node click listener to emit ga event
    view.addSignalListener(
      'node__click',
      (_signal: string, nodeId: unknown) => {
        if (nodeId != null) {
          this.ga.event(
            GaAction.CLICK,
            GaCategory.GRAPH,
            'Selected (clicked) a node',
            0
          );
        } else {
          this.ga.event(GaAction.CLICK, GaCategory.GRAPH, 'Deselected a node');
        }
      }
    );

    // path click event to show doi/references
    view.addSignalListener('path__click', (_signal: string, text: DOI[]) => {
      if (text.length) {
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
  makeBimodal(view: View) {
    this.store.dispatch(new UpdateVegaView(view)).subscribe((states) => {
      const data = states.sheetState.data;
      const treeData = states.treeState.treeData;
      const bimodalConfig = states.treeState.bimodal.config;
      const sheetConfig = states.sheetState.sheetConfig;
      const omapConfig = states.treeState.omapConfig;
      const filteredProtiens = states.sheetState.filteredProtiens;

      if (data.length) {
        try {
          this.bm.makeBimodalData(
            data,
            treeData,
            bimodalConfig,
            false,
            sheetConfig,
            omapConfig,
            filteredProtiens
          );
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
  makeVegaConfig(
    currentSheet: Sheet,
    treeData: TNode[],
    sheetConfig: SheetConfig,
    _multiParentLinksData?: []
  ) {
    const config: Spec = {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      autosize: 'pad',
      padding: {
        right: 0,
        top: 20,
        bottom: 20,
        left: 30,
      },
      signals: Signals.create(sheetConfig),
      data: Data.create(currentSheet, treeData, sheetConfig),
      scales: Scales.create(),
      legends: Legends.create(),
      marks: Marks.create(),
    };
    return config;
  }
}
