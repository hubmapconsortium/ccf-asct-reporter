import { SheetService } from '../services/sheet.service';
import {State, Action, StateContext, Selector, Select} from '@ngxs/store';
import { Sheet, Data } from "../models/sheet.model";
import { Error, Response } from "../models/response.model";

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import SC from "../static/config";
import { Injectable } from '@angular/core';
import { fetchSheetData, updateVegaSpec, updateVegaView, updateBimodal } from '../actions/sheet.actions';

export class TreeStateModel {
  spec: any;
  treeData: any;
  view: any;
  width: number;
  bimodal: {
    nodes: any,
    links: any
  }
}


@State<TreeStateModel>({
  name: 'treeState',
  defaults: {
    spec: {},
    treeData: {},
    view: {},
    width: 0,
    bimodal: {nodes: [], links: []}
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
      bimodal: {nodes: nodes, links: links}
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