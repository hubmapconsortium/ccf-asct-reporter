import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableNestedMenuComponent } from './table-nested-menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    TableNestedMenuComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ],
  exports: [ TableNestedMenuComponent ]
})
export class TableNestedMenuModule { }
