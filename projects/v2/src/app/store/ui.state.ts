import { SheetService } from '../services/sheet.service';
import { State, Action, StateContext, Selector, Select } from '@ngxs/store';
import { Sheet, Data } from '../models/sheet.model';
import { Error, Response, SnackbarType } from '../models/response.model';
import { patch } from '@ngxs/store/operators';

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Injectable } from '@angular/core';
import { ToggleControlPane, OpenLoading, CloseLoading, UpdateLoadingText, HasError, OpenSnackbar, CloseSnackbar, ToggleIndentList, ToggleReport, CloseRightSideNav, ToggleDebugLogs } from '../actions/ui.actions';
import { Snackbar } from '../models/ui.model';

export class UIStateModel {
  rightSideNavOpen: boolean;
  controlPaneOpen: boolean;
  loading: boolean;
  loadingText: string;
  error: Error;
  snackbar: Snackbar;
  indentListOpen: boolean;
  reportOpen: boolean;
  debugLogOpen: boolean;
}


@State<UIStateModel>({
  name: 'uiState',
  defaults: {
    rightSideNavOpen: false,
    controlPaneOpen: true,
    loading: true,
    loadingText: '',
    error: {},
    snackbar: { opened: false, text: '', type: SnackbarType.success },
    indentListOpen: false,
    reportOpen: false,
    debugLogOpen: false
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

  @Selector()
  static getReport(state: UIStateModel) {
    return state.reportOpen;
  }

  @Selector()
  static getRightSideNav(state: UIStateModel) {
    return state.rightSideNavOpen;
  }

  @Selector()
  static getDebugLog(state: UIStateModel) {
    return state.debugLogOpen;
  }

  @Action(OpenSnackbar)
  openSnackbar({ getState, setState }: StateContext<UIStateModel>, { text, type }: OpenSnackbar) {
    const state = getState();
    setState({
      ...state,
      snackbar: { opened: true, text, type }
    });
  }

  @Action(CloseSnackbar)
  closeSnackbar({ getState, setState }: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      snackbar: {
        opened: false, text: '', type: SnackbarType.success
      }
    });
  }


  @Action(ToggleControlPane)
  toggleControlPane({ getState, setState }: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      controlPaneOpen: !state.controlPaneOpen
    });
  }

  @Action(OpenLoading)
  openLoading({ getState, setState }: StateContext<UIStateModel>, { text }: OpenLoading) {
    const state = getState();
    setState({
      ...state,
      loadingText: text,
      loading: true,
      error: {}
    });
  }

  @Action(UpdateLoadingText)
  UpdateLoadingText({ getState, setState }: StateContext<UIStateModel>, { text }: UpdateLoadingText) {
    const state = getState();
    setState({
      ...state,
      loadingText: text,
    });
  }

  @Action(CloseLoading)
  closeLoading({ getState, setState, dispatch }: StateContext<UIStateModel>, { text }: CloseLoading) {
    const state = getState();
    setState({
      ...state,
      loading: false,
      loadingText: '',
    });

    dispatch(new OpenSnackbar(text, SnackbarType.success))
  }

  @Action(HasError)
  hasError({ getState, setState }: StateContext<UIStateModel>, { error }: HasError) {
    const state = getState();
    setState({
      ...state,
      error: error,
      loading: false,
      loadingText: '',
      snackbar: { opened: true, text: error.msg, type: SnackbarType.error }
    });
  }

  @Action(ToggleIndentList)
  toggleIndentList({ getState, setState }: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      indentListOpen: !state.indentListOpen
    })
  }

  @Action(ToggleReport)
  toggleReport({ getState, setState }: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      reportOpen: !state.reportOpen
    })
  }

  @Action(CloseRightSideNav)
  closeRightSideNav({ getState, setState }: StateContext<UIStateModel>) {
    const state = getState();
    const rsn = !state.rightSideNavOpen
    setState({
      ...state,
      indentListOpen: false,
      reportOpen: false,
      debugLogOpen: false
    })
  }

  @Action(ToggleDebugLogs)
  toggleDebugLogs({ getState, setState }: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      debugLogOpen: !state.debugLogOpen
    })
  }
}
