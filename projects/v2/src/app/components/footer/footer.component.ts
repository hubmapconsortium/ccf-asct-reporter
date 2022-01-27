import { Component, OnInit } from '@angular/core';
import { faGithub, faFacebookSquare, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Router } from '@angular/router';
import { GaAction, GaCategory } from '../../models/ga.model';
import { ConfigService } from '../../app-config.service';

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
  masterSheetLink;

  constructor(public configService: ConfigService, private readonly router: Router, public ga: GoogleAnalyticsService) { 
    this.configService.config$.subscribe(config=>{
      this.masterSheetLink = config.masterSheetLink;
    });
  }

  ngOnInit(): void {
  }

  openDocs() {
    this.router.navigate(['/docs']);
    this.ga.event(GaAction.NAV, GaCategory.FOOTER, 'Open Docs');
  }

  openFaq() {
    this.router.navigate(['/docs/faq']);
    this.ga.event(GaAction.NAV, GaCategory.FOOTER, 'Open FAQ');
  }

  openData() {
    window.open(
      this.masterSheetLink,
      '_blank'
    );
    this.ga.event(GaAction.NAV, GaCategory.FOOTER, 'Open Master Tables');
  }
}
