import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPaneComponent } from './control-pane.component';
import { SidenavModule } from '../../components/sidenav/sidenav.module';
import { MatButtonModule } from '@angular/material/button';
import { LegendModule } from '../../components/legend/legend.module';
import { FunctionsModule } from '../functions/functions.module';
import { ControlsModule } from '../../components/controls/controls.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ControlPaneComponent],
  imports: [
    CommonModule,
    SidenavModule,
    MatButtonModule,
    LegendModule,
    FunctionsModule,
    ControlsModule,
    RouterModule
  ],
  exports: [ControlPaneComponent]
})
export class ControlPaneModule { }
