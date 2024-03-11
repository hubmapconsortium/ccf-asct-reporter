import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavModule } from '../sidenav/sidenav.module';
import { IndentedListComponent } from './indented-list.component';
import { SidenavHeaderModule } from '../sidenav-header/sidenav-header.module';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [IndentedListComponent],
  imports: [
    CommonModule,
    SidenavModule,
    SidenavHeaderModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [IndentedListComponent],
})
export class IndentedListModule {}
