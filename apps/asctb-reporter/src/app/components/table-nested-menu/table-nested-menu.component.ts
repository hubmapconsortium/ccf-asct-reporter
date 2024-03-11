import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SheetDetails } from '../../models/sheet.model';

@Component({
  selector: 'app-table-nested-menu',
  templateUrl: './table-nested-menu.component.html',
  styleUrls: ['./table-nested-menu.component.scss'],
})
export class TableNestedMenuComponent implements OnInit {
  @Input() sheetDetails: SheetDetails[];
  @Input() title: string;
  window = window;
  @ViewChild('childMenu', { static: true }) public childMenu;
  sheetURL = 'https://docs.google.com/spreadsheets/d/';
  constructor() {}

  ngOnInit(): void {}

  openURL(sheetId: string, gid: string) {
    this.window.open(`${this.sheetURL}${sheetId}/edit#gid=${gid}`, '_blank');
  }
}
