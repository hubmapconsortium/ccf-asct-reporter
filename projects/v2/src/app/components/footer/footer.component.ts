import { Component, OnInit } from '@angular/core';
import { faGithub, faFacebookSquare, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
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

  faGlobe = faGlobe;
  faGithub = faGithub;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faFacebookSquare = faFacebookSquare;
  faTwitterSquare = faTwitterSquare;

  copyrightYear = new Date().getFullYear();

  constructor(private readonly router: Router, public ga: GoogleAnalyticsService) { }

  ngOnInit(): void {
  }

  openDocs() {
    this.router.navigate(['/docs']);
    this.ga.eventEmitter('footer_link_click', GaCategory.FOOTER, 'Open Docs', GaAction.NAV);
  }

  openData() {
    window.open(
      MASTER_SHEET_LINK,
      '_blank'
    );
    this.ga.eventEmitter('footer_link_click', GaCategory.FOOTER, 'Open Master Tables', GaAction.NAV);
  }
}
