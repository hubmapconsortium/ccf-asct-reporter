import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SheetState } from './store/sheet.state';
import { TreeState } from './store/tree.state';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { OrderModule } from 'ngx-order-pipe';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import {GoogleAnalyticsService} from './services/google-analytics.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RootComponent } from './modules/root/root.component';
import { TreeComponent } from './modules/tree/tree.component';
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
import { SidenavHeaderComponent } from './components/sidenav-header/sidenav-header.component';
import { ReportComponent } from './components/report/report.component';
import { DebugLogsComponent } from './components/debug-logs/debug-logs.component';
import { LogsState } from './store/logs.state';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfoComponent } from './components/info/info.component';
import { ComapreComponent } from './components/comapre/comapre.component';
import { VisControlsComponent } from './components/controls/vis-controls.component';
import { LegendComponent } from './components/legend/legend.component';
import { PlaygroundComponent } from './modules/playground/playground.component';
import { NavItemComponent } from './components/nav-item/nav-item.component';



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
    SidenavComponent,
    SidenavHeaderComponent,
    ReportComponent,
    DebugLogsComponent,
    InfoComponent,
    ComapreComponent,
    VisControlsComponent,
    LegendComponent,
    PlaygroundComponent,
    NavItemComponent
  ],
  imports: [
    BrowserModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxsModule.forRoot([SheetState, TreeState, UIState, LogsState]),
    NgxsDataPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    NgxsResetPluginModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMatSelectSearchModule,
    OrderModule,
    FontAwesomeModule
  ],
  providers: [GoogleAnalyticsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
