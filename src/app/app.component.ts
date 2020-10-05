import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../environments/environment';
import{Router, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
declare let gtag: Function;
export class AppComponent implements OnInit {

  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
          gtag('config', 'xx-xxxxx-xx', 
                {
                  'page_path': event.urlAfterRedirects
                }
               );
       }
    }
 )}

  ngOnInit() {
    console.log('%cWelcome to the ASCT+B Reporter!', 'font-weight: bold; font-size: 14pt;');
    if (!environment.production) {
      console.log(
        '%cIn Development Mode\n\n%cData will be fetched from local assets file.\n\nPlease use %cnpm run data %cto update the data.',
        'font-size: 12pt; color: red;',
        'font-size: 11pt; color: yellow',
        'font-size: 11pt; color: orange',
        'font-size: 11pt; color: yellow');
    }

  }
}
