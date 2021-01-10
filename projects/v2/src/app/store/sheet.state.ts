import { SheetService } from '../services/sheet.service';
import {State, Action, StateContext, Selector, Select, Store} from '@ngxs/store';
import { Sheet, Data, Row, Structure, CompareData, SheetConfig} from '../models/sheet.model';
import { Error, Response } from '../models/response.model';

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { HEADER_COUNT, SHEET_CONFIG } from '../static/config';
import { Injectable } from '@angular/core';
import { parse } from 'papaparse';
import { FetchSheetData, RefreshData, FetchDataFromAssets, FetchAllOrganData, FetchCompareData, UpdateConfig, Toggleshow_all_AS } from '../actions/sheet.actions';
import { OpenLoading, CloseLoading, UpdateLoadingText, HasError, CloseBottomSheet } from '../actions/ui.actions';
import { StateClear, StateReset } from 'ngxs-reset-plugin';
import { UIState } from './ui.state';
import { TreeState } from './tree.state';
import { ReportLog } from '../actions/logs.actions';
import { LOG_ICONS, LOG_TYPES } from '../models/logs.model';
import { patch } from '@ngxs/store/operators';
import { UpdateBimodalConfig } from '../actions/tree.actions';

export class SheetStateModel {
  data: Row[];
  sheet: Sheet;
  version: string;
  compareSheets: CompareData[];
  compareData: Row[];
  sheetConfig: SheetConfig;
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

      body: '',
      config: {
        bimodal_distance_x: 0,
        bimodal_distance_y: 0,
        width: 0,
        height: 0,
        show_ontology: true
      },
      title: '',
    },
    sheetConfig: {
      bimodal_distance_x: 0,
      bimodal_distance_y: 0,
      width: 0,
      height: 0,
      show_ontology: true,
      show_all_AS: false
    },
    compareSheets: [],
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

  @Selector()
  static getSheet(state: SheetStateModel) {
    return state.sheet;
  }

  @Selector()
  static getSheetConfig(state: SheetStateModel) {
    return state.sheetConfig;
  }

  @Selector()
  static getCompareSheets(state: SheetStateModel) {
    return state.compareSheets;
  }

  @Action(FetchCompareData)
  async fetchCompareData({getState, setState, dispatch, patchState}: StateContext<SheetStateModel>, {compareData}: FetchCompareData) {
    const state = getState();
    dispatch(new OpenLoading('Fetching data..'));
    dispatch(new CloseBottomSheet());

    patchState({
      compareData: [],
      compareSheets: []
    })

    // const organ = state.data[0].anatomical_structures[0]

    for await (const [idx, sheet] of compareData.entries()) {
      this.sheetService.fetchSheetData(sheet.sheetId, sheet.gid).subscribe(
        (res: Row[]) => {
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
          let currentCompare = getState().compareSheets;
          let currentCompareData = getState().compareData;
          patchState({
            data: [...currentData, ...res],
            compareSheets: [...currentCompare, ...[sheet]],
            compareData: [...currentCompareData, ...res]
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
    
    
    dispatch(new OpenLoading('Fetching data..'));
    dispatch(new StateReset(TreeState));
    dispatch(new StateReset(SheetState))
    dispatch(new CloseBottomSheet());
    dispatch(new ReportLog(LOG_TYPES.MSG, sheet.display, LOG_ICONS.file));
    const state = getState();

    patchState({
      sheet: sheet,
      sheetConfig: {...sheet.config, show_ontology: state.sheetConfig.show_ontology, show_all_AS: state.sheetConfig.show_all_AS},
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
              if(!state.sheetConfig.show_all_AS) {
                d.anatomical_structures.splice(2, d.anatomical_structures.length - (2))
              }
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
    
    dispatch(new OpenLoading('Fetching data..'));
    dispatch(new StateReset(SheetState))
    dispatch(new StateReset(TreeState));
    dispatch(new CloseBottomSheet());
    dispatch(new ReportLog(LOG_TYPES.MSG, sheet.display, LOG_ICONS.file));
    const state = getState();
    return this.sheetService.fetchSheetData(sheet.sheetId, sheet.gid).pipe(
      tap((res: Array<any>) => {
        
        setState({
          ...state,
          data: res,
          version: 'latest',
          sheet: sheet,
          sheetConfig: {...sheet.config, show_ontology: true},
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
          sheetConfig: {...sheet.config, show_ontology: true},
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

  @Action(UpdateConfig)
  updateConfig({getState, setState, dispatch}: StateContext<SheetStateModel>, {config}: UpdateConfig) {
    const state = getState();
    setState({
      ...state,
      sheetConfig: config
    })
  }

  @Action(Toggleshow_all_AS)
  toggleshow_all_AS({getState, setState, dispatch}: StateContext<SheetStateModel>) {
    const state = getState();
    const config = state.sheetConfig;
    setState({
      ...state,
      sheetConfig: {...config, show_all_AS: !state.sheetConfig.show_all_AS}
    })
  }

}
