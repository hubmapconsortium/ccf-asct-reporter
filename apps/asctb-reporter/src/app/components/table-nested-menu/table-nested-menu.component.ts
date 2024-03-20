import { Component, Input, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { SheetDetails } from '../../models/sheet.model';

@Component({
  selector: 'app-table-nested-menu',
  templateUrl: './table-nested-menu.component.html',
  styleUrls: ['./table-nested-menu.component.scss'],
})
export class TableNestedMenuComponent {
  @Input() sheetDetails: SheetDetails[] = [];
  @Input() title: string = '';
  window = window;
  @ViewChild('childMenu', { static: true }) public childMenu!: MatMenu;
  sheetURL = 'https://docs.google.com/spreadsheets/d/';

  openURL(sheetId: string, gid: string) {
    this.window.open(`${this.sheetURL}${sheetId}/edit#gid=${gid}`, '_blank');
  }
}
