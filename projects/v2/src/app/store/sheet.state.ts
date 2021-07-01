import { SheetService } from '../services/sheet.service';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  Sheet,
  Row,
  Structure,
  CompareData,
  SheetConfig,
  ResponseData,
  SheetInfo,
  DOI,
} from '../models/sheet.model';
import { Error } from '../models/response.model';
import { tap, catchError } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
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
  UpdatePlaygroundData,
  UpdateBottomSheetInfo,
  UpdateBottomSheetDOI,
  FetchSheetDataFromCSV,
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
   * Stores the data csv string from the response
   */
  csv: string;
  /**
   * Stores the data from Google Sheets
   */
  data: Row[];
  /**
   * Stores the currently selected sheet
   */
  sheet: Sheet;
  /**
   * Stores the current version
   */
  version: string;
  /**
   * Stores the compare data input by the user
   */
  compareSheets: CompareData[];
  /**
   * Stores the compare data from the server
   */
  compareData: Row[];
  /**
   * Stores the configuration for a sheet such as width, height etc.
   */
  sheetConfig: SheetConfig;
  /**
   * Stores the data from the report
   */
  reportData: any;
  /**
   * Stores the mode: vis or playground
   */
  mode: string;
  /**
   * Stores the parsed data
   */
  parsed: string[][];
  /**
   * Stores the bottom sheet info data
   */
  bottomSheetInfo: SheetInfo;
  /**
   * Stores the DOI references data
   */
  bottomSheetDOI: DOI[];
  /**
   * Stores the full anatomical structures data when all organs is clicked.
   */
  fullAsData: Row[];
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
      config: {
        bimodal_distance_x: 0,
        bimodal_distance_y: 0,
        width: 0,
        height: 0,
        show_ontology: true,
      },
      title: '',
    },
    sheetConfig: {
      bimodal_distance_x: 0,
      bimodal_distance_y: 0,
      width: 0,
      height: 0,
      show_ontology: true,
      show_all_AS: false,
    },
    compareSheets: [],
    compareData: [],
    reportData: {},
    mode: 'vis',
    parsed: [],
    bottomSheetInfo: {
      name: '',
      ontologyId: '',
      iri: '',
      label: '',
      desc: 'null',
      hasError: false,
      msg: '',
      status: 0,
    },
    bottomSheetDOI: [],
    fullAsData: []
  },
})
@Injectable()
export class SheetState {
  constructor(private sheetService: SheetService) {}
  faliureMsg = 'Failed to fetch data';

  /**
   * Returns an observable that watches the data
   */
  @Selector()
  static getData(state: SheetStateModel) {
    return state.data;
  }

  /**
   * Returns an observable that watches the sheet
   */
  @Selector()
  static getSheet(state: SheetStateModel) {
    return state.sheet;
  }

  /**
   * Returns an observable that watches the sheet config
   */
  @Selector()
  static getSheetConfig(state: SheetStateModel) {
    return state.sheetConfig;
  }

  /**
   * Returns an observable that watches the linked compare documents
   */
  @Selector()
  static getCompareSheets(state: SheetStateModel) {
    return state.compareSheets;
  }

  /**
   * Returns an observable that watches all the data from the linked compare documents
   */
  @Selector()
  static getCompareData(state: SheetStateModel) {
    return state.compareData;
  }

  /**
   * Returns an observable that watches the report data
   * This is used for the global report
   */
  @Selector()
  static getReportdata(state: SheetStateModel) {
    return state.reportData;
  }

  /**
   * Returns an observable that watches the parsed sheet data
   * Parsed using papa parse
   */
  @Selector()
  static getParsedData(state: SheetStateModel) {
    return state.parsed;
  }

  /**
   * Returns an observable that watches the compare sheets and the compare data
   */
  @Selector()
  static getAllCompareData(state: SheetStateModel) {
    return {
      data: state.compareData,
      sheets: state.compareSheets,
    };
  }

  /**
   * Returns an observable that watches the bottom sheet info data
   */
  @Selector()
  static getBottomSheetInfo(state: SheetStateModel) {
    return state.bottomSheetInfo;
  }

  /**
   * Returns an observable that watches the bottom sheet DOI data
   */
  @Selector()
  static getBottomSheetDOI(state: SheetStateModel) {
    return state.bottomSheetDOI;
  }

