import { Component, OnInit } from '@angular/core';
import SC from './../../static/config';
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



@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
  data: any;
  loading: boolean;
  view: any;
  sheetData: any;
  sheet:any = SC.SHEET_CONFIG.find(i => i.name === 'spleen');
  
 

  @Select(SheetState.getLoading) loading$: Observable<boolean>;
  @Select(SheetState.getData) data$: Observable<any>;
  @Select(TreeState.getTreeData) treeData$: Observable<any>;
  @Select(TreeState.getBimodal) bimodalData$: Observable<any>;
  @Select(TreeState.getVegaView) view$: Observable<any>;

  constructor(public store: Store, public ts:TreeService) {
    // const sheet:any = SC.SHEET_CONFIG.find(i => i.name === 'spleen');
    store.dispatch(new fetchSheetData(this.sheet));

    this.loading$.subscribe(loading => {
      this.loading = loading;
    })
    
    this.data$.subscribe(data => {
      this.data = data;
      ts.makeTreeData(this.sheet, data, [])
    })

    // this.treeData$.subscribe(data => {
    //   if(this.data.length && data.length)
    //     ts.makeASCTData(this.data, data, this.bimodalConfig, this.sheet)
    // })

  }

  ngOnInit(): void {
  }

}
