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
import { Subject } from 'rxjs';
import { BMNode } from '../../models/bimodal.model';
import { TNode } from '../../models/tree.model';

@Injectable({
  providedIn: 'root'
})
export class VegaService {

  private textSignal = new Subject<any>();
  textSignal$ = this.textSignal.asObservable();

  constructor(public store: Store, public bm: BimodalService) { }

  async renderGraph(config) {
    const runtime: vega.Runtime = vega.parse(config, {});
    const treeView: any = new vega.View(runtime)
      .renderer('svg')
      .initialize('#vis')
      .hover();

    vegaTooltip(treeView, { theme: 'custom' });
    treeView.runAsync();

    const updatedTreeData = treeView.data('tree');

    // const treeWidth = treeView._runtime.group.context.data.asTree.values.value[0].bounds.x2;
    this.addSignalListeners(treeView);

    this.store.dispatch(new UpdateVegaView(treeView)).subscribe(states => {
      const data = states.sheetState.data;
      const sheet = states.sheetState.sheet;
      const treeData = states.treeState.treeData;
      const bimodalConfig = states.treeState.bimodal.config;


      if (data.length) {
        try {this.bm.makeBimodalData(data, treeData, bimodalConfig, sheet, []);}
        catch(err){console.log('err', err)}
      }
    });
  }

  addSignalListeners(view: any) {
    view.addSignalListener('bimodal_text__click', (signal, value) => {
      this.textSignal.next(value) 
    })
  }

  makeVegaConfig(currentSheet, bimodalDistance, height, width, treeData, multiParentLinksData) {
    const config: any = {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      autosize: 'pad',
      padding: {
        right: 0,
        top: 20,
        bottom: 20,
        left: 30,
      },
      width: width,
      signals: new Signals(),
      data: new Data(currentSheet, bimodalDistance, height, width, treeData, multiParentLinksData),
      scales: new Scales(),
      legends: new Legends(),
      marks: new Marks(),
    };

    return config;
  }

}