  /**
   * Returns an observable that watches the fullAsData  data
   */
   @Selector()
   static getFullAsData(state: SheetStateModel) {
     return state.fullAsData;
   }

  /**
   * Returns an observable that watches the mode
   * values: [playground, vis]
   */
  @Selector()
  static getMode(state: SheetStateModel) {
    return state.mode;
  }

  /**
   * Action to delete a linked sheet from the state.
   * Accepts the index location of the sheet that is to be deleted
   */
  @Action(DeleteCompareSheet)
  deleteCompareSheet(
    { getState, setState, dispatch, patchState }: StateContext<SheetStateModel>,
    { i }: DeleteCompareSheet
  ) {
    let state = getState();
    const sheets = state.compareSheets;
    sheets.splice(i, 1);

    setState({
      ...state,
      compareSheets: sheets,
    });

    state = getState();
    if (state.compareSheets.length) {
      dispatch(new FetchCompareData(state.compareSheets));
    } else {
      setState({
        ...state,
        compareData: [],
      });
      // when comparing for all organs, make sure this is checked
      dispatch(new FetchSheetData(state.sheet));
    }
  }

  /**
   * Action to fetch all the compare data form the linked sheets
   * Accepts all the linked sheets that contains the google sheet link,
   * sheet name, description and color
   */
  @Action(FetchCompareData)
  async fetchCompareData(
    { getState, setState, dispatch, patchState }: StateContext<SheetStateModel>,
    { compareData }: FetchCompareData
  ) {
    dispatch(new OpenLoading('Fetching data...'));
    dispatch(new CloseBottomSheet());

    patchState({
      compareData: [],
      compareSheets: [],
    });

    const organ: Structure = {
      name: 'Body',
      id: '',
    };

    for await (const [_, sheet] of compareData.entries()) {
      this.sheetService.fetchSheetData(sheet.sheetId, sheet.gid).subscribe(
        (res: ResponseData) => {
          for (const row of res.data) {
            for (const i of row.anatomical_structures) {
              i.isNew = true;
              i.color = sheet.color;
            }
            row.anatomical_structures.unshift(organ);

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
            compareData: [...currentCompareData, ...res.data],
          });
        },
        (error) => {
          console.log(error);
          const err: Error = {
            msg: `${error.name} (Status: ${error.status})`,
            status: error.status,
            hasError: true,
            hasGidError: !(sheet.gid || sheet.gid === '0')
          };
          dispatch(
            new ReportLog(LOG_TYPES.MSG, this.faliureMsg, LOG_ICONS.error)
          );
          dispatch(new HasError(err));
          return of('');
        }
      );
    }
  }

  /**
   * Action to fetch all organ data using forkJoin rxjs
   * Accepts the sheet config
   */
  @Action(FetchAllOrganData)
  async fetchAllOrganData(
    { getState, dispatch, patchState }: StateContext<SheetStateModel>,
    { sheet }: FetchAllOrganData
  ) {
    dispatch(new OpenLoading('Fetching data...'));
    dispatch(new StateReset(TreeState));
    dispatch(new CloseBottomSheet());
    dispatch(new ReportLog(LOG_TYPES.MSG, sheet.display, LOG_ICONS.file));
    const state = getState();

    patchState({
      sheet,
      compareData: [],
      compareSheets: [],
      sheetConfig: {
        ...sheet.config,
        show_ontology: state.sheetConfig.show_ontology,
        show_all_AS: state.sheetConfig.show_all_AS,
      },
      version: 'latest',
      data: [],
    });

    const requests$: Array<Observable<any>> = [];
    let dataAll: Row[] = [];
    const organsNames: string[] = [];
    for (const s of SHEET_CONFIG) {
      if (s.name === 'all' || s.name === 'example') {
        continue;
      } else {
        requests$.push(this.sheetService.fetchSheetData(s.sheetId, s.gid));
        organsNames.push(s.name);
      }
    }
    let asData = [];
    forkJoin(requests$).subscribe(
      (allresults) => {
        allresults.map((res: ResponseData, i) => {
          for (const row of res.data) {
            row.organName = organsNames[i];
            const newStructure: Structure = {
              name: 'Body',
              id: '',
              rdfs_label: 'NONE',
            };
            row.anatomical_structures.unshift(newStructure);
          }
          asData = JSON.parse(JSON.stringify([...asData, ...res.data]));
          for (const row of res.data) {
            if (!state.sheetConfig.show_all_AS) {
              row.anatomical_structures.splice(
                2,
                row.anatomical_structures.length - 2
              );
            }
          }
          dataAll = [...dataAll, ...res.data];
        });
        patchState({
          data: dataAll,
          fullAsData: asData
        });
      },
      (error) => {
        const err: Error = {
          msg: `${error.name} (Status: ${error.status})`,
          status: error.status,
          hasError: true,
        };
        dispatch(
          new ReportLog(LOG_TYPES.MSG, this.faliureMsg, LOG_ICONS.error)
        );
        dispatch(new HasError(err));
        return of('');
      }
    );
  }

  /**
   * Action to fetch the sheet data. Resets the Sheet State and teh Tree State
   * Accepts the sheet config of the particular sheet
   */
  @Action(FetchSheetData)
  fetchSheetData(
    { getState, setState, dispatch, patchState }: StateContext<SheetStateModel>,
    { sheet }: FetchSheetData
  ) {
    const mode = getState().mode;
    dispatch(new OpenLoading('Fetching data...'));
    // dispatch(new StateReset(SheetState));
    dispatch(new StateReset(TreeState));
    dispatch(new CloseBottomSheet());
    dispatch(new ReportLog(LOG_TYPES.MSG, sheet.display, LOG_ICONS.file));
    patchState({ sheet });
    const state = getState();

    return this.sheetService.fetchSheetData(sheet.sheetId, sheet.gid).pipe(
      tap((res: ResponseData) => {
        res.data = this.sheetService.getDataWithBody(res.data);
        setState({
          ...state,
          compareData: [],
          compareSheets: [],
          reportData: [],
          csv: res.csv,
          data: res.data,
          version: 'latest',
          parsed: res.parsed,
          mode,
          sheetConfig: { ...sheet.config, show_ontology: true },
        });

        dispatch(
          new ReportLog(
            LOG_TYPES.MSG,
            `${sheet.display} data successfully fetched.`,
            LOG_ICONS.success
          )
        );
        dispatch(
          new UpdateLoadingText(
            'Fetch data successful. Building Visualization..'
          )
        );
      }),
      catchError((error) => {
        console.log(error);
        const err: Error = {
          msg: `${error.name} (Status: ${error.status})`,
          status: error.status,
          hasError: true,
          hasGidError: !(sheet.gid || sheet.gid === '0')
        };
        dispatch(
          new ReportLog(LOG_TYPES.MSG, this.faliureMsg, LOG_ICONS.error)
        );
        dispatch(new HasError(err));
        return of('');
      })
    );
  }

  /**
   * Action to fetch the sheet data for the CSV files. Resets the Sheet State
   * Accepts the sheet config of the particular sheet
   */
  @Action(FetchSheetDataFromCSV)
  fetchSheetDataFromCSV(
    { getState, setState, dispatch, patchState }: StateContext<SheetStateModel>,
    { sheet, url }: FetchSheetDataFromCSV
  ) {
    const mode = getState().mode;
    dispatch(new OpenLoading('Fetching data...'));
    dispatch(new StateReset(TreeState));
    dispatch(new CloseBottomSheet());
    dispatch(new ReportLog(LOG_TYPES.MSG, sheet.display, LOG_ICONS.file));

    patchState({ sheet });
    const state = getState();

    return this.sheetService.fetchDataFromCSV(url).pipe(
      tap((res: ResponseData) => {
        res.data = this.sheetService.getDataWithBody(res.data);

        setState({
          ...state,
          compareData: [],
          compareSheets: [],
          reportData: [],
          csv: res.csv,
          data: res.data,
          version: 'latest',
          parsed: res.parsed,
          mode,
          sheetConfig: { ...sheet.config, show_ontology: true },
        });

        dispatch(
          new ReportLog(
            LOG_TYPES.MSG,
            `${sheet.display} data successfully fetched from CSV file url.`,
            LOG_ICONS.success
          )
        );

        dispatch(
          new UpdateLoadingText(
            'Fetch data from CSV file successful. Building Visualization..'
          )
        );
      }),
      catchError((error) => {
        const err: Error = {
          msg: `${error.name} (Status: ${error.status})`,
          hasError: true,
          status: error.status,
        };
        dispatch(
          new ReportLog(LOG_TYPES.MSG, this.faliureMsg, LOG_ICONS.error)
        );
        dispatch(new HasError(err));
        return of('');
      })
    );
  }
  /**
   * Action to fetch data from assets
   * CURRENTLY DEPRICATED IN V2
   */
  @Action(FetchDataFromAssets)
  fetchDataFromAssets(
    { getState, setState, dispatch }: StateContext<SheetStateModel>,
    { version, sheet }: FetchDataFromAssets
  ) {
    const state = getState();
    dispatch(new OpenLoading('Fetching data from assets...'));
    dispatch(new StateReset(TreeState));
    dispatch(new CloseBottomSheet());
    dispatch(
      new ReportLog(LOG_TYPES.MSG, sheet.display, LOG_ICONS.file, version)
    );

    return this.sheetService.fetchDataFromAssets(version, sheet).pipe(
      tap((res) => {
        const parsedData = parse(res, { skipEmptyLines: true });
        parsedData.data.splice(0, HEADER_COUNT);
        parsedData.data.map((i) => {
          i.push(false);
          i.push('#ccc');
        });

        setState({
          ...state,
          version,
          data: parsedData.data,
          sheet,
          sheetConfig: { ...sheet.config, show_ontology: true },
        });
        dispatch(
          new ReportLog(
            LOG_TYPES.MSG,
            `${sheet.display} data successfully fetched from assets.`,
            LOG_ICONS.success,
            version
          )
        );
        dispatch(
          new UpdateLoadingText(
            'Fetch data successful. Building Visualization..'
          )
        );
      }),
      catchError((error) => {
        const err: Error = {
          msg: `${error.name} (Status: ${error.status})`,
          status: error.status,
          hasError: true,
        };
        dispatch(
          new ReportLog(
            LOG_TYPES.MSG,
            'Failed to fetch data from assets.',
            LOG_ICONS.error
          )
        );
        dispatch(new HasError(err));
        return of('');
      })
    );
  }

  /**
   * Action to update the sheet configuration
   * Accepts the config that states the differetn sheet control's configuration
   */
  @Action(UpdateConfig)
  updateConfig(
    { getState, setState, dispatch }: StateContext<SheetStateModel>,
    { config }: UpdateConfig
  ) {
    const state = getState();
    setState({
      ...state,
      sheetConfig: config,
    });
  }

  /**
   * Action to toggle the show all AS in the All Organs Visualization
   */
  @Action(ToggleShowAllAS)
  ToggleShowAllAS({ getState, setState }: StateContext<SheetStateModel>) {
    const state = getState();
    const config = state.sheetConfig;
    setState({
      ...state,
      sheetConfig: { ...config, show_all_AS: !state.sheetConfig.show_all_AS },
    });
  }

  /**
   * Action to update the report data
   */
  @Action(UpdateReport)
  updateReport(
    { getState, setState }: StateContext<SheetStateModel>,
    { reportData }: UpdateReport
  ) {
    const state = getState();
    setState({
      ...state,
      reportData,
    });
  }

  /**
   * Action to update the mode
   */
  @Action(UpdateMode)
  updateMode(
    { getState, setState }: StateContext<SheetStateModel>,
    { mode }: UpdateMode
  ) {
    const state = getState();
    setState({
      ...state,
      mode,
    });
  }

  /**
   * Action to update the the sheet
   * Accepts the sheet config
   */
  @Action(UpdateSheet)
  updateSheet(
    { getState, setState }: StateContext<SheetStateModel>,
    { sheet }: UpdateSheet
  ) {
    const state = getState();
    setState({
      ...state,
      sheet,
      sheetConfig: { ...sheet.config, show_ontology: true },
    });
  }

  /**
   * Action to fetch initial playground data. This makes a call to the playground api
   * that fetches the initial exmaple CSV
   */
  @Action(FetchInitialPlaygroundData)
  fetchInitialPlaygroundData({
    getState,
    setState,
    dispatch,
  }: StateContext<SheetStateModel>) {
    const sheet: Sheet = SHEET_CONFIG.find((i) => i.name === 'example');
    const mode = getState().mode;
    dispatch(new OpenLoading('Fetching playground data...'));
    dispatch(new StateReset(TreeState));
    dispatch(new CloseBottomSheet());
    dispatch(new ReportLog(LOG_TYPES.MSG, 'Example', LOG_ICONS.file, 'latest'));
    const state = getState();
    const organ: Structure = {
      name: 'Body',
      id: '',
    };

    return this.sheetService.fetchPlaygroundData().pipe(
      tap((res: any) => {
        res.data.forEach((row) => {
          row.anatomical_structures.unshift(organ);
        });

        setState({
          ...state,
          compareData: [],
          compareSheets: [],
          parsed: res.parsed,
          csv: res.csv,
          data: res.data,
          version: 'latest',
          mode,
          sheet,
          sheetConfig: { ...sheet.config, show_ontology: true },
        });
      }),
      catchError((error) => {
        console.log(error);
        const err: Error = {
          msg: `${error.name} (Status: ${error.status})`,
          status: error.status,
          hasError: true,
        };
        dispatch(
          new ReportLog(LOG_TYPES.MSG, this.faliureMsg, LOG_ICONS.error)
        );
        dispatch(new HasError(err));
        return of('');
      })
    );
  }

  /**
   * Action to update the current data in the table (in the playground)
   * Accepts the parsed data
   */
  @Action(UpdatePlaygroundData)
  updatePlaygroundData(
    { getState, setState, dispatch }: StateContext<SheetStateModel>,
    { data }: UpdatePlaygroundData
  ) {
    const state = getState();
    dispatch(new OpenLoading('Fetching playground data...'));
    dispatch(new StateReset(TreeState));
    dispatch(new CloseBottomSheet());
    dispatch(
      new ReportLog(
        LOG_TYPES.MSG,
        'Updated Playground Data',
        LOG_ICONS.file,
        'latest'
      )
    );
    const organ: Structure = {
      name: 'Body',
      id: '',
    };

    return this.sheetService.updatePlaygroundData(data).pipe(
      tap((res: any) => {
        res.data.forEach((row) => {
          row.anatomical_structures.unshift(organ);
        });
        setState({
          ...state,
          parsed: res.parsed,
          csv: res.csv,
          data: res.data,
          version: 'latest',
          sheetConfig: { ...state.sheet.config, show_ontology: true },
        });
      }),
      catchError((error) => {
        console.log(error);
        const err: Error = {
          msg: `${error.name} (Status: ${error.status})`,
          status: error.status,
          hasError: true,
        };
        dispatch(
          new ReportLog(LOG_TYPES.MSG, this.faliureMsg, LOG_ICONS.error)
        );
        dispatch(new HasError(err));
        return of('');
      })
    );
  }

  /**
   * Action to update the bottom sheet data in the indentlist (in the Info)
   * Accepts the parsed data
   */
  @Action(UpdateBottomSheetInfo)
  updateBottomSheetInfo(
    { getState, setState, dispatch }: StateContext<SheetStateModel>,
    { data }: UpdateBottomSheetInfo
  ) {

    // Get initial state and blank it out while fetching new data.
    const state = getState();
    setState({
      ...state,
      bottomSheetInfo: {
        ...state.bottomSheetInfo,
        name: '',
        desc: '',
        iri: ''
      }
    });

    // Call the appropriate API and fetch ontology data
    return this.sheetService.fetchBottomSheetData(data.ontologyId, data.name).pipe(
      tap((res: any) => {
        setState({
          ...state,
          bottomSheetInfo: res,
        });
      }),
      catchError((error) => {
        setState({
          ...state,
          bottomSheetInfo: {
            name: data.name,
            ontologyId: data.ontologyId,
            iri: '',
            label: '',
            desc: '',
            hasError: true,
            msg: error.message,
            status: error.status,
          },
        });
        const err: Error = {
          msg: `${error.name} (Status: ${error.status})`,
          status: error.status,
          hasError: true,
        };
        console.log(err);
        dispatch(
          new ReportLog(LOG_TYPES.MSG, this.faliureMsg, LOG_ICONS.error)
        );
        return of('');
      })
    );
  }

  /**
   * Action to update the bottom sheet data in the DOI
   * Accepts the parsed data
   */
  @Action(UpdateBottomSheetDOI)
  updateBottomSheetDOI(
    { getState, setState, dispatch }: StateContext<SheetStateModel>,
    { data }: UpdateBottomSheetDOI
  ) {
    const state = getState();
    setState({
      ...state,
      bottomSheetDOI: data,
    });
  }
}
