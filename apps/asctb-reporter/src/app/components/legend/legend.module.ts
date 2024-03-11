import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegendComponent } from './legend.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrderByPipe } from '../../pipes/order-by/order-by.pipe';

@NgModule({
  declarations: [LegendComponent],
  imports: [CommonModule, MatExpansionModule, OrderByPipe],
  exports: [LegendComponent],
})
export class LegendModule {}
