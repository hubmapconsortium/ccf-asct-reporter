import { SheetService } from '../services/sheet.service';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import { Sheet, Data } from "../models/sheet.model";
import { Error, Response } from "../models/response.model";

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import SC from "../static/config";
import { Injectable } from '@angular/core';
import { parse } from "papaparse";
import { fetchSheetData, updateVegaSpec } from '../actions/sheet.actions';

export class SheetStateModel {
  data: any;
  sheet: Sheet;
  loading: boolean;
  error: Error;
  spec: any;
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
    spec: {}
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

  // @Selector()
  // static getVegaSpec(state: SheetStateModel) {
  //   return state.spec;
  // }

  // @Action(updateVegaSpec)
  // updateVegaSpec({getState, setState, patchState}: StateContext<SheetStateModel>, {spec}: updateVegaSpec) {
  //   patchState({
  //     spec: spec
  //   })
  // }
  
  @Action(fetchSheetData) 
  fetchSheetData({getState, setState, patchState}: StateContext<SheetStateModel>, {sheet}:fetchSheetData) {
    const state = getState();
    patchState({
      loading: true
    })

    return this.sheetService.fetchSheetData(sheet.sheetId, sheet.gid).pipe(
      tap((res) => {

        const parsedData = parse(res, {skipEmptyLines: true, });
        parsedData.data.splice(0, SC.HEADER_COUNT);
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