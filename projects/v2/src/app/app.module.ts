import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { SheetState } from './store/sheet.state';
import { TreeState } from './store/tree.state';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AnalyticsModule } from './services/analytics.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UIState } from './store/ui.state';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { LogsState } from './store/logs.state';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { DocsModule } from './modules/docs/docs.module';
import { RootModule } from './modules/root/root.module';
import { HomeModule } from './components/home/home.module';
import { FooterModule } from './components/footer/footer.module';
import { FileUploadModule } from './components/file-upload/file-upload.module';
import { OrganTableSelectorModule } from './components/organ-table-selector/organ-table-selector.module';
import { TrackingPopupModule } from './components/tracking-popup/tracking-popup.module';
import { MousePositionTrackerModule } from './services/mouse-position-tracker.module';

import { ConfigService } from './app-config.service';
 
export function initializeApp(appInitService: ConfigService) {
  return (): Promise<any> => { 
    return appInitService.Init();
  };
}

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
    MarkdownModule.forRoot(),
    DocsModule,
    RootModule,
    HomeModule,
    FileUploadModule,
    OrganTableSelectorModule,
    FooterModule,
    AnalyticsModule.forRoot({
      gaToken: environment.googleAnalyticsId,
      appName: 'reporter'
    }),
    TrackingPopupModule,
    MousePositionTrackerModule
  ],
  // providers: [],
  providers: [ConfigService,
    { provide: APP_INITIALIZER,useFactory: initializeApp, deps: [ConfigService], multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
