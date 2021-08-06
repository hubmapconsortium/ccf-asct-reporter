import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SHEET_OPTIONS } from '../../static/config';

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
  constructor(
    public dialogRef: MatDialogRef<OrganTableSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<string>
  ) {
    this.organs = data;
    this.hasSomeOrgans = this.organs?.length > 0;
  }

  ngOnInit(): void {}

  addSheets(sheets) {
    this.dialogRef.close(this.organs);
  }

  selectAllOrgans() {
    let allOrgans = [];
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
}
