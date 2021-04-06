import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';

declare let gtag: (arg1?, arg2?, arg3?) => void;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    public router: Router) {

      switch (environment.tag) {
        case 'Staging': document.title = 'CCF Reporter | Staging'; break;
        case 'Development': document.title = 'CCF Reporter | Development'; break;
        default: document.title = 'CCF Reporter';
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
}
