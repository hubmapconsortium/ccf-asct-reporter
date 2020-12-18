import { SheetService } from '../services/sheet.service';
import {State, Action, StateContext, Selector, Select} from '@ngxs/store';
import { Sheet, Data } from "../models/sheet.model";
import { Error, Response } from "../models/response.model";

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Spec, View } from 'vega'
import { Injectable } from '@angular/core';
import { updateVegaSpec, updateVegaView, updateBimodal, UpdateBimodalConfig } from '../actions/tree.actions';
import { fetchSheetData } from '../actions/sheet.actions';
import { TNode } from '../models/tree.model';
import { BMNode, Link, BimodalConfig } from '../models/bimodal.model';

export class TreeStateModel {
  spec: Spec;
  treeData: TNode[];
  view: any;
  width: number;
  height: number;
  screenWidth: number;
  bimodal: {
    nodes: BMNode[],
    links: Link[],
    config: BimodalConfig
  };
  completed: boolean;
}


@State<TreeStateModel>({
  name: 'treeState',
  defaults: {
    spec: {},
    treeData: [],
    view: {},
    width: 0,
    height: document.getElementsByTagName('body')[0].clientHeight,
    screenWidth:  document.getElementsByTagName('body')[0].clientWidth,
    bimodal: {nodes: [], links: [], config: {BM: {sort: 'Alphabetically', size: 'None'}, CT: {sort: 'Alphabetically', size: 'None'}}},
    completed: false,
    
  }
})
@Injectable()
export class TreeState {
  
  constructor() {
  }
  
  @Selector()
  static getBimodalConfig(state: TreeStateModel) {
    return state.bimodal.config
  }

  @Selector()
  static getVegaSpec(state: TreeStateModel) {
    return state.spec;
  }

  @Selector()
  static getTreeData(state: TreeStateModel) {
    return state.treeData
  }

  @Selector()
  static getVegaView(state: TreeStateModel) {
    return state.view
  }

  @Select()
  static getBimodal(state: TreeStateModel) {
    return state.bimodal
  }


  @Action(updateBimodal)
  updateBimodal({getState, setState}: StateContext<TreeStateModel>, {nodes, links}: updateBimodal) {
    const state = getState()
    setState({
      ...state,
      bimodal: {nodes: nodes, links: links, config: state.bimodal.config}
    })
  }

  @Action(updateVegaView)
  updateVegaView({getState, patchState}: StateContext<TreeStateModel>, {view}: updateVegaView) {
    const state = getState();
    patchState({
      view: view,
      treeData: view.data('tree'),
      width: view._viewWidth
    })
  }
  

  @Action(updateVegaSpec)
  updateVegaSpec({patchState}: StateContext<TreeStateModel>, {spec}: updateVegaSpec) {
    patchState({
      spec: spec
    })
  }

  @Action(UpdateBimodalConfig)
  updateBimodalConfig({getState, setState}: StateContext<TreeStateModel>, {config}: UpdateBimodalConfig) {
    const state = getState()
    const nodes = state.bimodal.nodes;
    const links = state.bimodal.links;

    setState({
      ...state,
      bimodal: {
        nodes: nodes,
        links: links,
        config: config
      }
    })
  }

}