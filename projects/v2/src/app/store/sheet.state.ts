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
  VersionDetail,
  SheetDetails,
} from '../models/sheet.model';
import { Error } from '../models/response.model';
import { tap, catchError } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
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
  FetchSelectedOrganData,
  UpdateGetFromCache,
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
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { GaAction, GaCategory } from '../models/ga.model';
import { ReportService } from '../components/report/report.service';
import { ConfigService } from '../app-config.service';
import { Report } from '../models/report.model';

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
  reportData: Report;
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
  /**
   * Stores the selected organs details.
   */
  selectedOrgans: string[];
  /**
   * Stores the selected organs details from OMAPS.
   */
  omapSelectedOrgans: string[];
  /**
   * Full data by organ
   */
  fullDataByOrgan: Row[][];
  /**
   * Update the flag is data should be fetched from cache
   */
  getFromCache: boolean;
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
    reportData: {
      ASWithNoLink: [],
      CTWithNoLink: [],
      BWithNoLink: [],
      anatomicalStructures: [],
      cellTypes: [],
      biomarkers: [],
      ASWithNoCT: [],
      CTWithNoB: []
    },
    mode: 'vis',
    parsed: [],
    bottomSheetInfo: {
      name: '',
      ontologyId: '',
      ontologyCode: '',
      iri: '',
      label: '',
      desc: 'null',
      hasError: false,
      msg: '',
      status: 0,
      notes: '',
      references: [],
      extraLinks: {},
    },
    bottomSheetDOI: [],
    fullAsData: [],
    selectedOrgans: [],
    omapSelectedOrgans: [],
    fullDataByOrgan: [],
    getFromCache: true,
  },
})


@Injectable()

export class SheetState {
  sheetConfig: SheetDetails[];
  omapSheetConfig: SheetDetails[];
  exampleSheet: SheetDetails;
  headerCount: unknown;

  constructor(public configService: ConfigService, private readonly sheetService: SheetService, public readonly ga: GoogleAnalyticsService, public reportService: ReportService) {
    this.configService.sheetConfiguration$.subscribe((sheetOptions) => {
      this.sheetConfig = sheetOptions;
    });
    this.configService.omapsheetConfiguration$.subscribe((sheetOptions) => {
      this.omapSheetConfig = sheetOptions;
    });
    this.configService.allSheetConfigurations$.subscribe((sheetOptions) => {
      this.exampleSheet = sheetOptions.find(s => s.name === 'example');
    });
    this.configService.config$.subscribe(config => {
      this.headerCount = config.headerCount;
    });
  }
  faliureMsg = 'Failed to fetch data';
  bodyId = 'UBERON:0013702';
  bodyLabel: 'body proper';

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
   * Returns an observable that watches the selected organs data
   */
  @Selector()
  static getSelectedOrgans(state: SheetStateModel) {
    return state.selectedOrgans;
  }

