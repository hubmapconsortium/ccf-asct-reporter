import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocsService } from '../../services/docs.service';
import { REGISTRY } from '../../static/docs';
import { faPhone, faEnvelope, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { GaAction, GaCategory } from '../../models/ga.model';

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

  constructor(private router: Router, public activatedRoute: ActivatedRoute, public docsService: DocsService, public ga: GoogleAnalyticsService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.selected = parseInt(params.id, 10);
        this.docsService.getData(parseInt(params.id, 10));
      } else {
        this.selected = 0;
        this.docsService.getData(0);
      }
    });

    this.docsService.docsData.subscribe(data => {
     if (data) {
       this.docsData = data;
     }
    });

  }

  onChange(idx: number) {
    this.selected = idx;
    this.router.navigate(
      ['/docs'],
      {
        relativeTo: this.activatedRoute,
        queryParams: {id: idx},
        queryParamsHandling: 'merge',
      });
      // Router navigation already fires Google Analytics events, see app.component.ts
  }

  onLatest() {
    this.router.navigate(['/']);
    this.ga.eventEmitter('docs_link_click', GaCategory.DOCS, 'Back to Latest Release', GaAction.NAV);
  }

  openGithub() {
    window.open(
      'https://github.com/hubmapconsortium/ccf-asct-reporter',
      '_blank'
    );
    this.ga.eventEmitter('docs_link_click', GaCategory.DOCS, 'Open Github', GaAction.NAV);
  }

  openDocs() {
    this.router.navigate(['/docs']);
  }

  openData() {
    window.open(
      'https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1199090884',
      '_blank'
    );
    this.ga.eventEmitter('docs_link_click', GaCategory.DOCS, 'Open Data Tables', GaAction.NAV);
  }

  openDataOld() {
    window.open(
      'https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1268820100',
      '_blank'
    );
    this.ga.eventEmitter('docs_link_click', GaCategory.DOCS, 'Open Old Data Tables', GaAction.NAV);
  }
}
