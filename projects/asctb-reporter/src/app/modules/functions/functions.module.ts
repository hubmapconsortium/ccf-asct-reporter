import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunctionsComponent } from './functions.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [FunctionsComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatButtonModule
  ],
  exports: [FunctionsComponent]
})
export class FunctionsModule { }
