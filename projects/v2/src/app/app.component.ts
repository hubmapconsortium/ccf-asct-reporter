import { Component } from '@angular/core';

import SC from './static/config';
import { SheetState, fetchSheetData } from './store/sheet.state';
import { Sheet } from './models/sheet.model';
import {Select, Store} from '@ngxs/store';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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
}
