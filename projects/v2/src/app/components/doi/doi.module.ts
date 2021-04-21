import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoiComponent } from './doi.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [DoiComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [DoiComponent]
})
export class DoiModule { }
