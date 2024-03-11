import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { ConsentService } from './services/consent.service';

import { Shallow } from 'shallow-render';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ENVIRONMENT_INITIALIZER } from '@angular/core';

describe('AppComponent', () => {
  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    const mockConsentService = jasmine.createSpyObj<ConsentService>([
      'setConsent',
    ]);
    shallow = new Shallow(AppComponent, AppModule)
      .replaceModule(BrowserAnimationsModule, NoopAnimationsModule)
      .replaceModule(RouterModule, RouterTestingModule.withRoutes([]))
      .dontMock(ENVIRONMENT_INITIALIZER)
      .mock(ConsentService, {
        ...mockConsentService,
        consent: 'not-set',
      })
      .mock(MatSnackBar, {
        openFromComponent: (): MatSnackBarRef<unknown> =>
          ({} as unknown as MatSnackBarRef<unknown>),
      });
  });

  it('should create', async () => {
    const { instance } = await shallow.render();
    expect(instance).toBeDefined();
  });
});
