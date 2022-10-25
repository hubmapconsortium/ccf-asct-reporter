import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ValidationTableComponent } from './validation-table.component';

@NgModule({
  declarations: [ValidationTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule
  ],
  exports: [ValidationTableComponent]
})
export class ValidationTableModule { }
