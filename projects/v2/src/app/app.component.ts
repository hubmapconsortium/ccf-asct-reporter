import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {Router, NavigationEnd} from '@angular/router';

declare let gtag: (arg1?, arg2?, arg3?) => void;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public router: Router) {
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
          gtag('config', 'G-H8FJL64BT1',
            {
              'page_path': event.urlAfterRedirects
            }
          );
        }
      })
    };
}
