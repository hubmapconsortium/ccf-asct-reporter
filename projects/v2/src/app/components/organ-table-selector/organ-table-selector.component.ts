import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SHEET_OPTIONS } from '../../static/config';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { GaAction, GaCategory, GaOrgansInfo } from '../../models/ga.model';
import { OrganTableSelect } from '../../models/sheet.model';

@Component({
  selector: 'app-organ-table-selector',
  templateUrl: './organ-table-selector.component.html',
  styleUrls: ['./organ-table-selector.component.scss'],
})
export class OrganTableSelectorComponent implements OnInit {
  /**
   * Sheet configs
   */
  SHEET_OPTIONS = SHEET_OPTIONS;
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
  displayedColumns: string[] = ['select', 'name', 'version'];
  dataSource = new MatTableDataSource(SHEET_OPTIONS);
  selection = new SelectionModel(true, []);

  constructor(
    public dialogRef: MatDialogRef<OrganTableSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrganTableSelect,
    public ga: GoogleAnalyticsService
  ) {
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
    console.log(ga_details);
    if (this.data.isIntilalSelect === true) {
      this.ga.eventEmitter('organs_select_initial', GaCategory.NAVBAR, 'SELECTED ORGANS', GaAction.CLICK, 0, JSON.stringify(ga_details));
    } else {
      this.ga.eventEmitter('organs_select_edit', GaCategory.NAVBAR, 'SELECTED ORGANS', GaAction.CLICK, 0, JSON.stringify(ga_details));
    }
    this.dialogRef.close(this.organs);
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
    element.symbol = value;
  }

  selectRow(row) {
    this.selection.toggle(row);
    this.hasSomeOrgans = this.selection.selected.length > 0;
  }
}