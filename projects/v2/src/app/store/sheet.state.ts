import { SheetService } from '../services/sheet.service';
import {State, Action, StateContext, Selector, Select, Store} from '@ngxs/store';
import { Sheet, Data, Row, Structure, CompareData} from '../models/sheet.model';
import { Error, Response } from '../models/response.model';

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { HEADER_COUNT, SHEET_CONFIG } from '../static/config';
import { Injectable } from '@angular/core';
import { parse } from 'papaparse';
import { FetchSheetData, RefreshData, FetchDataFromAssets, FetchAllOrganData, FetchCompareData } from '../actions/sheet.actions';
import { OpenLoading, CloseLoading, UpdateLoadingText, HasError, CloseBottomSheet } from '../actions/ui.actions';
import { StateClear, StateReset } from 'ngxs-reset-plugin';
import { UIState } from './ui.state';
import { TreeState } from './tree.state';
import { ReportLog } from '../actions/logs.actions';
import { LOG_ICONS, LOG_TYPES } from '../models/logs.model';
import { patch } from '@ngxs/store/operators';

export class SheetStateModel {
  data: Row[];
  sheet: Sheet;
  version: string;
  compareData: CompareData[];
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
    compareData: []
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

  @Action(FetchCompareData)
  async fetchCompareData({getState, setState, dispatch, patchState}: StateContext<SheetStateModel>, {compareData}: FetchCompareData) {
    const state = getState();
    dispatch(new OpenLoading('Fetching data..'));
    dispatch(new CloseBottomSheet());
    console.log('CD: ', compareData)

    const organ = state.data[0].anatomical_structures[0]

    for await (const [idx, sheet] of compareData.entries()) {
      this.sheetService.fetchSheetData(sheet.sheetId, sheet.gid).subscribe(
        (res: Row[]) => {
          console.log('RES: ', res)
          for(const row of res) {
            for (const i in row.anatomical_structures) {
              row.anatomical_structures[i]['isNew'] = true
              row.anatomical_structures[i]['color'] = sheet.color;
            }
            // row.anatomical_structures.unshift(organ)

            for (const i in row.cell_types) {
              row.cell_types[i]['isNew'] = true
              row.cell_types[i]['color'] = sheet.color;
            }

            for (const i in row.biomarkers) {
              row.biomarkers[i]['isNew'] = true
              row.biomarkers[i]['color'] = sheet.color;
            }
          }

          let currentData = getState().data;
          let currentCompare = getState().compareData;
          patchState({
            data: [...currentData, ...res],
            compareData: [...currentCompare, ...[sheet]]
          })
        },
        (error) => {
          console.log(error)
        }
      )
    }

  }



  @Action(FetchAllOrganData)
  async fetchAllOrganData({getState, setState, dispatch, patchState}:StateContext<SheetStateModel>, {sheet}: FetchAllOrganData) {
    const state = getState();
    
    dispatch(new OpenLoading('Fetching data..'));
    dispatch(new StateReset(TreeState));
    dispatch(new CloseBottomSheet());
    // dispatch(new ReportLog(LOG_TYPES.MSG, sheet.display, LOG_ICONS.file));
    
    let data: Data[];
    patchState({
      sheet: sheet,
      version: 'latest',
      data: []
    })


    for await (const s of SHEET_CONFIG) {
      if (s.name !== 'all') {
        this.sheetService.fetchSheetData(s.sheetId, s.gid).subscribe(
          (res: Row[]) => {
            for(const d of res) {
              let ns: Structure = {
                name: 'Body',
                id: '',
                rdfs_label: 'NONE',
              }
              d.anatomical_structures.unshift(ns)
              d.anatomical_structures.splice(2, d.anatomical_structures.length - (2))
            }
            let currentData = getState().data;
            patchState({
              data: [...currentData, ...res],
            })
          },
          (error) => {
            console.log(error)
            const err: Error = {
              msg: `${error.name} (Status: ${error.status})`,
              status: error.status,
              hasError: true
            };
            dispatch(new ReportLog(LOG_TYPES.MSG, 'Failed to fetch data', LOG_ICONS.error))
            dispatch(new HasError(err))
            return of('')
          }
        )
      }
    }
  }

  @Action(FetchSheetData)
  fetchSheetData({getState, setState, patchState, dispatch}: StateContext<SheetStateModel>, {sheet}: FetchSheetData) {
    const state = getState();
    dispatch(new OpenLoading('Fetching data..'));
    dispatch(new StateReset(TreeState));
    dispatch(new CloseBottomSheet());
    dispatch(new ReportLog(LOG_TYPES.MSG, sheet.display, LOG_ICONS.file));

    return this.sheetService.fetchSheetData(sheet.sheetId, sheet.gid).pipe(
      tap((res: Array<any>) => {
        
        setState({
          ...state,
          data: res,
          version: 'latest',
          sheet: sheet
        });
        
        dispatch(new ReportLog(LOG_TYPES.MSG,`${sheet.display} data successfully fetched.`, LOG_ICONS.success));
        dispatch(new UpdateLoadingText('Fetch data successful. Building Visualization..'));

      }),
      catchError((error) => {
        console.log(error)
        const err: Error = {
          msg: `${error.name} (Status: ${error.status})`,
          status: error.status,
          hasError: true
        };
        dispatch(new ReportLog(LOG_TYPES.MSG, 'Failed to fetch data', LOG_ICONS.error))
        dispatch(new HasError(err))
        return of('')
      })
    );
  }

  @Action(FetchDataFromAssets)
  fetchDataFromAssets({getState, setState, dispatch}: StateContext<SheetStateModel>, {version, sheet}:FetchDataFromAssets) {
    const state = getState();
    dispatch(new OpenLoading('Fetching data from assets..'));
    dispatch(new StateReset(TreeState));
    dispatch(new CloseBottomSheet());
    dispatch(new ReportLog(LOG_TYPES.MSG, sheet.display, LOG_ICONS.file, version));

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
        dispatch(new ReportLog(LOG_TYPES.MSG,`${sheet.display} data successfully fetched from assets.`, LOG_ICONS.success, version));
        dispatch(new UpdateLoadingText('Fetch data successful. Building Visualization..'));

      }),
      catchError((error) => {
        const err: Error = {
          msg: `${error.name} (Status: ${error.status})`,
          status: error.status,
          hasError: true
        };
        dispatch(new ReportLog(LOG_TYPES.MSG, 'Failed to fetch data from assets.', LOG_ICONS.error))
        dispatch(new HasError(err))
        return of('')
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
