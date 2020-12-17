import { SheetService } from '../services/sheet.service';
import {State, Action, StateContext, Selector, Select} from '@ngxs/store';
import { Sheet, Data } from "../models/sheet.model";
import { Error, Response } from "../models/response.model";

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Spec, View } from 'vega'
import { Injectable } from '@angular/core';
import { updateVegaSpec, updateVegaView, updateBimodal } from '../actions/tree.actions';
import { fetchSheetData } from '../actions/sheet.actions';
import { TNode } from '../models/tree.model';
import { ToggleControlPane } from '../actions/ui.actions';

export class UIStateModel {
  controlPaneOpen: boolean;
}


@State<UIStateModel>({
  name: 'uiState',
  defaults: {
    controlPaneOpen: true
  }
})
@Injectable()
export class UIState {
  
  constructor() {
  }

  @Selector()
  static getControlPaneState(state: UIStateModel) {
    return state.controlPaneOpen;
  }

  @Action(ToggleControlPane)
  toggleControlPane({getState, setState}: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      controlPaneOpen: !state.controlPaneOpen
    })
  }

}