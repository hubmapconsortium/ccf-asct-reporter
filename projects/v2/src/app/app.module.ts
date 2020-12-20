import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SheetState } from './store/sheet.state';
import { TreeState } from './store/tree.state';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsDataPluginModule } from '@ngxs-labs/data';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RootComponent } from './modules/root/root.component';
import { TreeComponent } from './components/tree/tree.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './modules/navbar/navbar.component';
import { ControlPaneComponent } from './modules/control-pane/control-pane.component';
import { UIState } from './store/ui.state';
import { ErrorComponent } from './components/error/error.component';
import { FunctionsComponent } from './modules/functions/functions.component';
import { SearchComponent } from './modules/search/search.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { IndentedListComponent } from './components/indented-list/indented-list.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';



@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    TreeComponent,
    HomeComponent,
    NavbarComponent,
    ControlPaneComponent,
    ErrorComponent,
    FunctionsComponent,
    SearchComponent,
    IndentedListComponent,
    SidenavComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxsModule.forRoot([SheetState, TreeState, UIState]),
    NgxsDataPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    NgxsResetPluginModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMatSelectSearchModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
