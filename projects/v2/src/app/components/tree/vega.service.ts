import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import vegaTooltip from 'vega-tooltip';
import * as vega from 'vega';

import { Signals } from './spec/signals';
import { Data } from './spec/data';
import { Scales } from './spec/scales';
import { Legends } from './spec/legends';
import { Marks } from './spec/marks';
import { updateVegaView } from '../../actions/tree.actions';
import { BimodalService } from './bimodal.service';

@Injectable({
  providedIn: 'root'
})
export class VegaService {

  constructor(public store: Store, public bm: BimodalService) { }

  async renderGraph(config) {
    const runtime: vega.Runtime = vega.parse(config, {});
    let treeView:any = new vega.View(runtime)
      .renderer('svg')
      .initialize('#vis')
      .hover();

    vegaTooltip(treeView, { theme: 'custom' });
    treeView.runAsync();

    const updatedTreeData = treeView.data('tree');
    
    const treeWidth = treeView._runtime.group.context.data.asTree.values.value[0].bounds.x2;
    

    this.store.dispatch(new updateVegaView(treeView)).subscribe(states => {
      const data = states.sheetState.data
      const sheet = states.sheetState.sheet
      const treeData = states.treeState.treeData
      const bimodalConfig = states.treeState.bimodal.config
      

      if (data.length) {
        this.bm.makeBimodalData(data, treeData, bimodalConfig, sheet, [])
      } 
    })

    // this.treeView.addSignalListener('node__hover', (name, value) => {

    //   if (value != null){
    //     this.ga.eventEmitter( 'tree', 'hover',  `${this.asctData.nodes.find(i => i.id === value).name},${this.asctData.nodes.find(i => i.id === value).x},${this.asctData.nodes.find(i => i.id === value).y}`, 1);
    //   }
    //  });

    // this.treeView.addSignalListener('node__click', (name, value) => {
    //   if (value != null){
    //    this.ga.eventEmitter('tree', 'click',  `${this.asctData.nodes.find(i => i.id === value).name},${this.asctData.nodes.find(i => i.id === value).x},${this.asctData.nodes.find(i => i.id === value).y}`, 1);
    //   }
    //  });

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
      signals: new Signals(),
      data: new Data(currentSheet, bimodalDistance, height, width, treeData, multiParentLinksData),
      scales: new Scales(),
      legends: new Legends(),
      marks: new Marks(),
    };
  
    return config;
  }
  
}
