import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { SconfigService } from '../services/sconfig.service';
import { environment } from '../../../environments/environment';
import { SHEET_OPTIONS } from '../../static/config';
// import {GaService} from '../services/ga.service';
import { VIDEO_ACTIONS, CONTIRBUTORS } from '../../static/home';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';


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
  videoSectionSelected = 0;
  videoRef: HTMLVideoElement;

  faLinkedin = faLinkedin;
  faGlobe = faGlobe;
  faGithub = faGithub;
  faPhone = faPhone;
  faEnvelope = faEnvelope;

  copyrightYear = new Date().getFullYear();

  constructor(private router: Router) {
  }

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

  }

  openGithub(event?: Event) {
    window.open(
      'https://github.com/hubmapconsortium/ccf-asct-reporter',
      '_blank'
    );
      // if (event){
      //   this.ga.eventEmitter( 'home', 'click', 'Icon', 1);
      // }else{
      //   this.ga.eventEmitter( 'home', 'click', 'GitHub', 1);
      // }
    }


  openDocs() {
    this.router.navigate(['/docs'])
  }

  openData() {
    window.open(
      'https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1199090884',
      '_blank'
    );
    // this.ga.eventEmitter(  'home', 'click', 'Tables', 1);
  }

  onResize(e) {
    console.log(e);
  }
}
