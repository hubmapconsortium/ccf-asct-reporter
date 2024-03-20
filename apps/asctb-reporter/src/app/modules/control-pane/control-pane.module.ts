import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ControlsModule } from '../../components/controls/controls.module';
import { LegendModule } from '../../components/legend/legend.module';
import { OmapControlsModule } from '../../components/omap-controls/omap-controls.module';
import { SidenavModule } from '../../components/sidenav/sidenav.module';
import { FunctionsModule } from '../functions/functions.module';
import { ControlPaneComponent } from './control-pane.component';

@NgModule({
  declarations: [ControlPaneComponent],
  imports: [
    CommonModule,
    SidenavModule,
    MatButtonModule,
    LegendModule,
    FunctionsModule,
    ControlsModule,
    RouterModule,
    OmapControlsModule,
  ],
  exports: [ControlPaneComponent],
})
export class ControlPaneModule {}
