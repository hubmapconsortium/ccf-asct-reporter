import { State, Action, StateContext, Selector, Select, Store } from '@ngxs/store';
import { Error, SnackbarType } from '../models/response.model';
import { Injectable } from '@angular/core';
import {
  ToggleControlPane,
  OpenLoading,
  CloseLoading,
  UpdateLoadingText,
  HasError,
  OpenSnackbar,
  CloseSnackbar,
  ToggleIndentList,
  ToggleReport,
  CloseRightSideNav,
  ToggleDebugLogs,
  OpenBottomSheet,
  CloseBottomSheet,
  OpenCompare,
  CloseCompare,
  OpenSearch,
  CloseSearch,
  OpenBottomSheetDOI,
  CloseBottomSheetDOI,
} from '../actions/ui.actions';
import { Snackbar } from '../models/ui.model';
import { ReportLog } from '../actions/logs.actions';
import { LOG_TYPES, LOG_ICONS } from '../models/logs.model';
import { UpdateBottomSheetData } from '../actions/tree.actions';
import { TreeState } from './tree.state';
import { UpdateBottomSheetDOI, UpdateBottomSheetInfo } from '../actions/sheet.actions';
import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { GaAction, GaCategory } from '../models/ga.model';

/** Interface to keep track of all UI elements */
export class UIStateModel {
  /**
   * Keep track of the right sidebar
   */
  rightSideNavOpen: boolean;
  /**
   * Keep track of the control pane on the left
   */
  controlPaneOpen: boolean;
  /**
   * Is the UI in loading state
   */
  loading: boolean;
  /**
   * Store the loading state
   */
  loadingText: string;
  /**
   * Store UI in error state
   */
  error: Error;
  /**
   * Sotre snackbar state
   */
  snackbar: Snackbar;
  /**
   * Keep track of the indented list sidebar
   */
  indentListOpen: boolean;
  /**
   * Keep track of the report sidebar
   */
  reportOpen: boolean;
  /**
   * Keep track of the debug log sidebar
   */
  debugLogOpen: boolean;
  /**
   * Keep track of the bottom sheet that shows info
   */
  bottomSheetOpen: boolean;
  /**
   * Keep track of the compare sidebar
   */
  compareOpen: boolean;
  /**
   * Keep track of the search panel state
   */
  searchOpen: boolean;
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
    compareOpen: false,
    searchOpen: false
  }
})
@Injectable()
export class UIState {

  constructor(public store: Store, public ga: GoogleAnalyticsService) {
  }

  /**
   * Select the snackbar state
   *
   * @param state - UI State Model
   */
  @Selector()
  static getSnackbar(state: UIStateModel) {
    return state.snackbar;
  }

  /**
   * Select the loading state
   *
   * @param state - UI State Model
   */
  @Selector()
  static getLoading(state: UIStateModel) {
    return state.loading;
  }

  /**
   * Select the loading text
   *
   * @param state - UI State Model
   */
  @Select()
  static getLoadingText(state: UIStateModel) {
    return state.loadingText;
  }

  /**
   * Select control pane state
   *
   * @param state - UI State Model
   */
  @Selector()
  static getControlPaneState(state: UIStateModel) {
    return state.controlPaneOpen;
  }

  /**
   * Select the error state
   *
   * @param state - UI State Model
   */
  @Selector()
  static getError(state: UIStateModel) {
    return {
      error: state.error
    };
  }

  /**
   * Select indented list sidenav state
   *
   * @param state - UI State Model
   */
  @Selector()
  static getIndentList(state: UIStateModel) {
    return state.indentListOpen;
  }

  /**
   * Select the report sidenav state
   *
   * @param state - UI State Model
   */
  @Selector()
  static getReport(state: UIStateModel) {
    return state.reportOpen;
  }

  /**
   * Select the right sidenav state
   *
   * @param state - UI State Model
   */
  @Selector()
  static getRightSideNav(state: UIStateModel) {
    return state.rightSideNavOpen;
  }

