import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  IGoogleAnalyticsSettings,
  NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN,
  NGX_WINDOW,
} from 'ngx-google-analytics';
import { Subscription } from 'rxjs';

import { ConsentService } from './consent.service';

@Injectable()
export class GoogleAnalyticsSyncService implements OnDestroy {
  private readonly token: string;
  private readonly subscriptions = new Subscription();

  constructor(
    consentService: ConsentService,
    @Inject(NGX_WINDOW) private readonly window: Record<string, boolean> | null,
    @Inject(NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN)
    { trackingCode }: IGoogleAnalyticsSettings
  ) {
    this.token = trackingCode;

    this.subscriptions.add(
      consentService.consentChange.subscribe((consent) =>
        this.toggleGoogleAnalytics(consent === 'rescinded')
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private toggleGoogleAnalytics(disabled: boolean): void {
    if (this.window) {
      this.window[`ga-disable-${this.token}`] = disabled;
    }
  }
}
