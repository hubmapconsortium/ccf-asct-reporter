import { Component, OnInit } from '@angular/core';
import SC from './../../static/config';
import { SheetState } from './../../store/sheet.state';
import { Sheet } from './../../models/sheet.model';
import {Select, Store} from '@ngxs/store';
import { Observable } from 'rxjs';
import { fetchSheetData } from './../../actions/sheet.actions';



@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
  data: any;
  loading: boolean;

  @Select(SheetState.getLoading) loading$: Observable<boolean>;

  constructor(public store: Store) {
    const sheet:any = SC.SHEET_CONFIG.find(i => i.name === 'spleen');
    store.dispatch(new fetchSheetData(sheet));

    this.loading$.subscribe(loading => {
      console.log('called')
      this.loading = loading;
    })
  }

  ngOnInit(): void {
  }

}
