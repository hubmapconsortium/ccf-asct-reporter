import { Component, OnInit } from '@angular/core';
import { SconfigService } from '../services/sconfig.service';
import { environment } from '../../environments/environment';
import {GoogleAnalyticsService} from './../google-analytics.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  window = window;
  screenWidth = document.getElementsByTagName('body')[0].clientWidth;
  dataVersion: string;
  GoogleAnalyticsService: any;

  constructor(public sc: SconfigService) {
    if (environment.production) {
      this.dataVersion = 'latest';
    } else {
      this.dataVersion = this.sc.VERSIONS[1].folder;
    }
  }

  ngOnInit(): void {}

  openGithub() {
    debugger;
    
    this.GoogleAnalyticsService.eventEmitter("link_click", "home", "Icon", "click", 1);
    window.open(
      'https://github.com/hubmapconsortium/ccf-asct-reporter',
      '_blank'
    );
  }

  openDocs() {
    this.GoogleAnalyticsService.eventEmitter("link_click", "home", "Documentation", "click", 1);
    window.open(
      'https://drive.google.com/file/d/1r8Br4t6zftyrRXbb-DnidzwS3t8FSCu4/view?usp=sharing',
      '_blank'
    );
  }

  openData() {
    this.GoogleAnalyticsService.eventEmitter("link_click", "home", "Tables", "click", 1);
    window.open(
      'https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1199090884',
      '_blank'
    );
  }

  onResize(e) {
    this.screenWidth = e.target.innerWidth;
  }
}
