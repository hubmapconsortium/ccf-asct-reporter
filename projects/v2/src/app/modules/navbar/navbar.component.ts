import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SHEET_OPTIONS, VERSION, MORE_OPTIONS, IMG_OPTIONS, PLAYGROUND_SHEET_OPTIONS, MASTER_SHEET_LINK } from '../../static/config';
import { Store, Select } from '@ngxs/store';
import { SheetState, SheetStateModel } from '../../store/sheet.state';
import { Observable } from 'rxjs';
import { Sheet } from '../../models/sheet.model';
import { Router } from '@angular/router';
import { FetchSheetData, FetchAllOrganData } from '../../actions/sheet.actions';
import { ToggleControlPane, ToggleIndentList, ToggleReport, ToggleDebugLogs, OpenCompare } from '../../actions/ui.actions';
import { UIState, UIStateModel } from '../../store/ui.state';
import { ClearSheetLogs } from '../../actions/logs.actions';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { GaAction, GaCategory } from '../../models/ga.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  /**
   * Available Data versions (depricated)
   */
  VERSIONS = VERSION;
  /**
   * Menu options
   */
  MORE_OPTIONS = MORE_OPTIONS;
  /**
   * Export options
   */
  IMG_OPTIONS = IMG_OPTIONS;
  /**
   * Sheet configs
   */
  SHEET_OPTIONS = SHEET_OPTIONS;
  /**
   * Document window object
   */
  window: Window = window;
  /**
   * Organ sheet selected
   */
  selectedSheetOption: string;
  /**
   * Selected data version
   */
  selectedVersion: string;
  /**
   * Currently selected sheet
   */
  currentSheet: Sheet;
  /**
   * Currently selecte mode
   */
  mode: string;

  // state observables
  @Select(SheetState) sheet$: Observable<SheetStateModel>;
  @Select(UIState) ui$: Observable<UIStateModel>;
  @Select(SheetState.getMode) mode$: Observable<string>;

  @Output() export: EventEmitter<any> = new EventEmitter<any>();

  constructor(public store: Store, public router: Router, public ga: GoogleAnalyticsService) {}

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
    this.ga.eventEmitter('nav_select_sheet', GaCategory.NAVBAR, 'Select Organ Set Dropdown', GaAction.CLICK, selectedSheet.sheet);
  }

  getVersionSelection(version, event) {
    const selectedVersion = this.VERSIONS.find((s) => s.display === version);
    this.router.navigate(['/vis'], {
      queryParams: { version: selectedVersion.folder },
      queryParamsHandling: 'merge',
    });
  }

  openMasterDataTables() {
    this.ga.eventEmitter('nav_master_data', GaCategory.NAVBAR, 'Go to Master Data Tables', GaAction.NAV, null);
    window.open(MASTER_SHEET_LINK, '_blank');
  }

  refreshData() {
    if (this.mode === 'vis' && this.currentSheet.name === 'all') {
        this.store.dispatch(new FetchAllOrganData(this.currentSheet));
    } else {
      this.store.dispatch(new FetchSheetData(this.currentSheet));
    }
    this.ga.eventEmitter('nav_refresh', GaCategory.NAVBAR, 'Refresh Visualization Button', GaAction.CLICK, null);
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

  exportImage(imageType: string) {
    this.export.emit(imageType);
    this.ga.eventEmitter('nav_export_image', GaCategory.NAVBAR, 'Export Image', GaAction.CLICK, imageType);
  }

  onOptionClick(type: string, url: string) {
    switch (type) {
      case 'route':
        this.router.navigate([url]); break;
      case 'tab':
        this.window.open(url, '_blank'); break;
      default:
        this.window.open(url, '_blank'); break;
    }
  }

  toggleMode() {
    if (this.mode === 'vis') {
      this.router.navigate(['/vis'], {
        queryParams: { sheet: 'example', playground: true },
        queryParamsHandling: 'merge',
      });
      this.ga.eventEmitter('nav_enter_playground', GaCategory.NAVBAR, 'Enter Playground Mode', GaAction.NAV, null);
    } else if (this.mode === 'playground') {
      this.router.navigate(['/vis'], {
        queryParams: {
          sheet: localStorage.getItem('sheet'),
          playground: false,
        },
        queryParamsHandling: 'merge',
      });
      this.ga.eventEmitter('nav_exit_playground', GaCategory.NAVBAR, 'Exit Playground Mode', GaAction.NAV, null);
    }
  }
}
