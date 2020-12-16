import { Component, OnInit } from '@angular/core';
import {SHEET_CONFIG} from './../../static/config';
import { SheetState } from './../../store/sheet.state';
import { TreeState } from './../../store/tree.state';
import { Sheet } from './../../models/sheet.model';
import {Select, Store} from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { fetchSheetData } from './../../actions/sheet.actions';
import { TreeService } from '../../components/tree/tree.service';
import { map } from 'rxjs/operators';
import * as vega from 'vega'
import { updateVegaSpec } from '../../actions/tree.actions';
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRoute } from '@angular/router';



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
  
  @Select(SheetState.getLoading) loading$: Observable<boolean>;
  @Select(SheetState.getData) data$: Observable<any>;
  @Select(TreeState.getTreeData) treeData$: Observable<any>;
  @Select(TreeState.getBimodal) bimodalData$: Observable<any>;
  @Select(TreeState.getVegaView) view$: Observable<any>;

  constructor(public store: Store, public ts:TreeService, public route: ActivatedRoute) {

    this.loading$.subscribe(loading => {
      this.loading = loading;
    })
    
    this.data$.subscribe(data => {
      if (data.length) {
        this.data = data;
        ts.makeTreeData(this.sheet, data, [])
      }
      
    })

    this.route.queryParamMap.subscribe(query => {
      this.sheet =  SHEET_CONFIG.find(i => i.name === query.get('sheet'));
      store.dispatch(new fetchSheetData(this.sheet));
    })
  }

  ngOnInit(): void {
  }

}
