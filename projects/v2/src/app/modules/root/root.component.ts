import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { SHEET_CONFIG } from './../../static/config';
import { SheetState } from './../../store/sheet.state';
import { TreeState } from './../../store/tree.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  FetchCompareData,
  UpdateReport,
  DeleteCompareSheet,
  UpdateMode,
  FetchInitialPlaygroundData,
  FetchSelectedOrganData,
  FetchAllOrganData,
  FetchSheetData,
  FetchDataFromAssets,
} from './../../actions/sheet.actions';
import { TreeService } from './../tree/tree.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UIState } from '../../store/ui.state';
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
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { IndentedListService } from '../../components/indented-list/indented-list.service';
import { StateReset } from 'ngxs-reset-plugin';
import { Snackbar } from '../../models/ui.model';
import { ReportService } from '../../components/report/report.service';
import { LogsState } from '../../store/logs.state';
import * as moment from 'moment';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { InfoComponent } from '../../components/info/info.component';
import { CompareData, DOI, Row, SheetConfig, SheetInfo, VersionDetail } from '../../models/sheet.model';
import { DoiComponent } from '../../components/doi/doi.component';
import { SearchStructure } from '../../models/tree.model';
import { SheetService } from '../../services/sheet.service';
import { OrganTableSelectorComponent } from '../../components/organ-table-selector/organ-table-selector.component';
import { TreeComponent } from '../tree/tree.component';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit, OnDestroy {
  /**
   * Organ sheet data
   */
  data: any;
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
  sheet: any;
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
  snackbarRef: any;
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

  // The container used for vertical scrolling of the viz is different than the one used for horizontal scrolling
  // Here we get references to both values.
  @ViewChild(TreeComponent) verticalScrollEntity: TreeComponent;
  @Output() export: EventEmitter<any> = new EventEmitter<any>();

  // Sheet Observables
  @Select(SheetState.getData) data$: Observable<any>;
  @Select(SheetState.getCompareSheets) compareSheets$: Observable<
    CompareData[]
  >;
  @Select(SheetState.getReportdata) rd$: Observable<any>;
  @Select(SheetState.getCompareData) compareData$: Observable<Row[]>;
  @Select(SheetState.getAllCompareData) allCompareData$: Observable<any>;
  @Select(SheetState.getMode) mode$: Observable<string>;
  @Select(SheetState.getBottomSheetInfo)
  bottomSheetInfo$: Observable<SheetInfo>;
  @Select(SheetState.getBottomSheetDOI) bottomSheetDOI$: Observable<DOI[]>;
  @Select(SheetState.getSheetConfig) sheetConfig$: Observable<SheetConfig>;
  @Select(SheetState.getFullAsData) fullAsData$: Observable<any>;

  // Tree Observables
  @Select(TreeState.getTreeData) treeData$: Observable<any>;
  @Select(TreeState.getBottomSheetData) bsd$: Observable<any>;
  @Select(TreeState.getLinksData) links$: Observable<any>;
  @Select(TreeState.getBimodal) bm$: Observable<any>;
  @Select(TreeState.getBiomarkerType) bmType$: Observable<string>;
  @Select(TreeState.getLatestSearchStructure)
  searchOption$: Observable<SearchStructure>;

  // Control Pane Observables
  @Select(UIState.getControlPaneState) pane$: Observable<boolean>;
  @Select(UIState.getIndentList) il$: Observable<boolean>;

  // UI Observables
  @Select(UIState.getError) error$: Observable<any>;
  @Select(UIState.getLoading) loading$: Observable<any>;
  @Select(UIState.getLoadingText) loadingText$: Observable<any>;
  @Select(UIState) uiState$: Observable<any>;
  @Select(UIState.getSnackbar) snack$: Observable<Snackbar>;
  @Select(UIState.getReport) report$: Observable<boolean>;
  @Select(UIState.getDebugLog) dl$: Observable<boolean>;
  @Select(UIState.getBottomSheet) bs$: Observable<boolean>;
  @Select(UIState.getCompareState) c$: Observable<boolean>;

  // Logs Oberservables
  @Select(LogsState) logs$: Observable<any>;

  constructor(
    public store: Store,
    public ts: TreeService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    public indent: IndentedListService,
    public report: ReportService,
    private readonly infoSheet: MatBottomSheet,
    public sheetService: SheetService,
    public router: Router
  ) {
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


    this.route.queryParamMap.subscribe((query) => {
      const selectedOrgans = query.get('selectedOrgans');
      const version = query.get('version');
      const sheet = query.get('sheet');
      const playground = query.get('playground');
      if (!selectedOrgans && playground !== 'true') {
        store.dispatch(new CloseLoading('Select Organ Model Rendered'));
        const config = new MatDialogConfig();
        config.disableClose = true;
        config.autoFocus = true;
        config.id = 'OrganTableSelector';
        config.width = '40vw';

        const dialogRef = this.dialog.open(OrganTableSelectorComponent, config);
        dialogRef.afterClosed().subscribe((organs) => {
          if (organs !== false){
            this.router.navigate(['/vis'], {
              queryParams: {
                selectedOrgans: organs?.join(','),
                playground: false,
              },
              queryParamsHandling: 'merge',
            });
          }
        });
      }
      else if (selectedOrgans && playground !== 'true') {
        store.dispatch(new UpdateMode('vis'));
        this.sheet =  SHEET_CONFIG.find(i => i.name === 'some');
        store.dispatch(new FetchSelectedOrganData(this.sheet, selectedOrgans.split(',')));
        sessionStorage.setItem('selectedOrgans', selectedOrgans);
      }
      else if (playground === 'true') {
        store.dispatch(new UpdateMode('playground'));
        this.sheet = SHEET_CONFIG.find((i) => i.name === 'example');
        this.store.dispatch(new FetchInitialPlaygroundData());
        store.dispatch(new CloseLoading());
      } else {
        store.dispatch(new UpdateMode('vis'));
        this.sheet = SHEET_CONFIG.find((i) => i.name === sheet);
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
          data,
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
            top: yPos - contentHeight / 2,
          });
        }
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.store.dispatch(new StateReset(SheetState));
  }

  /**
   * Function to update the report with the data
   *
   * @param data sheet data
   */
  updateReport(data: any) {
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
    this.store.dispatch(new FetchCompareData(data));
  }

  /**
   * Dispatch action to open bottom sheet
   * @param id ontology id
   */
  getStructureInfo(id: string) {
    this.store.dispatch(new OpenBottomSheet(id));
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
    if (option === 'Graph Data') {
      const sheet = this.store.selectSnapshot(SheetState.getSheet);
      const selectedOrgans = this.store.selectSnapshot(SheetState.getSelectedOrgans);
      const urls = [];
      if (sheet.name === 'all' || sheet.name === 'some'){
        for (const organ of selectedOrgans) {
          SHEET_CONFIG.forEach((config) => {
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
      
      this.sheetService.fetchSheetData(sheet.sheetId, sheet.gid, csvURL? csvURL : sheet.csvUrl, null, 'graph').subscribe((graphData: any) => {
        const graphDataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(graphData.data));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href',     graphDataStr);
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
      const sheet = this.store.selectSnapshot(SheetState.getSheet);
      this.sheetService
        .fetchSheetData(sheet.sheetId, sheet.gid, sheet.csvUrl, null, 'jsonld')
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
}
