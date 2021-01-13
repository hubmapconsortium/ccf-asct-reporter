import { SheetService } from '../services/sheet.service';
import {
  State,
  Action,
  StateContext,
  Selector,
  Store,
  Select,
} from '@ngxs/store';
import {
  Sheet,
  Row,
  Structure,
  CompareData,
  SheetConfig,
  ResponseData,
} from '../models/sheet.model';
import { Error } from '../models/response.model';

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { HEADER_COUNT, SHEET_CONFIG } from '../static/config';
import { Injectable } from '@angular/core';
import { parse } from 'papaparse';
import {
  FetchSheetData,
  FetchDataFromAssets,
  FetchAllOrganData,
  FetchCompareData,
  UpdateConfig,
  ToggleShowAllAS,
  UpdateReport,
  DeleteCompareSheet,
  UpdateMode,
  UpdateSheet,
  FetchInitialPlaygroundData,
} from '../actions/sheet.actions';
import {
  OpenLoading,
  UpdateLoadingText,
  HasError,
  CloseBottomSheet,
} from '../actions/ui.actions';
import { StateReset } from 'ngxs-reset-plugin';
import { TreeState } from './tree.state';
import { ReportLog } from '../actions/logs.actions';
import { LOG_ICONS, LOG_TYPES } from '../models/logs.model';

/** Class to keep track of the sheet */
export class SheetStateModel {
  /** 
   * Stores the data csv string from teh response
   * */
  csv: string;
  /** 
   * Stores the data from Google Sheets
   * */
  data: Row[];
  /** 
   * Stores the currently selected sheet
   * */
  sheet: Sheet;
  /** 
   * Stores the current version
   * */
  version: string;
  /** 
   * Stores the compare data input by the user
   * */
  compareSheets: CompareData[];
  /** 
   * Stores the compare data from the server
   * */
  compareData: Row[];
  /** 
   * Stores the configuration for a sheet such as width, height etc.
   * */
  sheetConfig: SheetConfig;
  /** 
   * Stores the data from the report
   * */
  reportData: any;
  /** 
   * Stores the mode: vis or playground
   * */
  mode: string;
  /** 
   * Stores the parsed data
   * */
  parsed: string[];
}

