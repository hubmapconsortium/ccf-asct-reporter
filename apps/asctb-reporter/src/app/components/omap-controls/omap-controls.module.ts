import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OmapControlsComponent } from './omap-controls.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [OmapControlsComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  exports: [OmapControlsComponent],
})
export class OmapControlsModule {}
