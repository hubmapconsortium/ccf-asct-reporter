import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { IGoogleAnalyticsCommand, NgxGoogleAnalyticsModule } from 'ngx-google-analytics';

import { ConsentService } from './consent.service';
import { GoogleAnalyticsSyncService } from './google-analytics-sync.service';
import { LocalStorageSyncService } from './local-storage-sync.service';


export interface AnalyticsOptions {
  gaToken: string;

  appName?: string;
  projectName?: string;

  developmentMode?: boolean;
}


const EAGERLY_LOADED_SERVICES = [
  ConsentService,
  GoogleAnalyticsSyncService,
  LocalStorageSyncService,
];


function toAttributes(obj: Record<string, unknown>): Record<string, string> {
  return Object.entries(obj).reduce<Record<string, string>>((attrs, [key, value]) => {
    if (value != null) {
      attrs[key] = `${value}`;
    }

    return attrs;
  }, {});
}

function initCommands(options: AnalyticsOptions): IGoogleAnalyticsCommand[] {
  const { appName, projectName, developmentMode } = options;

  return [
    {
      command: 'set',
      values: [toAttributes({
        appName,
        projectName,
        developmentMode
      })]
    }
  ];
}


@NgModule({
  imports: [
    NgxGoogleAnalyticsModule
  ],
  providers: [
    ...EAGERLY_LOADED_SERVICES,

    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => () => undefined,
      deps: EAGERLY_LOADED_SERVICES
    }
  ]
})
export class AnalyticsModule {
  static forRoot(options: AnalyticsOptions): ModuleWithProviders<AnalyticsModule> {
    const { providers = [] } = NgxGoogleAnalyticsModule.forRoot(
      options.gaToken,
      initCommands(options)
    );

    return { ngModule: AnalyticsModule, providers };
  }
}
