import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocsService } from '../../services/docs.service';
import { REGISTRY } from '../../static/docs';
import { faPhone, faEnvelope, faChevronRight } from "@fortawesome/free-solid-svg-icons";

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

  constructor(private router: Router, public activatedRoute: ActivatedRoute, public docsService: DocsService) { }

  ngOnInit(): void { 
    this.activatedRoute.queryParams.subscribe(params => {
      if(params.id) {
        this.selected = parseInt(params.id);
        this.docsService.getData(parseInt(params.id));
      } else {
        this.selected = 0;
        this.docsService.getData(0);
      }
    });

    this.docsService.docsData.subscribe(data => {
     if(data) {
       this.docsData = data;
     }
    });
  }

  onChange(idx: number) {
    this.selected = idx;
    this.router.navigate(
      [], 
      {
        relativeTo: this.activatedRoute,
        queryParams: {id: idx}, 
        queryParamsHandling: 'merge',
      });
  }

  onLatest() {
    this.router.navigate(['/'])
  }

  openGithub() {
    window.open(
      'https://github.com/hubmapconsortium/ccf-asct-reporter',
      '_blank'
    );
  }

  openDocs() {
    window.open(
      'https://drive.google.com/file/d/1r8Br4t6zftyrRXbb-DnidzwS3t8FSCu4/view?usp=sharing',
      '_blank'
    );
  }

  openData() {
    window.open(
      'https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1199090884',
      '_blank'
    );
  }
}
