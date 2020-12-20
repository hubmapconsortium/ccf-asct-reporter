import { SheetService } from '../services/sheet.service';
import {State, Action, StateContext, Selector, Select, Store} from '@ngxs/store';
import { Sheet, Data } from '../models/sheet.model';
import { Error, Response } from '../models/response.model';

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { HEADER_COUNT } from '../static/config';
import { Injectable } from '@angular/core';
import { parse } from 'papaparse';
import { FetchSheetData, RefreshData, FetchDataFromAssets } from '../actions/sheet.actions';
import { OpenLoading, CloseLoading, UpdateLoadingText } from '../actions/ui.actions';
import { StateClear, StateReset } from 'ngxs-reset-plugin';
import { UIState } from './ui.state';
import { TreeState } from './tree.state';

export class SheetStateModel {
  data: Array<string[]>;
  sheet: Sheet;
  version: string;
}

@State<SheetStateModel>({
  name: 'sheetState',
  defaults: {
    data: [],
    version: 'latest',
    sheet: {
      name: '',
      display: '',
      sheetId: '',
      gid: '',
      header_count: 0,
      cell_col: 0,
      marker_col: 0,
      uberon_col: 0,
      report_cols: [],
      tree_cols: [],
      indent_cols: [],
      body: '',
      config: {
        bimodal_distance: 0,
        width: 0,
        width_offset: 0,
        height_offset: 0,
      },
      title: '',
    },
    
  }
})
@Injectable()
export class SheetState {

  constructor(private sheetService: SheetService, private store: Store) {
  }

  @Selector()
  static getData(state: SheetStateModel) {
    return state.data;
  }

  @Select()
  static getSheet(state: SheetStateModel) {
    return state.sheet;
  }

  @Action(FetchSheetData)
  fetchSheetData({getState, setState, patchState, dispatch}: StateContext<SheetStateModel>, {sheet}: FetchSheetData) {
    const state = getState();
    this.store.dispatch(new OpenLoading('Fetching data..'));
    dispatch(new StateReset(TreeState))
    return this.sheetService.fetchSheetData(sheet.sheetId, sheet.gid).pipe(
      tap((res) => {

        const parsedData = parse(res, {skipEmptyLines: true, });
        parsedData.data.splice(0, HEADER_COUNT);
        parsedData.data.map(i => {i.push(false); i.push('#ccc'); });

        setState({
          ...state,
          data: parsedData.data,
          version: 'latest',
          sheet: sheet
        });

        this.store.dispatch(new UpdateLoadingText('Fetch data successful. Building Visualization..'));

      })
    );
  }

  @Action(FetchDataFromAssets)
  fetchDataFromAssets({getState, setState, dispatch}: StateContext<SheetStateModel>, {version, sheet}:FetchDataFromAssets) {
    const state = getState();
    this.store.dispatch(new OpenLoading('Fetching data from assets..'));
    dispatch(new StateReset(TreeState));
    // dispatch(new StateReset(SheetState));

    console.log('VERSION:', version)
    return this.sheetService.fetchDataFromAssets(version, sheet).pipe(
      tap((res) => {

        const parsedData = parse(res, {skipEmptyLines: true, });
        parsedData.data.splice(0, HEADER_COUNT);
        parsedData.data.map(i => {i.push(false); i.push('#ccc'); });

        setState({
          ...state,
          version: version,
          data: parsedData.data,
          sheet: sheet,
        });

        this.store.dispatch(new UpdateLoadingText('Fetch data successful. Building Visualization..'));

      })
    );
  }

  @Action(RefreshData)
  refreshData({dispatch}: StateContext<SheetStateModel>) {
    // dispatch(new StateReset(TreeState)).subscribe(s => {
    //   dispatch(new FetchSheetData(s.sheetState.sheet))
    // })

  }


}
