import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavModule } from '../sidenav/sidenav.module';
import { ReportComponent } from './report.component';
import { SidenavHeaderModule } from '../sidenav-header/sidenav-header.module';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrderModule } from 'ngx-order-pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatTableExporterModule } from 'mat-table-exporter';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    SidenavModule,
    SidenavHeaderModule,
    MatTabsModule,
    NgxChartsModule,
    MatExpansionModule,
    OrderModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTableExporterModule,
    MatTooltipModule,
  ],
  exports: [ReportComponent]
})
export class ReportModule { }
