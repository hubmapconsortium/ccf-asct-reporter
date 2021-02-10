import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
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
  }
}
