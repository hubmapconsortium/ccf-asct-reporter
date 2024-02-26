import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavModule } from '../sidenav/sidenav.module';
import { DebugLogsComponent } from './debug-logs.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidenavHeaderModule } from '../sidenav-header/sidenav-header.module';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [DebugLogsComponent],
  imports: [
    CommonModule,
    SidenavModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    SidenavHeaderModule
  ],
  exports: [DebugLogsComponent]
})
export class DebugLogsModule { }
