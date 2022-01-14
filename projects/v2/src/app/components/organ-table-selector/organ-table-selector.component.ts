import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { GaAction, GaCategory, GaOrgansInfo } from '../../models/ga.model';
import { OrganTableOnClose, OrganTableSelect } from '../../models/sheet.model';
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
  SHEET_OPTIONS;
  /**
   * Has some selected organs
   */
  hasSomeOrgans = false;
  /**
   * Document window object
   */
  window: Window = window;
  /**
   * Organ sheet selected
   */
  selectedSheetOption: string;
  organs = [];
  getFromCache: boolean;
  displayedColumns: string[] = ['select', 'name', 'version'];
  selection = new SelectionModel(true, []);
  /**
   * Data to emit when dialog is closed
   */
  onClose: OrganTableOnClose = {
    'organs': false,
    'cache': true,
  }
  dataSource: MatTableDataSource<unknown>;

  constructor(
    public configService: ConfigService,
    public dialogRef: MatDialogRef<OrganTableSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrganTableSelect,
    public ga: GoogleAnalyticsService
  ) {

    this.configService.CONFIG.subscribe(config=>{
      this.SHEET_OPTIONS = config['SHEET_OPTIONS'];
      this.dataSource = new MatTableDataSource(this.SHEET_OPTIONS);
    });

    this.getFromCache = data.getFromCache;
    this.onClose.cache = data.getFromCache;
    this.organs = data.organs ? data.organs : [];
    this.dataSource.data.forEach((dataElement: any) => {
      dataElement?.version?.forEach((v, i) => {
        if (i === 0) {
          dataElement.symbol = v.value;
        }
      });
    });
    this.organs.forEach((item) => {
      this.dataSource.data.forEach((dataElement: any) => {
        dataElement?.version?.forEach((v, i) => {
          if (v.value === item) {
            dataElement.symbol = item;
            this.selection.select(dataElement);
          }
        });
      });
    });
    this.hasSomeOrgans = this.selection.selected.length > 0;
  }

  ngOnInit(): void {}

  addSheets(sheets) {
    const ga_details: GaOrgansInfo = {
      selectedOrgans: [],
      numOrgans: 0,
    };
    this.organs = [];
    this.selection.selected.map((item) => {
      if (item.symbol) {
        this.organs.push(item.symbol);
        ga_details.selectedOrgans.push({
          organ: item.title,
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
    this.dialogRef.close({
      'organs': this.organs,
      'cache': this.getFromCache
    });
  }

  selectAllOrgans() {
    const allOrgans = [];
    this.SHEET_OPTIONS.forEach((s: any) => {
      s.version?.forEach((v) => {
        allOrgans.push(v.value);
      });
    });
    this.organs = allOrgans;
    this.hasSomeOrgans = this.organs?.length > 0;
  }
  deselectAllOrgans() {
    this.organs = [];
    this.hasSomeOrgans = this.organs?.length > 0;
  }
  selectOption() {
    this.hasSomeOrgans = this.organs?.length > 0;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.hasSomeOrgans = this.selection.selected.length > 0;
      return;
    }

    this.selection.select(...this.dataSource.data);
    this.hasSomeOrgans = this.selection.selected.length > 0;
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  changeVersion(value: any, element: any) {
    if (element.title === 'All Organs'){
      this.selection.select(...this.dataSource.data);
      if (value === 'All_Organs-v1.1'){
        this.dataSource.data.forEach((dataElement: any) => {
          if (dataElement.version.length === 1 && dataElement.version[0].viewValue !== 'v1.1') {
            this.selection.toggle(dataElement);
          }
          dataElement?.version?.forEach((v, i) => {
            if (i === 1) {
              dataElement.symbol = v.value;
            }
          });
        });
        this.hasSomeOrgans = this.selection.selected.length > 0;
      }
      else{
        this.dataSource.data.forEach((dataElement: any) => {
          if (dataElement.version.length === 1 && dataElement.version[0].viewValue !== 'v1.0') {
            this.selection.toggle(dataElement);
          }
          dataElement?.version?.forEach((v, i) => {
            if (i === 0) {
              dataElement.symbol = v.value;
            }
          });
        });
        this.hasSomeOrgans = this.selection.selected.length > 0;
      }
    }
    else{
      element.symbol = value;
    }
  }

  selectRow(row) {
    
    if (row.title === 'All Organs'){
      if(this.isAllSelected()){
        this.selection.clear();
      }
      else{
        this.selection.select(...this.dataSource.data);
        this.hasSomeOrgans = this.selection.selected.length > 0;
      }
    }
    else{
      this.selection.toggle(row);
      this.hasSomeOrgans = this.selection.selected.length > 0;
    }
  }
}
