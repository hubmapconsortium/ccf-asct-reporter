import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import vegaTooltip from 'vega-tooltip';
import * as vega from 'vega';

import { Signals } from './spec/signals';
import { Data } from './spec/data';
import { Scales } from './spec/scales';
import { Legends } from './spec/legends';
import { Marks } from './spec/marks';
import { UpdateVegaView } from '../../actions/tree.actions';
import { BimodalService } from './bimodal.service';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { InfoComponent } from '../../components/info/info.component';
import { OpenBottomSheet, CloseBottomSheet, CloseLoading, HasError } from '../../actions/ui.actions';
import { Error } from '../../models/response.model';
import { ReportLog } from '../../actions/logs.actions';
import { LOG_TYPES, LOG_ICONS } from '../../models/logs.model';
import { Sheet } from '../../models/sheet.model';
import { TNode } from '../../models/tree.model';
import { Signal } from 'vega';

@Injectable({
  providedIn: 'root'
})
export class VegaService {

  infoSheetRef: MatBottomSheetRef;

  constructor(public store: Store, public bm: BimodalService, private infoSheet: MatBottomSheet) { }

  async renderGraph(config: any) {
    try {
      const runtime: vega.Runtime = vega.parse(config, {});
      const treeView: any = new vega.View(runtime)
        .renderer('svg')
        .initialize('#vis')
        .hover();

      vegaTooltip(treeView, { theme: 'custom' });
      treeView.runAsync();

      // const treeWidth = treeView._runtime.group.context.data.asTree.values.value[0].bounds.x2;
      this.addSignalListeners(treeView);
      // this.store.dispatch(new CloseLoading('Visualization Rendered'));

      this.store.dispatch(new UpdateVegaView(treeView)).subscribe(states => {
        const data = states.sheetState.data;
        const sheet = states.sheetState.sheet;
        const treeData = states.treeState.treeData;
        const bimodalConfig = states.treeState.bimodal.config;


        if (data.length) {
          try {
            this.bm.makeBimodalData(data, treeData, bimodalConfig, sheet);
          } catch (err) {
            console.log('HELLO:', err)
          }
        }
      });

    } catch (error) {
      console.log(error)
      const err: Error = {
        msg: `${error.name} (Status: ${error.status})`,
        status: error.status,
        hasError: true
      };
      this.store.dispatch(new ReportLog(LOG_TYPES.MSG, 'Failed to create Tree', LOG_ICONS.error))
      this.store.dispatch(new HasError(err))
    }
  }

  addSignalListeners(view: any) {
    view.addSignalListener('bimodal_text__click', (signal: Signal, text: any) => {
      if (text) {

        this.store.dispatch(new OpenBottomSheet(text))
      } else {
        this.store.dispatch(new CloseBottomSheet())
      }
    })
  }

  makeVegaConfig(currentSheet: Sheet, treeData: TNode[], multiParentLinksData?: []) {
    const config: any = {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      autosize: 'pad',
      padding: {
        right: 0,
        top: 20,
        bottom: 20,
        left: 30,
      },
      signals: new Signals(),
      data: new Data(currentSheet, treeData),
      scales: new Scales(),
      legends: new Legends(),
      marks: new Marks(),
    };

    return config;
  }

}
