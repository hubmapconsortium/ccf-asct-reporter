import { Component, OnInit } from '@angular/core';
import {SHEET_CONFIG} from './../../static/config';
import { SheetState } from './../../store/sheet.state';
import { TreeState } from './../../store/tree.state';
import {Select, Store} from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { fetchSheetData } from './../../actions/sheet.actions';
import { TreeService } from '../../components/tree/tree.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UIState } from '../../store/ui.state';
import { HasError } from '../../actions/ui.actions';
import { Error } from '../../models/response.model';



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
  
  // Sheet Observables
  // @Select(SheetState.getLoading) loading$: Observable<boolean>;
  @Select(SheetState.getData) data$: Observable<any>;

  // Tree Observables
  @Select(TreeState.getTreeData) treeData$: Observable<any>;

  // Control Pane Observables
  @Select(UIState.getControlPaneState) pane$: Observable<boolean>;

  // UI Observables
  @Select(UIState.checkForError) hasError$: Observable<boolean>;
  @Select(UIState.getError) error$: Observable<any>;

  constructor(public store: Store, public ts:TreeService, public route: ActivatedRoute) {

    this.data$.subscribe(data => {
      if (data.length) {
        this.data = data;
        ts.makeTreeData(this.sheet, data, [])
      }
    })

    this.error$.subscribe(err => {
      this.error = err.error;
    })

    this.route.queryParamMap.subscribe(query => {
      this.sheet =  SHEET_CONFIG.find(i => i.name === query.get('sheet'));
      store.dispatch(new fetchSheetData(this.sheet)).subscribe(
        () => {},
        (error) => {
          const err: Error = {
            msg: error.statusText,
            status: error.status,
            hasError: true
          }
          store.dispatch(new HasError(err))
        }
      )
    })
  }

  ngOnInit(): void {
  }

}
