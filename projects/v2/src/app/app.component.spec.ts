import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { ConsentService } from './services/consent.service';

import { Shallow } from 'shallow-render';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    const mockConsentService = jasmine.createSpyObj<ConsentService>(['setConsent']);
    shallow = new Shallow(AppComponent, AppModule)
      .mock(ConsentService, {
        ...mockConsentService,
        consent: 'not-set'
      })
      .mock(MatSnackBar, {
        openFromComponent: (): MatSnackBarRef<unknown> => ({} as unknown as MatSnackBarRef<unknown>);
      })
  });

  it('should create', async () => {
    const { instance } = await shallow.render();
    expect(instance).toBeDefined();
  });
});