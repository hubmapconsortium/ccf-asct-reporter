import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavModule } from '../sidenav/sidenav.module';
import { ReportComponent } from './report.component';
import { SidenavHeaderModule } from '../sidenav-header/sidenav-header.module';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { OrderByPipe } from '../../pipes/order-by/order-by.pipe';

@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    SidenavModule,
    SidenavHeaderModule,
    MatTabsModule,
    NgxChartsModule,
    MatExpansionModule,
    OrderByPipe,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
  ],
  exports: [ReportComponent],
})
export class ReportModule {}
