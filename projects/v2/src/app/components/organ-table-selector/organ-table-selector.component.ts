import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { GaAction, GaCategory, GaOrgansInfo } from '../../models/ga.model';
import { OrganTableOnClose, OrganTableSelect, SheetDetails, SheetOptions } from '../../models/sheet.model';
import { ConfigService } from '../../app-config.service';


@Component({
  selector: 'app-organ-table-selector',
  templateUrl: './organ-table-selector.component.html',
  styleUrls: ['./organ-table-selector.component.scss'],
})

export class OrganTableSelectorComponent implements OnInit {
  /**
   * Sheet configs
   */
  sheetOptions;

  omapSheetOptions;
  /**
   * Has some selected organs
   */
  get hasSomeOrgans(): boolean {
    if (this.componentActive == 0 && !this.selection.isEmpty()) {
      return true;
    }
    else if (this.componentActive == 1 && !this.omapselection.isEmpty()) {
      return true;
    }
    return false;
  }
  /**
   * Document window object
   */
  window: Window = window;
  /**
   * Organ sheet selected
   */
  selectedSheetOption: string;
  organs = [];
  omapOrgans=[];
  getFromCache: boolean;
  displayedColumns: string[] = ['select', 'name', 'version'];
  omapdisplayedColumns: string[] = [
    'select',
    'Organs',
    'Multiplexed antibody-based imaging method',
    'Tissue presevation method',
    'OMAP-ID',
    'Version'];
  selection = new SelectionModel(true, []);
  omapselection = new SelectionModel(true, []);
  componentActive = 0;
  /**
   * Data to emit when dialog is closed
   */
  onClose: OrganTableOnClose = {
    'organs': false,
    'cache': true,
  }
  dataSource: MatTableDataSource<unknown>;
  omapdataSource: MatTableDataSource<unknown>;

  constructor(
    public configService: ConfigService,
    public dialogRef: MatDialogRef<OrganTableSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrganTableSelect,
    public ga: GoogleAnalyticsService
  ) {
    this.configService.omapsheetConfiguration$.subscribe((sheetOptions) => {
      this.omapSheetOptions = sheetOptions.filter(o => o.name !== 'some');
      this.omapdataSource = new MatTableDataSource(this.omapSheetOptions);
      this.omapdataSource.data?.forEach((de: SheetDetails) => {
        de?.version?.forEach((v, i) => {
          de.symbol = v.value;
        });
      });
    });

    this.configService.sheetConfiguration$.subscribe((sheetOptions) => {
      this.sheetOptions = sheetOptions.filter(o => o.name !== 'some');
      this.dataSource = new MatTableDataSource(this.sheetOptions);
    });

    this.getFromCache = data.getFromCache;
    this.onClose.cache = data.getFromCache;
    this.organs = data.organs ? data.organs : [];
    this.omapOrgans = data.omapOrgans ? data.omapOrgans : [];
    this.dataSource.data.forEach((dataElement: SheetOptions) => {
      dataElement?.version?.forEach((v, i) => {
        dataElement.symbol = v.value;
      });
    });

    this.organs.forEach((item) => {
      this.dataSource.data.forEach((dataElement: SheetOptions) => {
        dataElement?.version?.forEach((v, i) => {
          if (v.value === item) {
            dataElement.symbol = item;
            this.selection.select(dataElement);
          }
        });
      });
    });
    this.omapOrgans.forEach((item) => {
      this.omapdataSource.data.forEach((dataElement: SheetOptions) => {
        dataElement?.version?.forEach((v, i) => {
          if (v.value === item) {
            dataElement.symbol = item;
            this.omapselection.select(dataElement);
          }
        });
      });
    });
  }

  ngOnInit(): void { }

  addSheets(sheets) {
    const ga_details: GaOrgansInfo = {
      selectedOrgans: [],
      numOrgans: 0,
    };
    this.organs = [];
    this.selection.selected.map((item) => {
      if (item.name === 'all') {
        return;
      }
      if (item.symbol) {
        this.organs.push(item.symbol);
        ga_details.selectedOrgans.push({
          organ: item.display,
          version: item.symbol.split('-').slice(1).join('-')
        });
      }
    });
    ga_details.numOrgans = ga_details.selectedOrgans.length;
    if (this.data.isIntilalSelect === true) {
      this.ga.event(GaAction.CLICK, GaCategory.NAVBAR, `SELECTED ORGANS INITIAL: ${JSON.stringify(ga_details)}`, 0);
    } else {
      this.ga.event(GaAction.CLICK, GaCategory.NAVBAR, `SELECTED ORGANS EDIT: ${JSON.stringify(ga_details)}`, 0);
    }
    const omapOrgans=[];
    this.omapselection.selected.forEach(element => {
      omapOrgans.push(element.symbol);
    });
    this.dialogRef.close({
      'organs': this.organs,
      'cache': this.getFromCache,
      'omapOrgans': omapOrgans
    });
  }

  isAllSelected() {
    const selection = this.componentActive == 0 ? this.selection : this.omapselection;
    const dataSource = this.componentActive == 0 ? this.dataSource : this.omapdataSource;
    const numSelected = selection.selected.length;
    const numRows = dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    const selection = this.componentActive == 0 ? this.selection : this.omapselection;
    const dataSource = this.componentActive == 0 ? this.dataSource : this.omapdataSource;
    if (this.isAllSelected()) {
      selection.clear();
      return;
    }
    selection.select(...dataSource.data);
  }

  checkboxLabel(row?: SheetDetails): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  changeVersion(value: string, r: SheetDetails): void {
    const row: SheetDetails = r as SheetDetails;
    if (row.name === 'all') {
      row.symbol = value;
      this.selectByHraVersion(row);
    } else {
      row.symbol = value;
    }
  }

  selectByHraVersion(row: SheetDetails): void {
    const selectedVersion = row.symbol?.split('-')[1] ?? row.version?.slice(-1)[0].hraVersion;
    this.dataSource.data.forEach((dataElement: SheetOptions) => {
      const version = dataElement.version?.find((v) => v.hraVersion?.includes(selectedVersion));
      if (version) {
        dataElement.symbol = version.value;
        this.selection.select(dataElement);
      } else {
        this.selection.deselect(dataElement);
      }
    });
  }

  selectRow(r: SheetDetails): void {
    if (this.componentActive == 0) {
      const row: SheetDetails = r as SheetDetails;
      if (row.name === 'all') {
        if (this.selection.isSelected(row)) {
          this.selection.clear();
        } else {
          this.selectByHraVersion(row);
        }
      }
      else {
        this.selection.toggle(row);
      }
    }
    else {
      const row: SheetDetails = r as SheetDetails;
      this.omapselection.toggle(row);
    }
  }

  changeTab(tabIndex) {
    this.componentActive = tabIndex;

  }
}
