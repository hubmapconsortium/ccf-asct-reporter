import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SheetState } from './store/sheet.state';
import { TreeState } from './store/tree.state';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { OrderModule } from 'ngx-order-pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import {GoogleAnalyticsService} from './services/google-analytics.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UIState } from './store/ui.state';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { LogsState } from './store/logs.state';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../environments/environment';

import { CompareModule } from '././components/compare/compare.module';
import { ErrorModule } from './components/error/error.module';
import { IndentedListModule } from './components/indented-list/indented-list.module';
import { InfoModule } from './components/info/info.module';
import { LegendModule } from './components/legend/legend.module';
import { LoadingModule } from './components/loading/loading.module';
import { NavItemModule } from './components/nav-item/nav-item.module';
import { ReportModule } from './components/report/report.module';
import { SidenavModule } from './components/sidenav/sidenav.module';
import { SidenavHeaderModule } from './components/sidenav-header/sidenav-header.module';
import { ControlPaneModule } from './modules/control-pane/control-pane.module';
import { DocsModule } from './modules/docs/docs.module';
import { FunctionsModule } from './modules/functions/functions.module';
import { NavbarModule } from './modules/navbar/navbar.module';
import { PlaygroundModule } from './modules/playground/playground.module';
import { RootModule } from './modules/root/root.module';
import { SearchModule } from './modules/search/search.module';
import { TreeModule } from './modules/tree/tree.module';
import { ControlsModule } from './components/controls/controls.module';
import { DebugLogsModule } from './components/debug-logs/debug-logs.module';
import { DoiModule } from './components/doi/doi.module';
import { DocsNavModule } from './modules/docs/docs-nav/docs-nav.module';


@NgModule({
  declarations: [
    AppComponent
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
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsResetPluginModule.forRoot(),
    OrderModule,
    FontAwesomeModule,
    MarkdownModule.forRoot(),
    CompareModule,
    ControlsModule,
    DebugLogsModule,
    DoiModule,
    ErrorModule,
    IndentedListModule,
    InfoModule,
    LegendModule,
    LoadingModule,
    NavItemModule,
    ReportModule,
    SidenavModule,
    SidenavHeaderModule,
    ControlPaneModule,
    DocsModule,
    FunctionsModule,
    NavbarModule,
    PlaygroundModule,
    RootModule,
    SearchModule,
    TreeModule,
    DocsNavModule
  ],
  providers: [GoogleAnalyticsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
