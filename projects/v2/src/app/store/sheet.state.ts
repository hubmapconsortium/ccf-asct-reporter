import { SheetService } from '../services/sheet.service';
import {State, Action, StateContext, Selector, Select} from '@ngxs/store';
import { Sheet, Data } from "../models/sheet.model";
import { Error, Response } from "../models/response.model";

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { HEADER_COUNT } from "../static/config";
import { Injectable } from '@angular/core';
import { parse } from "papaparse";
import { fetchSheetData } from '../actions/sheet.actions';

export class SheetStateModel {
  data: Array<string[]>;
  sheet: Sheet;
  loading: boolean;
  error: Error;
}

@State<SheetStateModel>({
  name: 'sheetState',
  defaults: {
    data: [],
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
    loading: true,
    error: {},
  }
})
@Injectable()
export class SheetState {
  
  constructor(private sheetService: SheetService) {
  }
  
  @Selector()
  static getLoading(state: SheetStateModel) {
    return state.loading;
  }

  @Selector()
  static getData(state: SheetStateModel) {
    return state.data;
  }

  @Select()
  static getSheet(state: SheetStateModel) {
    return state.sheet;
  }
  
  @Action(fetchSheetData) 
  fetchSheetData({getState, setState, patchState}: StateContext<SheetStateModel>, {sheet}:fetchSheetData) {
    const state = getState();
    patchState({
      loading: true
    })

    return this.sheetService.fetchSheetData(sheet.sheetId, sheet.gid).pipe(
      tap((res) => {

        const parsedData = parse(res, {skipEmptyLines: true, });
        parsedData.data.splice(0, HEADER_COUNT);
        parsedData.data.map(i => {i.push(false); i.push('#ccc'); });

        setState({
          ...state,
          data: parsedData.data,
          sheet: sheet,
          loading: false,
          error: {}
        })
      }), catchError((err) => {
        console.log(err)
        setState({
          ...state,
          error: {
            msg: 'Error' // update the error to the error from the param
          },
          loading: false
        })
        return of('')
      })
    )
  }


}