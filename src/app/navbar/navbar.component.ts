import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SconfigService } from '../services/sconfig.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  window = window;
  options = [
    'Tree',
    'Indented List',
    // 'Table' temporarily hide table
  ];
  selectedOption = this.options[0];

  sheetOptions = ['All Organs', 'Brain', 'Heart', 'Kidney', 'Large Intestine', 'Liver', 'Lung', 'Lymph Nodes', 'Skin', 'Small Intestine', 'Spleen'];

  moreOptions = [
    {
      name: 'Data Tables',
      url: 'https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1268820100'
    },
    {
      name: 'Github',
      url: 'https://github.com/hubmapconsortium/ccf-asct-reporter'
    }
  ];

  imageOptions = [
    'PNG',
    'SVG',
    'Vega Spec'
  ];

  hamMenuOptions = [
    {
      name: 'Select Organ',
      options: this.sheetOptions
    }
  ];

  selectedSheetOption = this.sheetOptions[0];

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

  constructor(public sc: SconfigService) {
  }

  ngOnInit(): void {
    this.getSheetSelection();
    this.getSelection();
    this.getSelectedVersion();
  }

  getSelection(option= this.selectedOption) {
    this.selectedOption = option;
    this.showGraph.emit(option);
  }

  getSheetSelection(sheet= this.selectedSheetOption) {
    this.selectedSheetOption = sheet;
    this.getSheet.emit(sheet);
  }

  showLogs() {
    this.showLog.emit(true);
  }

  showReports() {
    this.showReport.emit(true);
  }

  onResize(e) {
    this.screenWidth = e.target.innerWidth;
  }

  refreshData() {
    this.refresh.emit(this.selectedOption);
  }

  downloadVisFunction(img) {
    this.downloadVis.emit(img);
  }

  openGithub() {
    window.open('https://github.com/hubmapconsortium/ccf-asct-reporter', '_blank');
  }

  getSelectedVersion() {
    this.dataVersion.emit(this.versions.find(i=>i.display === this.selectedVersion).folder);
    this.refresh.emit(this.selectedOption);
  }

}
