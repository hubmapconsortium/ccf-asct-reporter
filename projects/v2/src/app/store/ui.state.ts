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
import { ToggleControlPane, OpenLoading, CloseLoading, UpdateLoadingText, HasError } from '../actions/ui.actions';

export class UIStateModel {
  controlPaneOpen: boolean;
  loading: boolean;
  loadingText: string;
  hasError: boolean;
  error: Error;
}


@State<UIStateModel>({
  name: 'uiState',
  defaults: {
    controlPaneOpen: true,
    loading: true,
    loadingText: '',
    hasError: false,
    error: {}
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

  @Selector()
  static checkForError(state: UIStateModel) {
    return state.hasError
  }

  @Selector()
  static getError(state: UIStateModel) {
    return {
      hasError: state.hasError,
      error: state.error
    }
  }

  @Action(ToggleControlPane)
  toggleControlPane({getState, setState}: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      controlPaneOpen: !state.controlPaneOpen
    })
  }

  @Action(OpenLoading)
  openLoading({getState, setState}: StateContext<UIStateModel>, {text}: OpenLoading) {
    const state = getState();
    setState({
      ...state,
      loadingText: text,
      loading: true,
      hasError: false,
      error: {}
    })
  }

  @Action(UpdateLoadingText)
  UpdateLoadingText({getState, setState}: StateContext<UIStateModel>, {text}: UpdateLoadingText) {
    const state = getState();
    setState({
      ...state,
      loadingText: text,
    })
  }

  @Action(CloseLoading)
  closeLoading({getState, setState}: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      loading: false,
      loadingText: ''
    })
  }

  @Action(HasError)
  hasError({getState, setState}: StateContext<UIStateModel>, {error}: HasError) {
    const state = getState()
    setState({
      ...state,
      hasError: true,
      error: error,
      loading: false,
      loadingText: ''
    })
  }

}