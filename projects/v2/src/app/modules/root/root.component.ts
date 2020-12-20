import { Component, OnInit } from '@angular/core';
import {SHEET_CONFIG, VERSION} from './../../static/config';
import { SheetState } from './../../store/sheet.state';
import { TreeState } from './../../store/tree.state';
import {Select, Store} from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { FetchSheetData, FetchDataFromAssets } from './../../actions/sheet.actions';
import { TreeService } from '../../components/tree/tree.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UIState } from '../../store/ui.state';
import { HasError, CloseSnackbar, ToggleIndentList } from '../../actions/ui.actions';
import { Error } from '../../models/response.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoadingComponent } from '../../components/loading/loading.component';
import { MatSnackBar, MatSnackBarRef, MatSnackBarConfig } from '@angular/material/snack-bar';
import { validateWidth } from '../../static/util';
import { UpdateGraphWidth } from '../../actions/tree.actions';
import { IndentedListService } from '../../components/indented-list/indented-list.service';


@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
  data: any;
  loading: boolean;
  view: any;
  sheet: any;
  hasError: boolean;
  error: Error;
  snackbarRef: any;
  isControlPaneOpen: boolean;
  screenWidth = document.getElementsByTagName('body')[0].clientWidth;

  showIndent = false;

  // Sheet Observables
  // @Select(SheetState.getLoading) loading$: Observable<boolean>;
  @Select(SheetState.getData) data$: Observable<any>;

  // Tree Observables
  @Select(TreeState.getTreeData) treeData$: Observable<any>;

  // Control Pane Observables
  @Select(UIState.getControlPaneState) pane$: Observable<boolean>;
  @Select(UIState.getIndentList) il$: Observable<boolean>;
  // UI Observables
  @Select(UIState.getError) error$: Observable<any>;
  @Select(UIState.getLoading) loading$: Observable<any>;
  @Select(UIState.getLoadingText) loadingText$: Observable<any>;
  @Select(UIState) uiState$: Observable<any>;
  @Select(TreeState.getScreenWidth) screenWidth$: Observable<number>;

  constructor(
    public store: Store, 
    public ts: TreeService, 
    public route: ActivatedRoute, 
    public dialog: MatDialog, 
    private snackbar: MatSnackBar,
    public indent: IndentedListService
  ) {
    
    this.data$.subscribe(data => {
      if (data.length) {
        this.data = data;
        try {
          indent.makeIndentData(this.sheet, data)
          ts.makeTreeData(this.sheet, data, []);
        } catch (err) {
          store.dispatch(new HasError({hasError: true, msg: err, status: 400}))
        }
        
      }
    });

    this.error$.subscribe(err => {
      this.error = err.error;
    });

    this.route.queryParamMap.subscribe(query => {
      const version = query.get('version');
      this.sheet =  SHEET_CONFIG.find(i => i.name === query.get('sheet'));

      if (version === 'latest') {
        store.dispatch(new FetchSheetData(this.sheet)).subscribe(
          () => {},
          (error) => {
            const err: Error = {
              msg: error.statusText,
              status: error.status,
              hasError: true
            };
            store.dispatch(new HasError(err));
          }
        );
      } else {
        store.dispatch(new FetchDataFromAssets(version, this.sheet)).subscribe(
          () => {},
          (error) => {
            const err: Error = {
              msg: error.statusText,
              status: error.status,
              hasError: true
            };
            store.dispatch(new HasError(err));
          }
        );
      }

    });

    this.loading$.subscribe(l => {
      if (l && !this.dialog.getDialogById('LoadingDialog')) { this.openLoading(); }
      else if (!l) { this.closeLoading(); }
    });

    this.uiState$.subscribe(state => {
      this.isControlPaneOpen = state.controlPaneOpen;

      const sb = state.snackbar;
      if (sb.opened)  {
        const config: MatSnackBarConfig = {
          duration: 1500,
          verticalPosition: 'bottom',
          horizontalPosition: 'end',
          panelClass: [`${sb.type}-snackbar`]
        };
        this.snackbarRef = this.snackbar.open(sb.text, 'Dismiss', config);
        this.snackbarRef.afterDismissed().subscribe(s => { store.dispatch(new CloseSnackbar()); });
      }
    });


    this.pane$.subscribe(value => {
      if (this.data)
        ts.makeTreeData(this.sheet, this.data, []);
    })


  }

  ngOnInit(): void {
  }

  openLoading(text?: string) {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.autoFocus = true;
    config.id = 'LoadingDialog';
    config.data = text;
    config.width = '300px';

    const loadingDialog = this.dialog.open(LoadingComponent, config);
  }

  closeLoading() {
    const loadingDialog = this.dialog.getDialogById('LoadingDialog');
    loadingDialog.close();
  }

  toggleIndentList() {
    this.store.dispatch(new ToggleIndentList())
  }

}