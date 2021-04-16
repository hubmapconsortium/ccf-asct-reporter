import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SHEET_OPTIONS } from '../../static/config';
import { VIDEO_ACTIONS, CONTIRBUTORS, IMAGES } from '../../static/home';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { GaAction, GaCategory } from '../../models/ga.model';

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


  constructor(private router: Router, public ga: GoogleAnalyticsService) { }

  ngOnInit(): void {


  }

  ngAfterViewInit(): void {
    const actionsDiv = document.getElementById('actionsHeight');
    this.videoRef = (document.getElementById('tutorialVideo') as HTMLVideoElement);
    actionsDiv.style.maxHeight = `${this.videoRef.offsetHeight + 50}px`;
    actionsDiv.style.overflowY = 'auto';
  }

  seekVideo(s: number, id: number) {
    this.videoSectionSelected = id;


    this.videoRef.pause();
    this.videoRef.currentTime = s;
    if (this.videoRef.paused && this.videoRef.readyState === 4 || !this.videoRef.paused) {
      this.videoRef.play();
    }

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
      'https://docs.google.com/spreadsheets/d/1F7D0y7pNPVIR3W4LjjtIMGg7rKTOxwyjVKzS-iiffz4/edit#gid=2034682742',
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
