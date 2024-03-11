import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export type Consent = 'not-set' | 'given' | 'rescinded';

@Injectable()
export class ConsentService implements OnDestroy {
  consent: Consent = 'not-set';

  readonly consentChange = new ReplaySubject<Consent>(1);

  constructor() {
    this.consentChange.next(this.consent);
  }

  ngOnDestroy(): void {
    this.consentChange.complete();
  }

  setConsent(value: Consent): void {
    if (this.consent !== value) {
      this.consent = value;
      this.consentChange.next(value);
    }
  }

  unsetConsent(): void {
    this.setConsent('not-set');
  }
}
