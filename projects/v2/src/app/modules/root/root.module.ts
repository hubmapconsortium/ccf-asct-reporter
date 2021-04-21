import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootComponent } from './root.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ControlPaneModule } from '../control-pane/control-pane.module';
import { ReportModule } from '../../components/report/report.module';
import { IndentedListModule } from '../../components/indented-list/indented-list.module';
import { DebugLogsModule } from '../../components/debug-logs/debug-logs.module';
import { CompareModule } from '../../components/compare/compare.module';
import { NavbarModule } from '../navbar/navbar.module';
import { ErrorModule } from '../../components/error/error.module';
import { LegendModule } from '../../components/legend/legend.module';
import { PlaygroundModule } from '../playground/playground.module';
import { TreeModule } from '../tree/tree.module';



@NgModule({
  declarations: [RootComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    ControlPaneModule,
    ReportModule,
    IndentedListModule,
    DebugLogsModule,
    CompareModule,
    NavbarModule,
    ErrorModule,
    LegendModule,
    PlaygroundModule,
    TreeModule
  ],
  exports: [RootComponent]
})
export class RootModule { }
