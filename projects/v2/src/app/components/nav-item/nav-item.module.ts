import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavItemComponent } from './nav-item.component';



@NgModule({
  declarations: [NavItemComponent],
  imports: [
    CommonModule
  ],
  exports: [NavItemComponent]
})
export class NavItemModule { }
