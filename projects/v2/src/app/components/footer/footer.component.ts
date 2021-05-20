import { Component, OnInit } from '@angular/core';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { Router } from '@angular/router';
import { GaAction, GaCategory } from '../../models/ga.model';
import { MASTER_SHEET_LINK } from '../../static/config';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  faLinkedin = faLinkedin;
  faGlobe = faGlobe;
  faGithub = faGithub;
  faPhone = faPhone;
  faEnvelope = faEnvelope;

  copyrightYear = new Date().getFullYear();

  constructor(private router: Router, public ga: GoogleAnalyticsService) { }

  ngOnInit(): void {
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
}
