import { SheetService } from '../services/sheet.service';
import {State, Action, StateContext, Selector, Select} from '@ngxs/store';
import { Sheet, Data } from '../models/sheet.model';
import { Error, Response, SnackbarType } from '../models/response.model';
import { patch } from '@ngxs/store/operators';

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Injectable } from '@angular/core';
import { ToggleControlPane, OpenLoading, CloseLoading, UpdateLoadingText, HasError, OpenSnackbar, CloseSnackbar, ToggleIndentList } from '../actions/ui.actions';
import { Snackbar } from '../models/ui.model';

export class UIStateModel {
  controlPaneOpen: boolean;
  loading: boolean;
  loadingText: string;
  error: Error;
  snackbar: Snackbar;
  indentListOpen: boolean;
}


@State<UIStateModel>({
  name: 'uiState',
  defaults: {
    controlPaneOpen: true,
    loading: true,
    loadingText: '',
    error: {},
    snackbar: {opened: false, text: '', type: SnackbarType.success},
    indentListOpen: false
  }
})
@Injectable()
export class UIState {

  constructor() {
  }

  @Selector()
  static getSnackbar(state: UIStateModel) {
    return state.snackbar;
  }

  @Selector()
  static getLoading(state: UIStateModel) {
    return state.loading;
  }

  @Select()
  static getLoadingText(state: UIStateModel) {
    return state.loadingText;
  }

  @Selector()
  static getControlPaneState(state: UIStateModel) {
    return state.controlPaneOpen;
  }


  @Selector()
  static getError(state: UIStateModel) {
    return {
      error: state.error
    };
  }

  @Selector()
  static getIndentList(state: UIStateModel) {
    return state.indentListOpen;
  }

  @Action(OpenSnackbar)
  openSnackbar({getState, setState}: StateContext<UIStateModel>, {text, type}: OpenSnackbar) {
    const state = getState();
    setState({
      ...state,
      snackbar: {opened: true, text, type}
    });
  }

  @Action(CloseSnackbar)
  closeSnackbar({getState, setState}: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      snackbar: {
        opened: false, text: '', type: SnackbarType.success
      }
    });
  }


  @Action(ToggleControlPane)
  toggleControlPane({getState, setState}: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      controlPaneOpen: !state.controlPaneOpen
    });
  }

  @Action(OpenLoading)
  openLoading({getState, setState}: StateContext<UIStateModel>, {text}: OpenLoading) {
    const state = getState();
    setState({
      ...state,
      loadingText: text,
      loading: true,
      error: {}
    });
  }

  @Action(UpdateLoadingText)
  UpdateLoadingText({getState, setState}: StateContext<UIStateModel>, {text}: UpdateLoadingText) {
    const state = getState();
    setState({
      ...state,
      loadingText: text,
    });
  }

  @Action(CloseLoading)
  closeLoading({getState, setState, dispatch}: StateContext<UIStateModel>, {text}: CloseLoading) {
    const state = getState();
    setState({
      ...state,
      loading: false,
      loadingText: '',
      snackbar: {opened: true, text, type: SnackbarType.success}
    });
  }

  @Action(HasError)
  hasError({getState, setState}: StateContext<UIStateModel>, {error}: HasError) {
    const state = getState();
    setState({
      ...state,
      error,
      loading: false,
      loadingText: '',
      snackbar: {opened: true, text: error.msg, type: SnackbarType.error}
    });
  }

  @Action(ToggleIndentList)
  toggleIndentList({getState, setState}: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      indentListOpen: !state.indentListOpen
    })
  }

}
