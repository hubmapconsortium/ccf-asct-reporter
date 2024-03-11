import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocsService } from '../../services/docs.service';
import { REGISTRY } from '../../static/docs';
import {
  faPhone,
  faEnvelope,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { GaAction, GaCategory } from '../../models/ga.model';
import { ConfigService } from '../../app-config.service';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss'],
})
export class DocsComponent implements OnInit {
  window = window;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faChevronRight = faChevronRight;
  showHeader = true;
  docsData: string;
  REGISTRY = REGISTRY;
  selected: number;
  copyrightYear = new Date().getFullYear();
  masterSheetLink;

  constructor(
    public configService: ConfigService,
    private readonly router: Router,
    public activatedRoute: ActivatedRoute,
    public docsService: DocsService,
    public ga: GoogleAnalyticsService
  ) {
    this.configService.config$.subscribe((config) => {
      this.masterSheetLink = config.masterSheetLink;
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (this.docsService.getID(params.id) >= 0) {
        this.selected = this.docsService.getID(params.id);
        this.docsService.getData(params.id);
      } else {
        this.router.navigate(['/docs', 'introduction']);
      }
    });

    this.docsService.docsData.subscribe((data) => {
      if (data) {
        this.docsData = data;
      }
    });
  }

  onChange(idx: number) {
    this.selected = idx;
    const title = this.docsService.getTitle(idx);
    this.router.navigate(['/docs', title]);
    // Router navigation already fires Google Analytics events, see app.component.ts
  }

  onLatest() {
    this.router.navigate(['/']);
    this.ga.event(GaAction.NAV, GaCategory.DOCS, 'Back to Latest Release');
  }

  openGithub() {
    window.open(
      'https://github.com/hubmapconsortium/ccf-asct-reporter',
      '_blank'
    );
    this.ga.event(GaAction.NAV, GaCategory.DOCS, 'Open Github');
  }

  openData() {
    window.open(this.masterSheetLink, '_blank');
    this.ga.event(GaAction.NAV, GaCategory.DOCS, 'Open Data Tables');
  }

  openDataOld() {
    window.open(
      'https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1268820100',
      '_blank'
    );
    this.ga.event(GaAction.NAV, GaCategory.DOCS, 'Open Old Data Tables');
  }
}
