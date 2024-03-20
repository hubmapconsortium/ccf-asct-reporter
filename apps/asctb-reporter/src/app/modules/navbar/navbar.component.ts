import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Observable } from 'rxjs';
import { ClearSheetLogs } from '../../actions/logs.actions';
import { UpdateGetFromCache } from '../../actions/sheet.actions';
import {
  OpenCompare,
  ToggleControlPane,
  ToggleDebugLogs,
  ToggleIndentList,
  ToggleReport,
} from '../../actions/ui.actions';
import { ConfigService } from '../../app-config.service';
import { OrganTableSelectorComponent } from '../../components/organ-table-selector/organ-table-selector.component';
import { GaAction, GaCategory } from '../../models/ga.model';
import {
  PlaygroundSheetOptions,
  Sheet,
  SheetDetails,
  SheetOptions,
  Version,
  VersionDetail,
} from '../../models/sheet.model';
import { SheetService } from '../../services/sheet.service';
import { SheetState, SheetStateModel } from '../../store/sheet.state';
import { UIState, UIStateModel } from '../../store/ui.state';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  /**
   * Available Data versions (depricated)
   */
  versions: Version[] = [];
  /**
   * Menu options
   */
  moreOptions: { type: string; url: string; name: string }[] = [];
  /**
   * Export options
   */
  imgOptions: string[] = [];
  /**
   * Sheet configs
   */
  sheetOptions: SheetOptions[] = [];
  /**
   * Sheet configs
   */
  omapSheetOptions: SheetDetails[] = [];
  /**
   * Document window object
   */
  window: Window = window;
  /**
   * Organ sheet selected
   */
  selectedSheetOption!: string;
  /**
   * Selected data version
   */
  selectedVersion: string | undefined;
  /**
   * Currently selected sheet
   */
  currentSheet!: Sheet;
  /**
   * Currently selecte mode
   */
  mode!: string;
  /**
   * Currently selected organs
   */
  selectedOrgans: string[] = [];
  /**
   * Currently selected organs joined by comma
   */
  selectedOrgansValues!: string;
  /**
   * Currently selected organs
   */
  omapSelectedOrgans: string[] = [];
  /**
   * Currently selected organs joined by comma
   */
  omapSelectedOrgansValues!: string;

  sheetConfig: SheetDetails[] = [];
  omapSheetConfig: SheetDetails[] = [];

  // state observables
  @Select(SheetState) sheet$!: Observable<SheetStateModel>;
  @Select(UIState) ui$!: Observable<UIStateModel>;
  @Select(SheetState.getMode) mode$!: Observable<string>;
  @Select(SheetState.getSelectedOrgans) selectedOrgans$!: Observable<string[]>;
  @Select(SheetState.getOMAPSelectedOrgans) omapSelectedOrgans$!: Observable<
    string[]
  >;

  @Input() cache!: boolean;
  @Output() export = new EventEmitter<string>();

  get selectedOrgansLabel(): string {
    let x =
      this.selectedOrgansValues?.length > 0
        ? 'ASCT+B: ' + this.selectedOrgansValues
        : '';
    x =
      this.selectedOrgansValues?.length > 0 &&
      this.omapSelectedOrgansValues?.length > 0
        ? x + ' | '
        : x;
    x =
      this.omapSelectedOrgansValues?.length > 0
        ? x + 'OMAP: ' + this.omapSelectedOrgansValues
        : x;
    if (x.length > 35) {
      return `${this.selectedOrgansValues?.split(',').length} ASCT+B Tables, ${
        this.omapSelectedOrgansValues?.split(',').length
      } OMAPs`;
    } else {
      return x;
    }
  }
  playgroundSheetOptions: PlaygroundSheetOptions[] = [];
  masterSheetLink!: string;

  constructor(
    public sheetservice: SheetService,
    public configService: ConfigService,
    public store: Store,
    public router: Router,
    public ga: GoogleAnalyticsService,
    public dialog: MatDialog
  ) {
    this.configService.sheetConfiguration$.subscribe((sheetOptions) => {
      this.sheetConfig = sheetOptions;
      this.sheetOptions = sheetOptions as unknown as SheetOptions[];
    });
    this.configService.omapsheetConfiguration$.subscribe((sheetOptions) => {
      this.omapSheetConfig = sheetOptions;
      this.omapSheetOptions = sheetOptions;
    });

    this.configService.config$.subscribe((config) => {
      this.versions = config['version'] as Version[];
      this.moreOptions = config['moreOptions'] as {
        type: string;
        url: string;
        name: string;
      }[];
      this.imgOptions = config['imgOptions'] as string[];
      this.playgroundSheetOptions = config[
        'playgroundSheetOptions'
      ] as PlaygroundSheetOptions[];
      this.masterSheetLink = config['masterSheetLink'] as string;
    });
  }

  ngOnInit(): void {
    this.sheet$.subscribe((sheet) => {
      if (sheet.sheet) {
        this.currentSheet = sheet.sheet;
        this.selectedSheetOption = sheet.sheet.display;
        this.selectedVersion = this.versions.find(
          (s) => s.folder === sheet.version
        )?.display;
      }
    });

    this.mode$.subscribe((mode) => {
      this.mode = mode;
      if (mode === 'playground') {
        this.sheetOptions = this.playgroundSheetOptions;
      }
    });

    this.selectedOrgans$.subscribe((organs) => {
      const selectedOrgansNames: string[] = [];
      this.selectedOrgans = organs;
      for (const organ of organs) {
        this.sheetConfig.forEach((config: SheetDetails) => {
          config.version?.forEach((version: VersionDetail) => {
            if (version.value === organ) {
              selectedOrgansNames.push(config.display);
            }
          });
        });
      }
      this.selectedOrgansValues = selectedOrgansNames?.join(', ');
    });
    this.omapSelectedOrgans$.subscribe((organs) => {
      const selectedOrgansNames: string[] = [];
      this.omapSelectedOrgans = organs;
      for (const organ of organs) {
        this.omapSheetConfig.forEach((config: SheetDetails) => {
          config.version?.forEach((version: VersionDetail) => {
            if (version.value === organ) {
              selectedOrgansNames.push(config.display);
            }
          });
        });
      }
      this.omapSelectedOrgansValues =
        selectedOrgansNames?.join(', ').length > 64
          ? `${organs.length} organs selected`
          : selectedOrgansNames?.join(', ');
    });
  }

  getSheetSelection(sheet: string) {
    const selectedSheet = this.sheetOptions.find(
      (s) => (s as unknown as { name: string }).name === sheet
    );
    this.store.dispatch(new ClearSheetLogs());
    this.router.navigate(['/vis'], {
      queryParams: { sheet: selectedSheet?.sheet ?? '' },
      queryParamsHandling: 'merge',
    });
    this.ga.event(
      GaAction.CLICK,
      GaCategory.NAVBAR,
      `Select Organ Set Dropdown: ${selectedSheet?.sheet}`
    );
  }

  getVersionSelection(version: string) {
    const selectedVersion = this.versions.find((s) => s.display === version);
    this.router.navigate(['/vis'], {
      queryParams: { version: selectedVersion?.folder },
      queryParamsHandling: 'merge',
    });
  }

  openMasterDataTables() {
    this.ga.event(
      GaAction.NAV,
      GaCategory.NAVBAR,
      'Go to Master Data Tables',
      undefined
    );
    window.open(this.masterSheetLink, '_blank');
  }

  refreshData() {
    this.router.navigate(['/vis'], {
      queryParams: {
        selectedOrgans: this.selectedOrgans?.join(','),
        playground: false,
        omapSelectedOrgans: this.omapSelectedOrgans?.join(','),
      },
    });

    this.ga.event(
      GaAction.CLICK,
      GaCategory.NAVBAR,
      'Refresh Visualization Button',
      undefined
    );
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
    this.ga.event(
      GaAction.CLICK,
      GaCategory.NAVBAR,
      `Export Image: ${imageType}`,
      0
    );
  }

  onOptionClick(type: string, url: string) {
    switch (type) {
      case 'route':
        this.router.navigate([url]);
        break;
      case 'tab':
        this.window.open(url, '_blank');
        break;
      default:
        this.window.open(url, '_blank');
        break;
    }
  }

  openSelectOrgansDialog() {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.autoFocus = true;
    config.id = 'OrganTableSelector';
    config.width = 'fit-content';
    config.data = {
      organs: this.selectedOrgans,
      isIntilalSelect: false,
      getFromCache: this.cache,
      omapOrgans: this.omapSelectedOrgans,
    };

    const dialogRef = this.dialog.open(OrganTableSelectorComponent, config);
    dialogRef.afterClosed().subscribe(({ organs, cache, omapOrgans }) => {
      this.store.dispatch(new UpdateGetFromCache(cache));
      if (organs !== false) {
        this.router.navigate(['/vis'], {
          queryParams: {
            selectedOrgans: organs?.join(','),
            playground: false,
            omapSelectedOrgans: omapOrgans?.join(','),
          },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  toggleMode() {
    if (this.mode === 'vis') {
      this.router.navigate(['/vis'], {
        queryParams: { playground: true, selectedOrgans: 'example' },
        queryParamsHandling: 'merge',
      });
      this.ga.event(
        GaAction.NAV,
        GaCategory.NAVBAR,
        'Enter Playground Mode',
        undefined
      );
    } else if (this.mode === 'playground') {
      this.router.navigate(['/vis'], {
        queryParams: {
          selectedOrgans: sessionStorage.getItem('selectedOrgans'),
          playground: false,
        },
        queryParamsHandling: 'merge',
      });
      this.ga.event(
        GaAction.NAV,
        GaCategory.NAVBAR,
        'Exit Playground Mode',
        undefined
      );
    }
  }
}
