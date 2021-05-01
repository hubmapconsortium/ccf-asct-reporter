import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegendComponent } from './legend.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrderModule } from 'ngx-order-pipe';



@NgModule({
  declarations: [LegendComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    OrderModule
  ],
  exports: [LegendComponent]
})
export class LegendModule { }