  /**
 * Returns an observable that watches the selected organs data from OMAPS
 */
  @Selector()
  static getOMAPSelectedOrgans(state: SheetStateModel) {
    return state.omapSelectedOrgans;
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
   * Returns an observable that watches the fullDataByOrgan  data
   */
  @Selector()
  static getFullDataByOrgan(state: SheetStateModel) {
    return state.fullDataByOrgan;
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
   * Returns an observable that watches the getFromCache flag
   */
  @Selector()
  static getDataFromCache(state: SheetStateModel) {
    return state.getFromCache;
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
      id: this.bodyId,
      rdfs_label: this.bodyLabel
    };

    for await (const [_unused, compareSheet] of compareData.entries()) {
      this.sheetService
        .fetchSheetData(
          compareSheet.sheetId,
          compareSheet.gid,
          compareSheet.csvUrl,
          compareSheet.formData
        )
        .subscribe(
          (res: ResponseData) => {
            for (const row of res.data) {
              for (const i of row.anatomical_structures) {
                i.isNew = true;
                i.color = compareSheet.color;
              }
              row.anatomical_structures.unshift(organ);
              row.organName = compareSheet.title;
              row.tableVersion = '';

              for (const i of row.cell_types) {
                i.isNew = true;
                i.color = compareSheet.color;
              }

              for (const i of row.biomarkers) {
                i.isNew = true;
                i.color = compareSheet.color;
              }
            }

            const currentData = getState().data;
            const currentFullASData = getState().fullAsData;
            const currentFullDataByOrgan = getState().fullDataByOrgan;
            const currentCompare = getState().compareSheets;
            const currentCompareData = getState().compareData;
            const gaData = {
              sheetName: compareSheet.title,
              counts: {},
            };
            gaData.counts = this.reportService.countsGA(res.data);
            this.ga.event(GaAction.INPUT, GaCategory.COMPARISON, `Adding sheet or file to Compare: ${JSON.stringify(gaData)}`, 0);
            compareSheet.isOmap = res.isOmap ?? false;
            patchState({
              data: [...currentData, ...res.data],
              fullAsData: [...currentFullASData, ...res.data],
              compareSheets: [...currentCompare, ...[compareSheet]],
              compareData: [...currentCompareData, ...res.data],
              fullDataByOrgan: [...currentFullDataByOrgan, res.data],
            });
          },
          (error) => {
            console.log(error);
            const err: Error = {
              msg: `${error.name} (Status: ${error.status})`,
              status: error.status,
              hasError: true,
              hasGidError: !(compareSheet.gid || compareSheet.gid === '0'),
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
   * Action to fetch selected organs data using forkJoin rxjs
   * Accepts the sheet config and selected organs data
   */
  @Action(FetchSelectedOrganData)
  async fetchSelectedOrganData(
    { getState, dispatch, patchState }: StateContext<SheetStateModel>,
    { sheet, selectedOrgans, omapSelectedOrgans, comparisonDetails }: FetchSelectedOrganData
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
      data: [],
      selectedOrgans: selectedOrgans,
      omapSelectedOrgans:omapSelectedOrgans,
      sheetConfig: {
        ...sheet.config,
        show_ontology: state.sheetConfig.show_ontology,
        show_all_AS: state.sheetConfig.show_all_AS,
      },
      version: 'latest',
    });

    const requests$: Array<Observable<any>> = [];
    let dataAll: Row[] = [];

    const organsNames: string[] = [];
    const organTableVersions: string[] = [];
    for (const organ of selectedOrgans) {
      this.sheetConfig.forEach((config) => {
        config.version?.forEach((version: VersionDetail) => {
          if (version.value === organ) {
            requests$.push(this.sheetService.fetchSheetData(version.sheetId, version.gid, version.csvUrl, null, null, state.getFromCache));
            organsNames.push(config.name);
            organTableVersions.push(version.viewValue);
          }
        });
      });
    }
    for (const organ of omapSelectedOrgans) {
      this.omapSheetConfig.forEach((config) => {
        config.version?.forEach((version: VersionDetail) => {
          if (version.value === organ) {
            requests$.push(this.sheetService.fetchSheetData(version.sheetId, version.gid, version.csvUrl, null, null, state.getFromCache));
            organsNames.push(config.name);
          }
        });
      });
    }
    let asDeltails = [];
    const fullDataByOrgan = [];
    forkJoin(requests$).subscribe(
      (allResults) => {
        allResults.map((res: ResponseData, index: number) => {
          for (const row of res.data) {
            row.organName = organsNames[index];
            row.tableVersion = organTableVersions[index];

            const newStructure: Structure = {
              name: 'Body',
              id: this.bodyId,
              rdfs_label: this.bodyLabel,
            };

            row.anatomical_structures.unshift(newStructure);
          }

          asDeltails = JSON.parse(JSON.stringify([...asDeltails, ...res.data]));
          fullDataByOrgan.push(JSON.parse(JSON.stringify([...res.data])));
          for (const row of res.data) {
            if (!state.sheetConfig.show_all_AS && selectedOrgans.length > 8) {
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
          fullAsData: asDeltails,
          fullDataByOrgan
        });
        if (comparisonDetails) {
          dispatch(new FetchCompareData(comparisonDetails));
        }
      },
      (err) => {

        const error: Error = {
          msg: `${err.name} (Status: ${err.status})`,
          status: err.status,
          hasError: true,
        };
        dispatch(
          new ReportLog(LOG_TYPES.MSG, this.faliureMsg, LOG_ICONS.error)
        );
        dispatch(new HasError(error));
        return of('');
      }
    );
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
    const organsTableVersions: string[] = [];

    for (const s of this.sheetConfig) {
      if (s.name === 'all' || s.name === 'example' || s.name === 'some') {
        continue;
      } else {
        requests$.push(
          this.sheetService.fetchSheetData(s.sheetId, s.gid, s.csvUrl)
        );
        organsNames.push(s.name);
        organsTableVersions.push(s.version.find((i) => i.value === s.name).viewValue);
      }
    }
    let asData = [];

    forkJoin(requests$).subscribe(
      (allresults) => {
        allresults.map((res: ResponseData, i) => {
          for (const row of res.data) {
            row.organName = organsNames[i];
            row.tableVersion = organsTableVersions[i];
            const newStructure: Structure = {
              name: 'Body',
              id: this.bodyId,
              rdfs_label: this.bodyLabel,
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
   * Action to fetch the sheet data. Resets the Sheet State and the Tree State
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

    return this.sheetService
      .fetchSheetData(sheet.sheetId, sheet.gid, sheet.csvUrl, sheet.formData)
      .pipe(
        tap((res: ResponseData) => {
          res.data = this.sheetService.getDataWithBody(res.data, sheet.name);
          setState({
            ...state,
            compareData: [],
            compareSheets: [],
            reportData: {
              ASWithNoLink: [],
              CTWithNoLink: [],
              BWithNoLink: [],
              anatomicalStructures: [],
              cellTypes: [],
              biomarkers: [],
              ASWithNoCT: [],
              CTWithNoB: []
            },
            csv: res.csv,
            data: res.data,
            version: 'latest',
            parsed: res.parsed,
            mode,
            sheetConfig: { ...sheet.config, show_ontology: true },
          });
          if (sheet.name === 'example') {
            const gaData = {
              sheetName: sheet.name,
              counts: {},
            };
            gaData.sheetName = sheet.name;
            gaData.counts = this.reportService.countsGA(res.data);
            this.ga.event(GaAction.INPUT, GaCategory.PLAYGROUND, `Adding sheet link or file to Playground : ${JSON.stringify(gaData)}`, 0);
          }
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
            hasGidError: !(sheet.gid || sheet.gid === '0'),
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
        parsedData.data.splice(0, this.headerCount);
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
    const sheet: Sheet = this.exampleSheet;
    const mode = getState().mode;
    dispatch(new OpenLoading('Fetching playground data...'));
    dispatch(new StateReset(TreeState));
    dispatch(new CloseBottomSheet());
    dispatch(new ReportLog(LOG_TYPES.MSG, 'Example', LOG_ICONS.file, 'latest'));
    const state = getState();
    const organ: Structure = {
      name: 'Body',
      id: this.bodyId,
      rdfs_label: this.bodyLabel,
    };

    return this.sheetService.fetchPlaygroundData().pipe(
      tap((res: any) => {
        res.data.forEach((row) => {
          row.anatomical_structures.unshift(organ);
          row.organName = sheet.name;
          row.tableVersion = '';
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
          fullAsData: res.data,
          fullDataByOrgan: [res.data],
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

    const sheet: Sheet = this.exampleSheet;
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
      id: this.bodyId,
      rdfs_label: this.bodyLabel,
    };

    return this.sheetService.updatePlaygroundData(data).pipe(
      tap((res: any) => {
        res.data.forEach((row) => {
          row.anatomical_structures.unshift(organ);
          row.organName = sheet.name;
          row.tableVersion = '';
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
        iri: '',
      }
    });

    // Call the appropriate API and fetch ontology data
    return this.sheetService
      .fetchBottomSheetData(data.ontologyId, data.name)
      .pipe(
        tap((res: any) => {
          setState({
            ...state,
            bottomSheetInfo: {
              ...res,
              notes: data?.notes,
              ...(data.group === 2 ? { references: data?.references } : {}),
            },
          });
        }),
        catchError((error) => {
          setState({
            ...state,
            bottomSheetInfo: {
              name: data.name,
              ontologyId: data.ontologyId,
              ontologyCode: '',
              extraLinks: {},
              iri: '',
              label: '',
              desc: '',
              hasError: true,
              msg: error.message,
              status: error.status,
              notes: data?.notes,
              ...(data.group === 2 ? { references: data?.references } : {}),
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

  /**
   * Action to update the flag to get the data from cache
   */
  @Action(UpdateGetFromCache)
  updateGetFromCache({ getState, setState }: StateContext<SheetStateModel>, { cache }: UpdateGetFromCache) {
    const state = getState();
    setState({
      ...state,
      getFromCache: cache,
    });
  }
}
