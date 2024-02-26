import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [SidenavComponent],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [SidenavComponent]
})
export class SidenavModule { }
