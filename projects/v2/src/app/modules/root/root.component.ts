import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { SHEET_CONFIG } from './../../static/config';
import { SheetState } from './../../store/sheet.state';
import { TreeState } from './../../store/tree.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  FetchSheetData,
  FetchDataFromAssets,
  FetchAllOrganData,
  FetchCompareData,
  UpdateReport,
  DeleteCompareSheet,
  UpdateMode,
  FetchInitialPlaygroundData,
} from './../../actions/sheet.actions';
import { TreeService } from './../tree/tree.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UIState } from '../../store/ui.state';
import {
  HasError,
  CloseSnackbar,
  CloseRightSideNav,
  CloseCompare,
  CloseLoading,
  OpenBottomSheet,
  CloseBottomSheet,
} from '../../actions/ui.actions';
import { Error } from '../../models/response.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoadingComponent } from '../../components/loading/loading.component';
import {
  MatSnackBar,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
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
import { CompareData, Row } from '../../models/sheet.model';


@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit, OnDestroy{
  data: any;
  loading: boolean;
  view: any;
  sheet: any;
  hasError: boolean;
  error: Error;
  snackbarRef: any;
  isControlPaneOpen: boolean;
  infoSheetRef: MatBottomSheetRef;
  mode = 'vis';

  @Output() export: EventEmitter<any> = new EventEmitter<any>();

  // Sheet Observables
  @Select(SheetState.getData) data$: Observable<any>;
  @Select(SheetState.getCompareSheets) compareSheets$: Observable<CompareData[]>;
  @Select(SheetState.getReportdata) rd$: Observable<any>;
  @Select(SheetState.getCompareData) compareData$: Observable<Row[]>;
  @Select(SheetState.getAllCompareData) allCompareData$: Observable<any>;
  @Select(SheetState.getMode) mode$: Observable<string>;

  // Tree Observables
  @Select(TreeState.getTreeData) treeData$: Observable<any>;
  @Select(TreeState.getBottomSheetData) bsd$: Observable<any>;
  @Select(TreeState.getLinksData) links$: Observable<any>;
  @Select(TreeState.getBimodal) bm$: Observable<any>;

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
    private infoSheet: MatBottomSheet
  ) {

    this.data$.subscribe(data => {
      if (data.length) {
        this.data = data;
        try {
          this.ts.makeTreeData(this.sheet, data, []);
        } catch (err) {
          console.log(err);
          this.store.dispatch(new HasError({hasError: true, msg: err, status: 400}));
        }
      }
    });

    this.error$.subscribe(err => {
      this.error = err.error;
    });

    this.route.queryParamMap.subscribe(query => {
      const version = query.get('version');
      const sheet = query.get('sheet');
      const playground = query.get('playground');

      if (playground === 'true') {
        store.dispatch(new UpdateMode('playground'));
        this.sheet = SHEET_CONFIG.find(i => i.name === 'example');
        this.store.dispatch(new FetchInitialPlaygroundData());
        store.dispatch(new CloseLoading());
      } else {
        store.dispatch(new UpdateMode('vis'));
        this.sheet =  SHEET_CONFIG.find(i => i.name === sheet);
        localStorage.setItem('sheet', this.sheet.name);
        if (version === 'latest') {
            if (this.sheet.name === 'all') {
              store.dispatch(new FetchAllOrganData(this.sheet));
            } else { store.dispatch(new FetchSheetData(this.sheet)); }

          } else {
            store.dispatch(new FetchDataFromAssets(version, this.sheet));
          }
      }


    });

    this.loading$.subscribe(l => {
      if (l && !this.dialog.getDialogById('LoadingDialog')) { this.openLoading(); }
      else if (!l) { this.closeLoading(); }
    });

    this.uiState$.subscribe(state => {
      this.isControlPaneOpen = state.controlPaneOpen;
    });

    this.snack$.subscribe(sb => {
      if (sb.opened)  {
        const config: MatSnackBarConfig = {
          duration: 1500,
          verticalPosition: 'bottom',
          horizontalPosition: 'end',
          panelClass: [`${sb.type}-snackbar`]
        };
        this.snackbarRef = this.snackbar.open(sb.text, 'Dismiss', config);
        this.snackbarRef.afterDismissed();
        store.dispatch(new CloseSnackbar());
      }
    });


    this.pane$.subscribe(value => {
      if (this.data) {
        ts.makeTreeData(this.sheet, this.data, []);
      }
    });

    this.bs$.subscribe(value => {
      if (value) {
        const bsd = store.selectSnapshot(TreeState.getBottomSheetData);
        this.infoSheetRef = this.infoSheet.open(InfoComponent, {
          disableClose: false,
          hasBackdrop: false,
          autoFocus: false,
          panelClass: 'bottom-sheet-style',
          data: bsd
        });


      } else {
        if (this.infoSheetRef) { this.infoSheetRef.dismiss(); }
      }
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.store.dispatch(new StateReset(SheetState));
  }

  updateReport(data: any) {
    this.store.dispatch(new UpdateReport(data));
  }

  deleteSheet(i: number) {
    this.store.dispatch(new DeleteCompareSheet(i));
  }


  openLoading(text?: string) {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.autoFocus = true;
    config.id = 'LoadingDialog';
    config.data = text;
    config.width = '300px';

    this.dialog.open(LoadingComponent, config);
  }

  closeLoading() {
    const loadingDialog = this.dialog.getDialogById('LoadingDialog');
    if (loadingDialog) { loadingDialog.close(); }
  }

  toggleSideNav() {
    this.store.dispatch(new CloseRightSideNav());
  }

  compareData(data: CompareData[]) {
    this.store.dispatch(new CloseCompare());
    this.store.dispatch(new FetchCompareData(data));
  }

  getStructureInfo(id: string) {
    this.store.dispatch(new OpenBottomSheet(id));
  }

  exportVis(option: string) {
    const dt = moment(new Date()).format('YYYY.MM.DD_hh.mm');
    const sn = this.sheet.display.toLowerCase().replace(' ', '_');
    const formatType = option.toLowerCase();

    if (option === 'Vega Spec') {
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
