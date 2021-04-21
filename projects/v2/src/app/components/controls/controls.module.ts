import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SidenavModule } from '../sidenav/sidenav.module'
import { VisControlsComponent } from './vis-controls.component'
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [VisControlsComponent],
  imports: [
    CommonModule,
    // SidenavModule,
    MatExpansionModule,
    MatInputModule,
    MatSliderModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
  exports: [VisControlsComponent]
})
export class ControlsModule { }
