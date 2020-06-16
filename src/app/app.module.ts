import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { SheetService } from './sheet.service';
import { NavbarComponent } from './navbar/navbar.component';

import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import {MatSelectModule} from '@angular/material/select';
import { TreeComponent } from './tree/tree.component'

let MatModules = [
  MatToolbarModule,
  MatButtonModule,
  MatSelectModule
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TreeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatModules
  ],
  providers: [
    SheetService
  ],
  exports: [
    MatModules
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
