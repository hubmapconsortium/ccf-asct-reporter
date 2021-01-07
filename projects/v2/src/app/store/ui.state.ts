import { SheetService } from '../services/sheet.service';
import { State, Action, StateContext, Selector, Select } from '@ngxs/store';
import { Sheet, Data } from '../models/sheet.model';
import { Error, Response, SnackbarType } from '../models/response.model';
import { patch } from '@ngxs/store/operators';

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Injectable } from '@angular/core';
import { ToggleControlPane, OpenLoading, CloseLoading, UpdateLoadingText, HasError, OpenSnackbar, CloseSnackbar, ToggleIndentList, ToggleReport, CloseRightSideNav, ToggleDebugLogs, ToggleBottomSheet, OpenBottomSheet, CloseBottomSheet, OpenCompare, CloseCompare } from '../actions/ui.actions';
import { Snackbar } from '../models/ui.model';
import { ReportLog } from '../actions/logs.actions';
import { LOG_TYPES, LOG_ICONS } from '../models/logs.model';
import { UpdateBottomSheetData } from '../actions/tree.actions';

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
  bottomSheetOpen: boolean;
  compareOpen: boolean;
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
    debugLogOpen: false,
    bottomSheetOpen: false,
    compareOpen: false
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

  @Selector()
  static getBottomSheet(state: UIStateModel) {
    return state.bottomSheetOpen;
  }

  @Selector()
  static getCompareState(state: UIStateModel) {
    return state.compareOpen;
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
  hasError({ getState, setState, dispatch }: StateContext<UIStateModel>, { error }: HasError) {
    dispatch(new ReportLog(LOG_TYPES.MSG, error.msg, LOG_ICONS.error))
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
    setState({
      ...state,
      indentListOpen: false,
      reportOpen: false,
      debugLogOpen: false,
      compareOpen: false
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

  @Action(OpenBottomSheet)
  openBottomSheet({getState, setState, patchState, dispatch}: StateContext<UIStateModel>, {data}: OpenBottomSheet) {
    const state = getState();
    dispatch(new CloseBottomSheet())
    dispatch(new UpdateBottomSheetData(data)).subscribe(_ => {
      setState({
        ...state,
        bottomSheetOpen: true
      })
    })
    
  }

  @Action(CloseBottomSheet)
  closeBottomSheet({getState, setState, dispatch}: StateContext<UIStateModel>) {
    const state = getState();
    dispatch(new UpdateBottomSheetData({}));

    setState({
      ...state,
      bottomSheetOpen: false
    })
  }

  @Action(OpenCompare)
  openCompare({getState, setState}: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      compareOpen: true
    })
  }

  @Action(CloseCompare)
  closeCompare({getState, setState}: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      compareOpen: false
    })
  }
}
