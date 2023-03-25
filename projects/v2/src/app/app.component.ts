import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';
import { ConsentService } from './services/consent.service';
import { TrackingPopupComponent } from './components/tracking-popup/tracking-popup.component';

declare let gtag: (arg1?, arg2?, arg3?) => void;

@Component({
  selector: 'app-reporter',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    readonly consentService: ConsentService,
    readonly snackbar: MatSnackBar,
    private matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    public router: Router) {

    switch (environment.tag) {
      case 'Staging': document.title = 'ASCT+B Reporter | Staging'; break;
      case 'Development': document.title = 'ASCT+B Reporter | Development'; break;
      default: document.title = 'ASCT+B Reporter';
    }

    this.matIconRegistry.addSvgIcon(
      'debug',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/debug.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'report',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/report.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'indentedList',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/indent.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'compare',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/compare.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'playground',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/playground.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'upload_file',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/upload.svg')
    );

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', environment.googleAnalyticsId,
          {
            page_path: event.urlAfterRedirects
          }
        );
      }
    });
  }

  ngOnInit(): void {
    const snackBar = this.snackbar.openFromComponent(TrackingPopupComponent, {
      data: {
        preClose: () => {
          snackBar.dismiss();
        }
      },
      duration: this.consentService.consent === 'not-set' ? Infinity : 3000
    });
  }
}
