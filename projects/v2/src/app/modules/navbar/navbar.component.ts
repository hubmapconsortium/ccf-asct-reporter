import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SHEET_OPTIONS, VERSION, MORE_OPTIONS, IMG_OPTIONS, PLAYGROUND_SHEET_OPTIONS } from '../../static/config';
import { Store, Select } from '@ngxs/store';
import { SheetState, SheetStateModel } from '../../store/sheet.state';
import { Observable } from 'rxjs';
import { Sheet } from '../../models/sheet.model';
import { Router } from '@angular/router';
import { FetchSheetData, RefreshData, FetchAllOrganData, FetchInitialPlaygroundData } from '../../actions/sheet.actions';
import { ToggleControlPane, ToggleIndentList, ToggleReport, ToggleDebugLogs, OpenCompare } from '../../actions/ui.actions';
import { UIState, UIStateModel } from '../../store/ui.state';
import { ClearSheetLogs } from '../../actions/logs.actions';
import {  faChartLine } from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  VERSIONS = VERSION;
  MORE_OPTIONS = MORE_OPTIONS;
  IMG_OPTIONS = IMG_OPTIONS;
  window: Window = window;
  faChartLine = faChartLine;

  selectedSheetOption: string;
  selectedVersion: string;
  currentSheet: Sheet;
  mode: string;
  SHEET_OPTIONS = SHEET_OPTIONS;

  @Select(SheetState) sheet$: Observable<SheetStateModel>;
  @Select(UIState) ui$: Observable<UIStateModel>;
  @Select(SheetState.getMode) mode$: Observable<string>;

  @Output() export: EventEmitter<any> = new EventEmitter<any>();

  constructor(public store: Store, public router: Router) {}

  ngOnInit(): void {
    this.sheet$.subscribe((sheet) => {
      if (sheet.sheet) {
        this.currentSheet = sheet.sheet;
        this.selectedSheetOption = sheet.sheet.display;
        this.selectedVersion = this.VERSIONS.find(
          (s) => s.folder === sheet.version
        ).display;
      }
    });

    this.mode$.subscribe((mode) => {
      this.mode = mode;
      if (mode === 'playground') {
        this.SHEET_OPTIONS = PLAYGROUND_SHEET_OPTIONS;
      }
      if (mode === 'vis') {
        this.SHEET_OPTIONS = SHEET_OPTIONS;
      }
    });
  }

  getSheetSelection(sheet, event) {
    const selectedSheet = SHEET_OPTIONS.find((s) => s.title === sheet);
    this.store.dispatch(new ClearSheetLogs());
    this.router.navigate(['/vis'], {
      queryParams: { sheet: selectedSheet.sheet },
      queryParamsHandling: 'merge',
    });
  }

  getVersionSelection(version, event) {
    const selectedVersion = this.VERSIONS.find((s) => s.display === version);
    this.router.navigate(['/vis'], {
      queryParams: { version: selectedVersion.folder },
      queryParamsHandling: 'merge',
    });
  }

  refreshData() {
    if (this.mode === 'vis') {
      if (this.currentSheet.name === 'all') {
        this.store.dispatch(new FetchAllOrganData(this.currentSheet));
      } else {
        this.store.dispatch(new FetchSheetData(this.currentSheet));
      }
    } else {
      this.store.dispatch(new FetchSheetData(this.currentSheet));
    }
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

  toggleCompare() {
    this.store.dispatch(new OpenCompare());
  }

  toggleMode() {
    if (this.mode === 'vis') {
      this.router.navigate(['/vis'], {
        queryParams: { sheet: 'example', playground: true },
        queryParamsHandling: 'merge',
      });
    } else if (this.mode === 'playground') {
      this.router.navigate(['/vis'], {
        queryParams: {
          sheet: localStorage.getItem('sheet'),
          playground: false,
        },
        queryParamsHandling: 'merge',
      });
    }
  }
}
