import { Component, OnInit } from '@angular/core';
import SC from './../../static/config';
import { SheetState } from './../../store/sheet.state';
import { TreeState } from './../../store/tree.state';
import { Sheet } from './../../models/sheet.model';
import {Select, Store} from '@ngxs/store';
import { Observable } from 'rxjs';
import { fetchSheetData } from './../../actions/sheet.actions';
import { TreeService } from '../../components/tree/tree.service';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
  data: any;
  loading: boolean;

  @Select(SheetState.getLoading) loading$: Observable<boolean>;
  @Select(SheetState.getData) data$: Observable<any>;
  // @Select(SheetState.getVegaSpec) spec$: Observable<any>;

  @Select(TreeState.getVegaSpec) spec$: Observable<any>;

  constructor(public store: Store, public ts:TreeService) {
    const sheet:any = SC.SHEET_CONFIG.find(i => i.name === 'spleen');
    store.dispatch(new fetchSheetData(sheet));

    this.loading$.subscribe(loading => {
      this.loading = loading;
    })
    
    this.data$.subscribe(data => {
      console.log('CALLING')
      ts.makeTreeData(sheet, data, [])
    })

    this.spec$.subscribe(spec => {
      console.log('this is spec: ', spec)
    })
  }

  ngOnInit(): void {
  }

}
