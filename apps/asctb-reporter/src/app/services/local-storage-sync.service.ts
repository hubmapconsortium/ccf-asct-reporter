import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Consent, ConsentService } from './consent.service';

export const LOCAL_STORAGE_CONSENT_KEY = new InjectionToken(
  'Key under which consent is stored',
  {
    providedIn: 'root',
    factory: () => 'ALLOW_TELEMETRY',
  }
);

@Injectable()
export class LocalStorageSyncService implements OnDestroy {
  private readonly storage?: typeof localStorage;
  private readonly subscriptions = new Subscription();

  constructor(
    consentService: ConsentService,
    @Inject(LOCAL_STORAGE_CONSENT_KEY) private readonly key: string
  ) {
    try {
      this.storage = localStorage;
    } catch (_error) {
      /* Ignored */
    }

    consentService.setConsent(this.loadConsent());
    this.subscriptions.add(
      consentService.consentChange.subscribe((consent) =>
        this.saveConsent(consent)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadConsent(): Consent {
    const rawValue = this.storage?.getItem?.(this.key);
    if (rawValue == null) {
      return 'not-set';
    }

    const value = rawValue.trim().toLowerCase();
    switch (value) {
      case 'given': /* fallthrough */
      case 'rescinded':
        return value;
      default:
        return 'not-set';
    }
  }

  private saveConsent(value: Consent): void {
    this.storage?.setItem?.(this.key, value);
  }
}
