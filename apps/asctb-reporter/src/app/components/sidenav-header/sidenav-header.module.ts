import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavHeaderComponent } from './sidenav-header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SidenavHeaderComponent],
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatButtonModule],
  exports: [SidenavHeaderComponent],
})
export class SidenavHeaderModule {}
