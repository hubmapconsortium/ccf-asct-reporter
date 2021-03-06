import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SHEET_OPTIONS, MASTER_SHEET_LINK } from '../../static/config';
import { VIDEO_ACTIONS, CONTIRBUTORS, IMAGES } from '../../static/home';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { GaAction, GaCategory } from '../../models/ga.model';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  window = window;
  dataVersion = 'latest';
  SHEET_OPTIONS = SHEET_OPTIONS;
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

  @ViewChild('tutorialVideo') player: YouTubePlayer;

  constructor(private router: Router, public ga: GoogleAnalyticsService) { }

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

    this.ga.eventEmitter('home_video_section', GaCategory.HOME, 'Jump to video section', GaAction.CLICK, VIDEO_ACTIONS[id].header);
  }

  openGithub(event?: Event) {
    window.open(
      'https://github.com/hubmapconsortium/ccf-asct-reporter',
      '_blank'
    );
    this.ga.eventEmitter('home_link_click', GaCategory.HOME, 'Open Github', GaAction.NAV);
    }


  openDocs() {
    this.router.navigate(['/docs']);
    this.ga.eventEmitter('home_link_click', GaCategory.HOME, 'Open Docs', GaAction.NAV);
  }

  openData() {
    window.open(
      MASTER_SHEET_LINK,
      '_blank'
    );
    this.ga.eventEmitter('home_link_click', GaCategory.HOME, 'Open Master Tables', GaAction.NAV);
  }

  openDataOld() {
    window.open(
      'https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1268820100',
      '_blank'
    );
    this.ga.eventEmitter('home_link_click', GaCategory.HOME, 'Open Old Data Tables', GaAction.NAV);
  }

  onResize(e) {
    console.log(e);
  }
}
