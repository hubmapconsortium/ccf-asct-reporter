import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { SheetState } from './../../store/sheet.state';
import { TreeState } from './../../store/tree.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  UpdateReport,
  DeleteCompareSheet,
  UpdateMode,
  FetchSelectedOrganData,
  FetchAllOrganData,
  FetchSheetData,
  FetchDataFromAssets,
  FetchInitialPlaygroundData,
  UpdateGetFromCache
} from './../../actions/sheet.actions';
import { TreeService } from './../tree/tree.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UIState, UIStateModel } from '../../store/ui.state';
import {
  HasError,
  CloseSnackbar,
  CloseRightSideNav,
  CloseCompare,
  CloseLoading,
  OpenBottomSheet,
} from '../../actions/ui.actions';
import { Error } from '../../models/response.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoadingComponent } from '../../components/loading/loading.component';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { IndentedListService } from '../../components/indented-list/indented-list.service';
import { StateReset } from 'ngxs-reset-plugin';
import { Logs, OpenBottomSheetData, Snackbar } from '../../models/ui.model';
import { ReportService } from '../../components/report/report.service';
import { LogsState } from '../../store/logs.state';
import * as moment from 'moment';
import {
  MatBottomSheet,
  MatBottomSheetRef
} from '@angular/material/bottom-sheet';
import { InfoComponent } from '../../components/info/info.component';
import { CompareData, DOI, GraphData, Row, Sheet, SheetConfig, SheetDetails, SheetInfo, VersionDetail } from '../../models/sheet.model';
import { DoiComponent } from '../../components/doi/doi.component';
import { SearchStructure } from '../../models/tree.model';
import { SheetService } from '../../services/sheet.service';
import { OrganTableSelectorComponent } from '../../components/organ-table-selector/organ-table-selector.component';
import { TreeComponent } from '../tree/tree.component';
import { ConfigService } from '../../app-config.service';
import { Report } from '../../models/report.model';
import { UpdateBimodalConfig } from '../../actions/tree.actions';
import { BimodalConfig } from '../../models/bimodal.model';
import { BimodalService } from '../tree/bimodal.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit, OnDestroy {
  /**
   * Organ sheet data
   */
  data: Row[];
  /**
   * Denotes if loading
   */
  loading: boolean;
  /**
   * Vega view
   */
  view: any;
  /**
   * Selected sheet
   */
  sheet: Sheet;
  /**
   * Denotesthe error state
   */
  hasError: boolean;
  /**
   * Stores the error
   */
  error: Error;
  /**
   * Reference to the snackbar
   */
  snackbarRef: MatSnackBarRef<TextOnlySnackBar>;
  /**
   * Dnotes of sidebar control pane is open
   */
  isControlPaneOpen: boolean;
  /**
   * Botton input sheet ref
   */
  infoSheetRef: MatBottomSheetRef;
  /**
   * Mode of the application. Playground or visualiization
   * Default is vis
   */
  mode = 'vis';
  /**
   * Comparison sheets details
   */
  compareDetails: CompareData[] = [];
  /**
   * Bimodal filter values to snd via snackbar update
   */
  bimodalConfig: BimodalConfig;

  // The container used for vertical scrolling of the viz is different than the one used for horizontal scrolling
  // Here we get references to both values.
  @ViewChild(TreeComponent) verticalScrollEntity: TreeComponent;
  @Output() export: EventEmitter<any> = new EventEmitter<any>();

  // Sheet Observables
  @Select(SheetState.getData) data$: Observable<any>;
  @Select(SheetState.getCompareSheets) compareSheets$: Observable<
    CompareData[]
  >;
  @Select(SheetState.getReportdata) rd$: Observable<Report>;
  @Select(SheetState.getCompareData) compareData$: Observable<Row[]>;
  @Select(SheetState.getAllCompareData) allCompareData$: Observable<any>;
  @Select(SheetState.getMode) mode$: Observable<string>;
  @Select(SheetState.getBottomSheetInfo) bottomSheetInfo$: Observable<SheetInfo>;
  @Select(SheetState.getBottomSheetDOI) bottomSheetDOI$: Observable<DOI[]>;
  @Select(SheetState.getSheetConfig) sheetConfig$: Observable<SheetConfig>;
  @Select(SheetState.getFullAsData) fullAsData$: Observable<any>;
  @Select(SheetState.getFullDataByOrgan) fullDataByOrgan$: Observable<any>;
  @Select(SheetState.getDataFromCache) getFromCache$: Observable<boolean>;

  // Tree Observables
  @Select(TreeState.getTreeData) treeData$: Observable<any>;
  @Select(TreeState.getBottomSheetData) bsd$: Observable<any>;
  @Select(TreeState.getLinksData) links$: Observable<any>;
  @Select(TreeState.getBimodal) bm$: Observable<any>;
  @Select(TreeState.getBiomarkerType) bmType$: Observable<string>;
  @Select(TreeState.getLatestSearchStructure) searchOption$: Observable<SearchStructure>;
  @Select(TreeState.getBimodalConfig) config$: Observable<BimodalConfig>;

  // Control Pane Observables
  @Select(UIState.getControlPaneState) pane$: Observable<boolean>;
  @Select(UIState.getIndentList) il$: Observable<boolean>;

  // UI Observables
  @Select(UIState.getError) error$: Observable<any>;
  @Select(UIState.getLoading) loading$: Observable<boolean>;
  @Select(UIState.getLoadingText) loadingText$: Observable<string>;
  @Select(UIState) uiState$: Observable<UIStateModel>;
  @Select(UIState.getSnackbar) snack$: Observable<Snackbar>;
  @Select(UIState.getReport) report$: Observable<boolean>;
  @Select(UIState.getDebugLog) dl$: Observable<boolean>;
  @Select(UIState.getBottomSheet) bs$: Observable<boolean>;
  @Select(UIState.getCompareState) c$: Observable<boolean>;

  // Logs Oberservables
  @Select(LogsState) logs$: Observable<Logs>;

  sheetConfig: SheetDetails[];
  omapSheetConfig: SheetDetails[];

  constructor(
    public configService: ConfigService,
    public store: Store,
    public ts: TreeService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    public indent: IndentedListService,
    public report: ReportService,
    private readonly infoSheet: MatBottomSheet,
    public sheetService: SheetService,
    public router: Router,
    public bms: BimodalService
  ) {
    this.configService.sheetConfiguration$.subscribe((sheetOptions) => {
      this.sheetConfig = sheetOptions;
    });

    this.configService.omapsheetConfiguration$.subscribe((sheetOptions) => {
      this.omapSheetConfig = sheetOptions;
    });

    this.data$.subscribe((data) => {
      if (data.length) {
        this.data = data;
        try {
          this.ts.makeTreeData(this.sheet, data, []);
        } catch (err) {
          console.log(err);
          this.store.dispatch(
            new HasError({ hasError: true, msg: err, status: 400 })
          );
        }
      }
    });

    this.error$.subscribe((err) => {
      this.error = err.error;
    });

    this.config$.subscribe(config => {
      this.bimodalConfig = config;
    });

    this.route.queryParamMap.subscribe((query) => {
      const selectedOrgans = query.get('selectedOrgans') ?? '';
      const version = query.get('version');
      const comparisonCSV = query.get('comparisonCSVURL');
      const comparisonName = query.get('comparisonName');
      const comparisonColor = query.get('comparisonColor');
      const comparisonHasFile = query.get('comparisonHasFile');
      const sheet = query.get('sheet');
      const playground = query.get('playground');
      const omapSelectedOrgans = query.get('omapSelectedOrgans') ?? '';
      if (!(selectedOrgans || omapSelectedOrgans) && playground !== 'true') {
        store.dispatch(new UpdateMode('vis'));
        store.dispatch(new CloseLoading('Select Organ Model Rendered'));
        const config = new MatDialogConfig();
        config.disableClose = true;
        config.autoFocus = true;
        config.id = 'OrganTableSelector';
        config.width = 'fit-content';
        config.data = {
          isIntilalSelect: true,
          getFromCache: true
        };
        const dialogRef = this.dialog.open(OrganTableSelectorComponent, config);
        dialogRef.afterClosed().subscribe(({ organs, cache, omapOrgans }) => {
          store.dispatch(new UpdateGetFromCache(cache));
          if (organs !== false) {
            this.router.navigate(['/vis'], {
              queryParams: {
                selectedOrgans: organs?.join(','),
                playground: false,
                omapSelectedOrgans: omapOrgans?.join(',')
              },
              queryParamsHandling: 'merge',
            });
          }
        });
      }
      else if ((selectedOrgans || omapSelectedOrgans) && playground !== 'true' && (comparisonCSV || comparisonHasFile)) {
        store.dispatch(new UpdateMode('vis'));
        const comparisonCSVURLList = comparisonCSV.split('|');
        const comparisonColorList = comparisonColor?.split('|');
        const comparisonNameList = comparisonName?.split('|');

        const comparisonDetails = this.compareDetails;
        this.sheet = this.sheetConfig.find(i => i.name === 'some');

        if (!comparisonDetails.length) {
          const colors = [
            '#6457A6',
            '#2C666E',
            '#72A98F',
            '#3D5A6C',
            '#F37748',
            '#FB4B4E',
            '#FFCBDD',
            '#7C0B2B',
            '#067BC2',
            '#ECC30B'
          ];
          comparisonCSVURLList.forEach((linkUrl, index) => {
            linkUrl = linkUrl.trim();
            comparisonDetails.push({
              title: comparisonNameList?.length - 1 >= index ? comparisonNameList[index] : `Sheet ${index + 1}`,
              description: '',
              link: linkUrl,
              color: comparisonColorList?.length - 1 >= index ? comparisonColorList[index] : colors[index % colors.length],
              sheetId: this.parseSheetUrl(linkUrl).sheetID,
              gid: this.parseSheetUrl(linkUrl).gid,
              csvUrl: this.parseSheetUrl(linkUrl).csvUrl
            });
          });
        }
        store.dispatch(new FetchSelectedOrganData(this.sheet, selectedOrgans.split(','), omapSelectedOrgans.split(','), comparisonDetails));
        sessionStorage.setItem('selectedOrgans', selectedOrgans);
        if (omapSelectedOrgans) {
          this.openSnackBarToUpdateFilter();
        }
      }
      else if ((selectedOrgans || omapSelectedOrgans) && playground !== 'true') {
        store.dispatch(new UpdateMode('vis'));
        this.sheet = this.sheetConfig.find(i => i.name === 'some');
        store.dispatch(new FetchSelectedOrganData(this.sheet, selectedOrgans.split(','), omapSelectedOrgans.split(',')));
        sessionStorage.setItem('selectedOrgans', selectedOrgans);
        if (omapSelectedOrgans) {
          this.openSnackBarToUpdateFilter();
        }
      }
      else if (playground === 'true') {
        store.dispatch(new UpdateMode('playground'));
        this.sheet = this.sheetConfig.find((i) => i.name === 'some');
        this.store.dispatch(new FetchInitialPlaygroundData());
        store.dispatch(new CloseLoading());
      } else {
        store.dispatch(new UpdateMode('vis'));
        this.sheet = this.sheetConfig.find((i) => i.name === sheet);
        localStorage.setItem('sheet', this.sheet.name);
        if (version === 'latest') {
          if (this.sheet.name === 'all') {
            store.dispatch(new FetchAllOrganData(this.sheet));
          } else {
            store.dispatch(new FetchSheetData(this.sheet));
          }
        } else {
          store.dispatch(new FetchDataFromAssets(version, this.sheet));
        }
      }
    });

    this.loading$.subscribe((l) => {
      if (l && !this.dialog.getDialogById('LoadingDialog')) {
        this.openLoading();
      } else if (!l) {
        this.closeLoading();
      }
    });

    this.uiState$.subscribe((state) => {
      this.isControlPaneOpen = state.controlPaneOpen;
    });

    this.snack$.subscribe((sb) => {
      if (sb.opened) {
        const config: MatSnackBarConfig = {
          duration: 1500,
          verticalPosition: 'bottom',
          horizontalPosition: 'end',
          panelClass: [`${sb.type}-snackbar`],
        };
        this.snackbarRef = this.snackbar.open(sb.text, 'Dismiss', config);
        this.snackbarRef.afterDismissed();
        store.dispatch(new CloseSnackbar());
      }
    });

    this.pane$.subscribe((_unused) => {
      if (this.data) {
        ts.makeTreeData(this.sheet, this.data, []);
      }
    });

    this.bs$.subscribe((value) => {
      if (value) {
        this.infoSheetRef = this.infoSheet.open(InfoComponent, {
          disableClose: false,
          hasBackdrop: false,
          autoFocus: false,
          panelClass: 'bottom-sheet-style',
          data: this.bottomSheetInfo$,
        });
      } else {
        if (this.infoSheetRef) {
          this.infoSheetRef.dismiss();
        }
      }
    });

    this.bottomSheetDOI$.subscribe((data) => {
      if (data.length) {
        this.infoSheetRef = this.infoSheet.open(DoiComponent, {
          disableClose: false,
          hasBackdrop: false,
          autoFocus: false,
          panelClass: 'bottom-sheet-style',
          data
        });
      } else {
        if (this.infoSheetRef) {
          this.infoSheetRef.dismiss();
        }
      }
    });

    // Listen for changes in the last selected search structure
    this.searchOption$.subscribe((structure) => {
      // Structure will be null when all structures are deselected
      if (this.verticalScrollEntity && structure) {
        const yPos = structure.y + 30; // 30 accounts for top-padding
        const xPos = structure.x;

        // The vertical scroll div is a CdkScrollable component, but the horizontal scroll element is a normal div.
        // This leads to differences in the scrollTo interface.
        const contentHeight =
          this.verticalScrollEntity.treeElementRef.nativeElement.offsetHeight;
        const contentWidth =
          this.verticalScrollEntity.treeElementRef.nativeElement.offsetWidth;
        const yScrollPos =
          this.verticalScrollEntity.treeElementRef.nativeElement.scrollTop;
        const xScrollPos =
          this.verticalScrollEntity.treeElementRef.nativeElement.scrollLeft;

        // Scroll to the selected structure if it's outside the area of the screen
        if (xPos > xScrollPos + contentWidth || xPos < xScrollPos) {
          this.verticalScrollEntity.treeElementRef.nativeElement.scrollTo(
            xPos,
            yScrollPos
          );
        }
        if (yPos > yScrollPos + contentHeight || yPos < yScrollPos) {
          this.verticalScrollEntity.treeElementRef.nativeElement.scrollTo({
            top: yPos - contentHeight / 2
          });
        }
      }
    });

    this.compareSheets$.subscribe((sheets) => {
      const omapSheets = sheets.filter(sheet => sheet.isOmap);
      if (omapSheets.length > 0) this.openSnackBarToUpdateFilter();
    });
  }

  ngOnInit(): void { }

  ngOnDestroy() {
    this.store.dispatch(new StateReset(SheetState));
  }

  /**
   * Function to update the report with the data
   *
   * @param data sheet data
   */
  updateReport(data: Report) {
    this.store.dispatch(new UpdateReport(data));
  }

  /**
   * Deletes a sheeet from the compare
   *
   * @param i index of sheet
   */
  deleteSheet(i: number) {
    this.store.dispatch(new DeleteCompareSheet(i));
  }

  /**
   * Opens loading dialog
   *
   * @param text Loading text
   */
  openLoading(text?: string) {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.autoFocus = true;
    config.id = 'LoadingDialog';
    config.data = text;
    config.width = '300px';

    this.dialog.open(LoadingComponent, config);
  }

  /**
   *
   * @param url  of the sheet to compare
   * @returns a object with the sheetID, gid, and CsvUrl
   */

  parseSheetUrl(url: string): { sheetID: string, gid: string, csvUrl: string } {
    if (url.startsWith('https://docs.google.com/spreadsheets/d/')) {
      const splitUrl = url.split('/');
      if (splitUrl.length === 7) {
        return {
          sheetID: splitUrl[5],
          gid: splitUrl[6].split('=')[1],
          csvUrl: ''
        };
      }
      return {
        sheetID: '0',
        gid: '0',
        csvUrl: url
      };
    } else {
      return {
        sheetID: '0',
        gid: '0',
        csvUrl: url
      };
    }
  }

  /**
   * Close loading dialog
   */
  closeLoading() {
    const loadingDialog = this.dialog.getDialogById('LoadingDialog');
    if (loadingDialog) {
      loadingDialog.close();
    }
  }

  /**
   * Toggling sidebars for Report, IL, Debug, Compare
   */
  toggleSideNav() {
    this.store.dispatch(new CloseRightSideNav());
  }

  /**
   * Set compare data
   * @param data compare data
   */
  compareData(data: CompareData[]) {
    this.store.dispatch(new CloseCompare());
    this.compareDetails = data;
    const compareDataString = data
      .filter((compareData: CompareData) => compareData.link !== '')
      .map((compareData: CompareData) => compareData.link)
      .join('|');

    const compareColorString = data
      .filter((compareData: CompareData) => compareData.color !== '')
      .map((compareData: CompareData) => compareData.color)
      .join('|');

    const compareNameString = data
      .filter((compareData: CompareData) => compareData.title !== '')
      .map((compareData: CompareData) => compareData.title)
      .join('|');

    const compareHasFile = data // check if any of the sheets has a file
      .some((compareData: CompareData) => compareData.formData !== null);

    this.router.navigate(['/vis'], {
      queryParams: {
        comparisonCSVURL: compareDataString,
        comparisonName: compareNameString,
        comparisonColor: compareColorString,
        comparisonHasFile: compareHasFile ? 'true' : 'false'
      },
      queryParamsHandling: 'merge',
    });

  }

  /**
   * Dispatch action to open bottom sheet
   * @param id ontology id
   */
  getStructureInfo(data: OpenBottomSheetData) {
    this.store.dispatch(new OpenBottomSheet(data));
  }

  /**
   * Exports the visualiation into 3 formats
   *
   * @param option Export option. PNG | SVG | Vega Spec
   */
  exportVis(option: string) {
    const dt = moment(new Date()).format('YYYY.MM.DD_hh.mm');
    const sn = this.sheet.display.toLowerCase().replace(' ', '_');
    const formatType = option.toLowerCase();
    let csvURL;
    const sheet = this.store.selectSnapshot(SheetState.getSheet);
    const selectedOrgans = this.store.selectSnapshot(SheetState.getSelectedOrgans);
    const omapSelectedOrgans = this.store.selectSnapshot(SheetState.getOMAPSelectedOrgans);
    const urls = [];
    if (sheet.name === 'all' || sheet.name === 'some') {
      for (const organ of selectedOrgans) {
        this.sheetConfig.forEach((config) => {
          config.version?.forEach((version: VersionDetail) => {
            if (version.value === organ) {
              if (version.csvUrl) {
                urls.push(version.csvUrl);
              }
              else {
                urls.push(this.sheetService.formURL(version.sheetId, version.gid));
              }
            }
          });
        });
      }
      for (const organ of omapSelectedOrgans) {
        this.omapSheetConfig.forEach((config) => {
          config.version?.forEach((version: VersionDetail) => {
            if (version.value === organ) {
              if (version.csvUrl) {
                urls.push(version.csvUrl);
              }
              else {
                urls.push(this.sheetService.formURL(version.sheetId, version.gid));
              }
            }
          });
        });
      }
      csvURL = urls.join('|');
    }

    if (option === 'Graph Data') {

      this.sheetService.fetchSheetData(sheet.sheetId, sheet.gid, csvURL ? csvURL : sheet.csvUrl, null, 'graph').subscribe((graphData: GraphData) => {
        const graphDataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(graphData.data));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', graphDataStr);
        downloadAnchorNode.setAttribute('download', `asct+b_graph_data_${sn}_${dt}` + '.json');
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      });
    }
    else if (option === 'Vega Spec') {
      const spec = this.store.selectSnapshot(TreeState.getVegaSpec);
      const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(spec, null, 4));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute(
        'download',
        `asct+b_${sn}_${dt}` + '.json'
      );
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else if (option === 'JSON-LD') {

      this.sheetService
        .fetchSheetData(sheet.sheetId, sheet.gid, csvURL ? csvURL : sheet.csvUrl, null, 'jsonld')
        .subscribe((graphData: any) => {
          const graphDataStr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(graphData));
          const downloadAnchorNode = document.createElement('a');
          downloadAnchorNode.setAttribute('href', graphDataStr);
          downloadAnchorNode.setAttribute(
            'download',
            `asct+b_json_ld_${sn}_${dt}` + '.json'
          );
          document.body.appendChild(downloadAnchorNode);
          downloadAnchorNode.click();
          downloadAnchorNode.remove();
        });
    } else if (option === 'OWL (RDF/XML)') {

      this.sheetService
        .fetchSheetData(sheet.sheetId, sheet.gid, csvURL ? csvURL : sheet.csvUrl, null, 'owl')
        .subscribe((graphData: any) => {
          const graphDataStr =
            'data:application/rdf+xml;charset=utf-8,' +
            encodeURIComponent(graphData);
          const downloadAnchorNode = document.createElement('a');
          downloadAnchorNode.setAttribute('href', graphDataStr);
          downloadAnchorNode.setAttribute(
            'download',
            `asct+b_owl_${sn}_${dt}` + '.owl'
          );
          document.body.appendChild(downloadAnchorNode);
          downloadAnchorNode.click();
          downloadAnchorNode.remove();
        });
    } else {
      const view = this.store.selectSnapshot(TreeState.getVegaView);
      const fileName = `asct+b_${sn}_${dt}.${formatType}`;
      view.background('#fafafa');
      view
        .toImageURL(formatType)
        .then((url: string) => {
          const link = document.createElement('a');
          link.setAttribute('href', url);
          link.setAttribute('target', '_blank');
          link.setAttribute('download', fileName);
          link.dispatchEvent(new MouseEvent('click'));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  openSnackBarToUpdateFilter() {
    if (this.bimodalConfig.BM.type != 'Protein') {
      const config: MatSnackBarConfig = {
        duration: 10000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      };

      setTimeout(() => {
        this.snackbarRef = this.snackbar.open('OMAP Detected, Do you want to filter out only Proteins ' +
          'from the available BioMarkers?', 'Filter', config);
        this.snackbarRef.onAction().subscribe(() => {
          this.bimodalConfig.BM.type = 'Protein';
          this.store.dispatch(new UpdateBimodalConfig(this.bimodalConfig)).subscribe(states => {
            const data = states.sheetState.data;
            const treeData = states.treeState.treeData;
            const bimodalConfig = states.treeState.bimodal.config;
            const sheetConfig = states.sheetState.sheetConfig;
            const omapConfig = states.treeState.omapConfig;
            const filteredProtiens = states.sheetState.filteredProtiens;

            if (data.length) {
              this.bms.makeBimodalData(data, treeData, bimodalConfig, false, sheetConfig, omapConfig, filteredProtiens);
            }
          });
        });
      }, 2000);


    }
  }
}