@State<SheetStateModel>({
  name: 'sheetState',
  defaults: {
    csv: '',
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
    compareData: [],
    reportData: {},
    mode: 'vis',
    parsed: []
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

  @Selector()
  static getCompareData(state: SheetStateModel) {
    return state.compareData;
  }

  @Selector()
  static getReportdata(state: SheetStateModel) {
    return state.reportData;
  }

  @Selector()
  static getParsedData(state: SheetStateModel) {
    return state.parsed;
  }

  @Selector()
  static getAllCompareData(state: SheetStateModel) {
    return {
      data: state.compareData,
      sheets: state.compareSheets
    };
  }

  @Selector()
  static getMode(state: SheetStateModel) {
    return state.mode;
  }

  @Action(DeleteCompareSheet)
  deleteCompareSheet({getState, setState, dispatch, patchState}: StateContext<SheetStateModel>, {i}: DeleteCompareSheet) {
    let state = getState();
    const sheets = state.compareSheets;
    sheets.splice(i, 1);

    setState({
      ...state,
      compareSheets: sheets
    });

    state = getState();
    if (state.compareSheets.length) {
      dispatch(new FetchCompareData(state.compareSheets));
    }
    else {
      setState({
        ...state,
        compareData: []
      });
      // when comparing for all organs, make sure this is checked
      dispatch(new FetchSheetData(state.sheet));
    }
  }

  @Action(FetchCompareData)
  async fetchCompareData({getState, setState, dispatch, patchState}: StateContext<SheetStateModel>, {compareData}: FetchCompareData) {
    const state = getState();
    dispatch(new OpenLoading('Fetching data..'));
    dispatch(new CloseBottomSheet());

    patchState({
      compareData: [],
      compareSheets: []
    });

    // const organ = state.data[0].anatomical_structures[0]

    for await (const [idx, sheet] of compareData.entries()) {
      this.sheetService.fetchSheetData(sheet.sheetId, sheet.gid).subscribe(
        (res: ResponseData) => {
          for (const row of res.data) {
            for (const i of row.anatomical_structures) {
              i.isNew = true;
              i.color = sheet.color;
            }
            // row.anatomical_structures.unshift(organ)

            for (const i of row.cell_types) {
              i.isNew = true;
              i.color = sheet.color;
            }

            for (const i of row.biomarkers) {
              i.isNew = true;
              i.color = sheet.color;
            }
          }

          const currentData = getState().data;
          const currentCompare = getState().compareSheets;
          const currentCompareData = getState().compareData;
          patchState({
            data: [...currentData, ...res.data],
            compareSheets: [...currentCompare, ...[sheet]],
            compareData: [...currentCompareData, ...res.data]
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }

  }



  @Action(FetchAllOrganData)
  async fetchAllOrganData({getState, setState, dispatch, patchState}: StateContext<SheetStateModel>, {sheet}: FetchAllOrganData) {


    dispatch(new OpenLoading('Fetching data..'));
    dispatch(new StateReset(TreeState));
    dispatch(new CloseBottomSheet());
    dispatch(new ReportLog(LOG_TYPES.MSG, sheet.display, LOG_ICONS.file));
    const state = getState();

    patchState({
      sheet,
      compareData: [],
      compareSheets: [],
      sheetConfig: {...sheet.config, show_ontology: state.sheetConfig.show_ontology, show_all_AS: state.sheetConfig.show_all_AS},
      version: 'latest',
      data: []
    });

    for await (const s of SHEET_CONFIG) {
      if (s.name !== 'all') {
        this.sheetService.fetchSheetData(s.sheetId, s.gid).subscribe(
          (res: ResponseData) => {
            for (const d of res.data) {
              const ns: Structure = {
                name: 'Body',
                id: '',
                rdfs_label: 'NONE',
              };
              d.anatomical_structures.unshift(ns);
              if (!state.sheetConfig.show_all_AS) {
                d.anatomical_structures.splice(2, d.anatomical_structures.length - (2));
              }
            }
            const currentData = getState().data;
            patchState({
              data: [...currentData, ...res.data],
            });
          },
          (error) => {
            console.log(error);
            const err: Error = {
              msg: `${error.name} (Status: ${error.status})`,
              status: error.status,
              hasError: true
            };
            dispatch(new ReportLog(LOG_TYPES.MSG, 'Failed to fetch data', LOG_ICONS.error));
            dispatch(new HasError(err));
            return of('');
          }
        );
      }
    }
  }

  @Action(FetchSheetData)
  fetchSheetData({getState, setState, patchState, dispatch}: StateContext<SheetStateModel>, {sheet}: FetchSheetData) {

    dispatch(new OpenLoading('Fetching data..'));
    dispatch(new StateReset(SheetState));
    dispatch(new StateReset(TreeState));
    dispatch(new CloseBottomSheet());
    dispatch(new ReportLog(LOG_TYPES.MSG, sheet.display, LOG_ICONS.file));
    const state = getState();
    return this.sheetService.fetchSheetData(sheet.sheetId, sheet.gid).pipe(
      tap((res: ResponseData) => {

        setState({
          ...state,
          csv: res.csv,
          data: res.data,
          version: 'latest',
          sheet: sheet,
          sheetConfig: {...sheet.config, show_ontology: true},
        });

        dispatch(new ReportLog(LOG_TYPES.MSG, `${sheet.display} data successfully fetched.`, LOG_ICONS.success));
        dispatch(new UpdateLoadingText('Fetch data successful. Building Visualization..'));

      }),
      catchError((error) => {
        console.log(error);
        const err: Error = {
          msg: `${error.name} (Status: ${error.status})`,
          status: error.status,
          hasError: true
        };
        dispatch(new ReportLog(LOG_TYPES.MSG, 'Failed to fetch data', LOG_ICONS.error));
        dispatch(new HasError(err));
        return of('');
      })
    );
  }

  @Action(FetchDataFromAssets)
  fetchDataFromAssets({getState, setState, dispatch}: StateContext<SheetStateModel>, {version, sheet}: FetchDataFromAssets) {
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
          version,
          data: parsedData.data,
          sheet,
          sheetConfig: {...sheet.config, show_ontology: true},
        });
        dispatch(new ReportLog(LOG_TYPES.MSG, `${sheet.display} data successfully fetched from assets.`, LOG_ICONS.success, version));
        dispatch(new UpdateLoadingText('Fetch data successful. Building Visualization..'));

      }),
      catchError((error) => {
        const err: Error = {
          msg: `${error.name} (Status: ${error.status})`,
          status: error.status,
          hasError: true
        };
        dispatch(new ReportLog(LOG_TYPES.MSG, 'Failed to fetch data from assets.', LOG_ICONS.error));
        dispatch(new HasError(err));
        return of('');
      })
    );
  }

  @Action(UpdateConfig)
  updateConfig({getState, setState, dispatch}: StateContext<SheetStateModel>, {config}: UpdateConfig) {
    const state = getState();
    setState({
      ...state,
      sheetConfig: config
    });
  }

  @Action(ToggleShowAllAS)
  ToggleShowAllAS({getState, setState, dispatch}: StateContext<SheetStateModel>) {
    const state = getState();
    const config = state.sheetConfig;
    setState({
      ...state,
      sheetConfig: {...config, show_all_AS: !state.sheetConfig.show_all_AS}
    });
  }

  @Action(UpdateReport)
  updateReport({getState, setState}: StateContext<SheetStateModel>, {reportData}: UpdateReport) {
    const state = getState();
    setState({
      ...state,
      reportData
    });
  }

  @Action(UpdateMode)
  updateMode({getState, setState}: StateContext<SheetStateModel>, {mode}: UpdateMode) {
    const state = getState();
    setState({
      ...state,
      mode: mode
    })
  }

  @Action(UpdateSheet)
  updateSheet({getState, setState}: StateContext<SheetStateModel>, {sheet}: UpdateSheet) {
    const state = getState();
    setState({
      ...state,
      sheet: sheet,
      sheetConfig: {...sheet.config, show_ontology: true},
    })
  }

  @Action(FetchInitialPlaygroundData)
  fetchInitialPlaygroundData({getState, setState, dispatch}: StateContext<SheetStateModel>) {
    const state = getState();
    dispatch(new OpenLoading('Fetching data from assets..'));
    dispatch(new StateReset(TreeState));
    dispatch(new CloseBottomSheet());
    dispatch(new ReportLog(LOG_TYPES.MSG, 'Example', LOG_ICONS.file, 'latest'));
    
    return this.sheetService.fetchPlaygroundData().pipe(
      tap((res: any) => {
        console.log(res)
        setState({
          ...state,
          parsed: res.parsed,
          csv: res.csv,
          data: res.data,
          version: 'latest',
          sheetConfig: {...state.sheet.config, show_ontology: true},
        });
      }),
      catchError((error) => {
        console.log(error);
        const err: Error = {
          msg: `${error.name} (Status: ${error.status})`,
          status: error.status,
          hasError: true
        };
        dispatch(new ReportLog(LOG_TYPES.MSG, 'Failed to fetch data', LOG_ICONS.error));
        dispatch(new HasError(err));
        return of('');
      })
    )

  }

}
