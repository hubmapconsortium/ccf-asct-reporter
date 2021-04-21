import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompareComponent } from './compare.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidenavModule } from '../sidenav/sidenav.module'
import { SidenavHeaderModule } from '../sidenav-header/sidenav-header.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../material.module';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [CompareComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    SidenavModule,
    SidenavHeaderModule,
    BrowserAnimationsModule,
    MatButtonModule
    // MaterialModule
  ],
  exports: [
    CompareComponent
  ]
})
export class CompareModule { }
