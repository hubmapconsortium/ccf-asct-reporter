import { Component, OnInit } from '@angular/core';
import { SHEET_OPTIONS, VERSION, MORE_OPTIONS } from '../../static/config';
import { Store, Select } from '@ngxs/store';
import { SheetState, SheetStateModel } from '../../store/sheet.state';
import { Observable } from 'rxjs';
import { Sheet } from '../../models/sheet.model';
import { Router } from '@angular/router';
import { FetchSheetData, RefreshData } from '../../actions/sheet.actions';
import { ToggleControlPane, ToggleIndentList, ToggleReport, ToggleDebugLogs } from '../../actions/ui.actions';
import { UIState, UIStateModel } from '../../store/ui.state';
import { ClearSheetLogs } from '../../actions/logs.actions';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  SHEET_OPTIONS = SHEET_OPTIONS;
  VERSIONS = VERSION;
  MORE_OPTIONS = MORE_OPTIONS;
  window: Window = window;

  selectedSheetOption: string;
  selectedVersion: string;
  currentSheet: Sheet;

  @Select(SheetState) sheet$: Observable<SheetStateModel>;
  @Select(UIState) ui$: Observable<UIStateModel>;

  constructor(public store: Store, public router: Router) { }

  ngOnInit(): void {
    this.sheet$.subscribe(sheet => {
      this.currentSheet = sheet.sheet;
      this.selectedSheetOption = sheet.sheet.display;
      this.selectedVersion = this.VERSIONS.find(s => s.folder === sheet.version).display;
    });

  }

  getSheetSelection(sheet, event) {
    const selectedSheet = SHEET_OPTIONS.find(s => s.title === sheet);
    this.store.dispatch(new ClearSheetLogs());
    this.router.navigate(['/vis'], {queryParams: {sheet: selectedSheet.sheet}, queryParamsHandling: 'merge'});
  }

  getVersionSelection(version, event) {
    const selectedVersion = this.VERSIONS.find(s => s.display === version);
    this.router.navigate(['/vis'], {queryParams: {version: selectedVersion.folder}, queryParamsHandling: 'merge'});
  }

  refreshData() {
    this.store.dispatch(new FetchSheetData(this.currentSheet));
  }

  togglePane() {
    this.store.dispatch(new ToggleControlPane());
  }

  toggleIndentedList() {
    this.store.dispatch(new ToggleIndentList());
  }

  toggleReport() {
    this.store.dispatch(new ToggleReport());
  }

  toggleDebugLogs() {
    this.store.dispatch(new ToggleDebugLogs());
  }

}
