import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SconfigService } from '../services/sconfig.service';
import { SheetService } from '../services/sheet.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {Location} from '@angular/common';
import {GoogleAnalyticsService} from './../google-analytics.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  window = window;
  options = [
    'Tree',
    'Indented List',
    // 'Table' temporarily hide table
  ];
  selectedOption = this.options[0];
  sheetOptions = [
    {
      title: 'All Organs',
      sheet: 'all'
    },
    {
      title: 'Brain',
      sheet: 'brain'
    },
    {
      title: 'Heart',
      sheet: 'heart'
    },
    {
      title: 'Kidney',
      sheet: 'kidney'
    },
    {
      title: 'Large Intestine',
      sheet: 'large_intestine'
    },
    {
      title: 'Liver',
      sheet: 'liver'
    },
    {
      title: 'Lung',
      sheet: 'lung'
    },
    {
      title: 'Lymph Nodes',
      sheet: 'lymph_nodes'
    },
    {
      title: 'Skin',
      sheet: 'skin'
    },
    {
      title: 'Small Intestine',
      sheet: 'small_intestine'
    },
    {
      title: 'Spleen',
      sheet: 'spleen'
    }
  ];

  selectedSheetOption = this.sheetOptions[0].title;

  moreOptions = [
    {
      name: 'Data Tables',
      url:
        'https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1268820100',
    },
    {
      name: 'Github',
      url: 'https://github.com/hubmapconsortium/ccf-asct-reporter',
    },
  ];

  imageOptions = ['PNG', 'SVG', 'Vega Spec'];

  hamMenuOptions = [
    {
      name: 'Select Organ',
      options: this.sheetOptions,
    },
  ];

  screenWidth = document.getElementsByTagName('body')[0].clientWidth;

  versions = this.sc.VERSIONS;
  selectedVersion = this.versions[0].display;

  @Output() showReport = new EventEmitter<any>();
  @Output() showLog = new EventEmitter<any>();
  @Output() showFunction = new EventEmitter<any>();
  @Output() showGraph = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();
  @Output() getSheet = new EventEmitter<any>();
  @Output() downloadVis = new EventEmitter<any>();
  @Output() dataVersion = new EventEmitter<any>();
  @Output() compare = new EventEmitter<any>();

  constructor(
    public sc: SconfigService,
    public sheet: SheetService,
    public route: ActivatedRoute,
    public location: Location,
    public router: Router,
    public googleAnalyticsService: GoogleAnalyticsService
  ) {
  }

  ngOnInit(): void {
    this.getSelection();

    this.route.queryParams.subscribe((queryparams: Params) => {
      const selectedSheetName = this.sheetOptions.find(i => i.sheet === queryparams.sheet);
      this.getSheetSelection(selectedSheetName.title);
      this.getSelectedVersion(queryparams.dataVersion);
    });

    this.sheet.changeDataVersion.subscribe((dv) => {
      this.selectedVersion = dv.display;
    });
  }

  getSelection(option = this.selectedOption) {

    this.selectedOption = option;
    this.showGraph.emit(option);
    this.googleAnalyticsService.eventEmitter('vis_selector', 'navbar', 'selection', this.selectedOption, 1);
  }

  getSheetSelection(sheet = this.selectedSheetOption) {
    const urlTree = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: {
        sheet: this.sheetOptions.find(i => i.title === sheet).sheet,
        dataVersion: this.versions.find((i) => i.display === this.selectedVersion).folder
      },
      queryParamsHandling: 'merge',
    });

    this.location.go(urlTree.toString());
    this.selectedSheetOption = sheet;
    this.getSheet.emit(sheet);
    this.googleAnalyticsService.eventEmitter('organ_sheet_selector', 'navbar', 'selection', this.selectedSheetOption, 1);
  }

  showLogs() {
    this.showLog.emit(true);
    this.googleAnalyticsService.eventEmitter('organ_sheet_selector', 'navbar',  'click', this.selectedSheetOption, 1);
  }

  showReports() {
    this.showReport.emit(true);
    this.googleAnalyticsService.eventEmitter('debug_log_open', 'navbar', 'selection', 'Open Debug Log', 1);
  }

  onResize(e) {
    this.screenWidth = e.target.innerWidth;
  }

  refreshData() {
    this.dataVersion.emit(
      this.versions.find((i) => i.display === this.selectedVersion).folder
    );
    this.refresh.emit(this.selectedOption);
    this.googleAnalyticsService.eventEmitter('refresh', 'navbar',  'click', 'Refresh', 1);
  }

  downloadVisFunction(img) {
    this.downloadVis.emit(img);
    this.googleAnalyticsService.eventEmitter('export_vis', 'navbar', 'click', img,  1);
  }

  compareDD() {
    this.compare.emit(true);
    this.googleAnalyticsService.eventEmitter('compare_start', 'navbar', 'click', 'Compare',  1);
  }

  openGithub() {

    window.open(
      'https://github.com/hubmapconsortium/ccf-asct-reporter',
      '_blank'
    );
  }

  getSelectedVersion(version = this.versions.find((i) => i.display === this.selectedVersion).folder) {

    this.selectedVersion = this.versions.find((i) => i.folder === version).display;
    const urlTree = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: {
        sheet: this.sheetOptions.find(i => i.title === this.selectedSheetOption).sheet,
        dataVersion: version
      },
      queryParamsHandling: 'merge',
    });
    this.location.go(urlTree.toString());
    this.dataVersion.emit(
      version
    );
    this.refresh.emit(this.selectedOption);
    this.googleAnalyticsService.eventEmitter('data_version_selector', 'navbar', 'selection', this.selectedVersion, 1);
  }

}
