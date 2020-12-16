import { SheetService } from '../services/sheet.service';
import {State, Action, StateContext, Selector, Select} from '@ngxs/store';
import { Sheet, Data } from "../models/sheet.model";
import { Error, Response } from "../models/response.model";

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Spec, View } from 'vega'
import SC from "../static/config";
import { Injectable } from '@angular/core';
import { updateVegaSpec, updateVegaView, updateBimodal } from '../actions/tree.actions';
import { fetchSheetData } from '../actions/sheet.actions';
import { TNode } from '../models/tree.model';
import { BMNode } from '../models/bimodal.model';

export class TreeStateModel {
  spec: Spec;
  treeData: TNode[];
  view: any;
  width: number;
  bimodal: {
    nodes: BMNode[],
    links: any,
    config: {
      BM: {sort: string, size: string},
      CT: {sort: string, size: string}
    }
  }
}


@State<TreeStateModel>({
  name: 'treeState',
  defaults: {
    spec: {},
    treeData: [],
    view: {},
    width: 0,
    bimodal: {nodes: [], links: [], config: {BM: {sort: 'Alphabetically', size: 'None'}, CT: {sort: 'Alphabetically', size: 'None'}}}
  }
})
@Injectable()
export class TreeState {
  
  constructor(private sheetService: SheetService) {
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
  updateVegaView({getState, setState, patchState}: StateContext<TreeStateModel>, {view}: updateVegaView) {
    const state = getState();
    patchState({
      view: view,
      treeData: view.data('tree'),
      width: view._viewWidth
    })
  }
  

  @Action(updateVegaSpec)
  updateVegaSpec({getState, setState, patchState}: StateContext<TreeStateModel>, {spec}: updateVegaSpec) {
    patchState({
      spec: spec
    })
  }
}