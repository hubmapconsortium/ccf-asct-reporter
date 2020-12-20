import { Component, OnInit } from '@angular/core';
import { SHEET_OPTIONS } from '../../static/config';
import { Store, Select } from '@ngxs/store';
import { SheetState, SheetStateModel } from '../../store/sheet.state';
import { Observable } from 'rxjs';
import { Sheet } from '../../models/sheet.model';
import { Router } from '@angular/router';
import { FetchSheetData, RefreshData } from '../../actions/sheet.actions';
import { ToggleControlPane } from '../../actions/ui.actions';
import { UIState, UIStateModel } from '../../store/ui.state';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  SHEET_OPTIONS = SHEET_OPTIONS;

  selectedSheetOption: string;
  currentSheet: Sheet;

  @Select(SheetState) sheet$: Observable<SheetStateModel>;
  @Select(UIState) ui$: Observable<UIStateModel>;

  constructor(public store: Store, public router: Router) { }

  ngOnInit(): void {
    this.sheet$.subscribe(sheet => {
      this.currentSheet = sheet.sheet;
      this.selectedSheetOption = sheet.sheet.display;
    });

  }

  getSheetSelection(sheet, event) {
    const selectedSheet = SHEET_OPTIONS.find(s => s.title === sheet);
    this.router.navigate(['/vis'], {queryParams: {sheet: selectedSheet.sheet}});
  }

  refreshData() {
    // this.store.dispatch(new RefreshData());
    this.store.dispatch(new FetchSheetData(this.currentSheet));
  }

  togglePane() {
    this.store.dispatch(new ToggleControlPane());
  }

}
