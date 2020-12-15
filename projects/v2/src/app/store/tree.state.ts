import { SheetService } from '../services/sheet.service';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import { Sheet, Data } from "../models/sheet.model";
import { Error, Response } from "../models/response.model";

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import SC from "../static/config";
import { Injectable } from '@angular/core';
import { fetchSheetData, updateVegaSpec, updateTreeView } from '../actions/sheet.actions';

export class TreeStateModel {
  spec: any;
  treeData: any;
  view: any;
}


@State<TreeStateModel>({
  name: 'treeState',
  defaults: {
    spec: {},
    treeData: {},
    view: {}
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

  @Action(updateTreeView)
  updateVegaView({getState, setState, patchState}: StateContext<TreeStateModel>, {view}: updateTreeView) {
    patchState({
      view: view,
      treeData: view.data('tree')
    })
  }
  

  @Action(updateVegaSpec)
  updateVegaSpec({getState, setState, patchState}: StateContext<TreeStateModel>, {spec}: updateVegaSpec) {
    console.log(spec)
    patchState({
      spec: spec
    })
  }
}