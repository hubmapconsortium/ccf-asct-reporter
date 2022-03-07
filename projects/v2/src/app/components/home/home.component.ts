import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { VIDEO_ACTIONS, CONTIRBUTORS, IMAGES } from '../../static/home';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { GaAction, GaCategory } from '../../models/ga.model';
import { YouTubePlayer } from '@angular/youtube-player';
import { ConfigService } from '../../app-config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  window = window;
  dataVersion = 'latest';
  VIDEO_ACTIONS = VIDEO_ACTIONS;
  CONTIRBUTORS = CONTIRBUTORS;
  IMAGES = IMAGES;
  videoSectionSelected = 0;
  videoRef: HTMLVideoElement;

  faLinkedin = faLinkedin;
  faGlobe = faGlobe;
  faGithub = faGithub;
  faPhone = faPhone;
  faEnvelope = faEnvelope;

  copyrightYear = new Date().getFullYear();
  masterSheetLink;
  sheetOptions;

  @ViewChild('tutorialVideo') player: YouTubePlayer;

  constructor(public configService: ConfigService, private readonly router: Router, public ga: GoogleAnalyticsService) { 
    
    this.configService.config$.subscribe(config=>{
      this.masterSheetLink = config.masterSheetLink;
    });

    this.configService.sheetConfiguration$.subscribe(data=>{
      const filteredData = data.map((element) => {
        return {...element, version: element.version?.filter((version) => !version.viewValue.includes('DRAFT'))};
      });
      this.sheetOptions = filteredData.filter(organ => organ.version !== undefined);
      this.sheetOptions = this.sheetOptions.filter(organ => organ.version.length !== 0);
    });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    const actionsDiv = document.getElementById('actionsHeight');
    actionsDiv.style.maxHeight = `${this.player.height + 50}px`;
    actionsDiv.style.overflowY = 'auto';
  }

  seekVideo(seconds: number, id: number) {
    this.videoSectionSelected = id;

    this.player.pauseVideo();
    this.player.seekTo(seconds, true);
    this.player.playVideo();

    this.ga.event(GaAction.CLICK, GaCategory.HOME, `Jump to video section: ${VIDEO_ACTIONS[id].header}`);
  }

  openGithub() {
    window.open(
      'https://github.com/hubmapconsortium/ccf-asct-reporter',
      '_blank'
    );
    this.ga.event(GaAction.NAV, GaCategory.HOME, 'Open Github');
  }


  openDocs() {
    this.router.navigate(['/docs']);
    this.ga.event(GaAction.NAV, GaCategory.HOME, 'Open Docs');
  }

  openData() {
    window.open(
      this.masterSheetLink,
      '_blank'
    );
    this.ga.event(GaAction.NAV, GaCategory.HOME, 'Open Master Tables');
  }

  openDataOld() {
    window.open(
      'https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1268820100',
      '_blank'
    );
    this.ga.event(GaAction.NAV, GaCategory.HOME, 'Open Old Data Tables');
  }

  onResize(e) {
    console.log(e);
  }
}