  /**
   * Select the debug sidenav state
   *
   * @param state - UI State Model
   */
  @Selector()
  static getDebugLog(state: UIStateModel) {
    return state.debugLogOpen;
  }

  /**
   * Select the bottom sheet state
   *
   * @param state - UI State Model
   */
  @Selector()
  static getBottomSheet(state: UIStateModel) {
    return state.bottomSheetOpen;
  }

  /**
   * Select the compare sidenav state
   *
   * @param state - UI State Model
   */
  @Selector()
  static getCompareState(state: UIStateModel) {
    return state.compareOpen;
  }

  /**
   * Select the search panel state
   *
   * @param state - UI State Model
   */
  @Selector()
  static getSearchState(state: UIStateModel) {
    return state.searchOpen;
  }

  /**
   * Action to open snackbar. Update the UI State by setting the
   * snackbar state to true and text
   */
  @Action(OpenSnackbar)
  openSnackbar({ getState, setState }: StateContext<UIStateModel>, { text, type }: OpenSnackbar) {
    const state = getState();
    setState({
      ...state,
      snackbar: { opened: true, text, type }
    });
  }

  /**
   * Action to close snackbar. Update the UI State by setting the
   * snackbar state to false and success state
   */
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

  /**
   * Action to toggle control pane by inverting the current state
   */
  @Action(ToggleControlPane)
  toggleControlPane({ getState, setState }: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      controlPaneOpen: !state.controlPaneOpen
    });
    this.ga.eventEmitter('nav_control_pane', GaCategory.NAVBAR, 'Toggle Control Pane', GaAction.TOGGLE, getState().controlPaneOpen);
  }

  /**
   * Action to open loading. Set loading to true and text to text
   */
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

  /**
   * Action to update loading text
   */
  @Action(UpdateLoadingText)
  UpdateLoadingText({ getState, setState }: StateContext<UIStateModel>, { text }: UpdateLoadingText) {
    const state = getState();
    setState({
      ...state,
      loadingText: text,
    });
  }

  /**
   * Action to close loading. Set loading to false and clear loading text
   */
  @Action(CloseLoading)
  closeLoading({ getState, setState, dispatch }: StateContext<UIStateModel>, { text }: CloseLoading) {
    const state = getState();
    setState({
      ...state,
      loading: false,
      loadingText: '',
    });

    dispatch(new OpenSnackbar(text, SnackbarType.success));
  }

  /**
   * Action to update error state.
   * Close loading and open snackbar with appropriate message and type
   */
  @Action(HasError)
  hasError({ getState, setState, dispatch }: StateContext<UIStateModel>, { error }: HasError) {
    dispatch(new ReportLog(LOG_TYPES.MSG, error.msg, LOG_ICONS.error));
    const state = getState();
    setState({
      ...state,
      error,
      loading: false,
      loadingText: '',
      snackbar: { opened: true, text: error.msg, type: SnackbarType.error }
    });
  }

  /**
   * Action to toggle Indent list sidebar
   */
  @Action(ToggleIndentList)
  toggleIndentList({ getState, setState }: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      indentListOpen: !state.indentListOpen
    });
    this.ga.eventEmitter('nav_indent_list', GaCategory.NAVBAR, 'Toggle Indent List', GaAction.TOGGLE, getState().indentListOpen);
  }

  /**
   * Action to toggle Report sidebar
   */
  @Action(ToggleReport)
  toggleReport({ getState, setState }: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      reportOpen: !state.reportOpen
    });
    this.ga.eventEmitter('nav_report', GaCategory.NAVBAR, 'Toggle Report', GaAction.TOGGLE, getState().reportOpen);
  }

  /**
   * Action to close right side. Set Report, IL, Debug Log, Compare to false.
   */
  @Action(CloseRightSideNav)
  closeRightSideNav({ getState, setState }: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      indentListOpen: false,
      reportOpen: false,
      debugLogOpen: false,
      compareOpen: false
    });
    this.ga.eventEmitter('nav_close_right_sidenav', GaCategory.NAVBAR, 'Close All Right-Sidenav Elements ', GaAction.CLICK, false);
  }

  /**
   * Action to toggle debug logs sidebar
   */
  @Action(ToggleDebugLogs)
  toggleDebugLogs({ getState, setState }: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      debugLogOpen: !state.debugLogOpen
    });
    this.ga.eventEmitter('nav_debug_logs', GaCategory.NAVBAR, 'Toggle Debug Logs', GaAction.TOGGLE, getState().debugLogOpen);
  }

  /**
   * Action to open bottom sheet. Accept the data (name of structure)
   * First close the bottom sheet, incase it is open.
   * Then dispatch new action to update bottom sheet data
   */
  @Action(OpenBottomSheet)
  openBottomSheet({ getState, setState, dispatch }: StateContext<UIStateModel>, { data }: OpenBottomSheet) {
    const state = getState();
    dispatch(new CloseBottomSheet());
    dispatch(new CloseBottomSheetDOI());
    dispatch(new UpdateBottomSheetData(data)).subscribe(_unused => {
      setState({
        ...state,
        bottomSheetOpen: true
      });
    });
    dispatch(new UpdateBottomSheetInfo(data));
  }

  /**
   * Action to open bottom sheet DOI. Accept the data (name of structure)
   * First close the bottom sheet Info, incase it is open.
   * Second close the bottom sheet DOI, incase it is open.
   * Then dispatch new action to update bottom sheet data DOI
   */
  @Action(OpenBottomSheetDOI)
  OpenBottomSheetDOI({ getState, setState, dispatch }: StateContext<UIStateModel>, { data }: OpenBottomSheetDOI) {
    dispatch(new CloseBottomSheet());
    dispatch(new CloseBottomSheetDOI());
    dispatch(new UpdateBottomSheetDOI(data));

  }

  /**
  * Action to close bottom sheet.
  * Empty the bottom sheet data from the state
  */
  @Action(CloseBottomSheetDOI)
  closeBottomSheetDOI({ dispatch }: StateContext<UIStateModel>) {
    dispatch(new UpdateBottomSheetData({}));
  }

  /**
   * Action to close bottom sheet.
   * Empty the bottom sheet data from the state
   * Set the bottom sheet open variable to false
   */
  @Action(CloseBottomSheet)
  closeBottomSheet({ getState, setState, dispatch }: StateContext<UIStateModel>) {
    const state = getState();
    dispatch(new UpdateBottomSheetData({}));

    const view = this.store.selectSnapshot(TreeState.getVegaView);
    if (Object.entries(view).length) { view.signal('bimodal_text__click', {}); }

    setState({
      ...state,
      bottomSheetOpen: false
    });
  }

  /**
   * Action to open compare sidenav
   */
  @Action(OpenCompare)
  openCompare({ getState, setState }: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      compareOpen: true
    });
    this.ga.eventEmitter('nav_compare_open', GaCategory.NAVBAR, 'Open Compare', GaAction.CLICK, getState().compareOpen);
  }

  /**
   * Action to close compare sidenav
   */
  @Action(CloseCompare)
  closeCompare({ getState, setState }: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      compareOpen: false
    });
    this.ga.eventEmitter('nav_compare_close', GaCategory.NAVBAR, 'Close Compare', GaAction.CLICK, getState().compareOpen);
  }

  @Action(OpenSearch)
  openSearch({ getState, setState }: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      searchOpen: true
    });
    this.ga.eventEmitter('nav_search_open', GaCategory.NAVBAR, 'Open Search', GaAction.CLICK, getState().searchOpen);
  }

  @Action(CloseSearch)
  closeSearch({ getState, setState }: StateContext<UIStateModel>) {
    const state = getState();
    setState({
      ...state,
      searchOpen: false
    });
    this.ga.eventEmitter('nav_search_close', GaCategory.NAVBAR, 'Close Search', GaAction.CLICK, getState().searchOpen);
  }
}
