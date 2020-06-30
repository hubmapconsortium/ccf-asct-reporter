import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  options = [
    'Tree',
    'Indented List',
    // 'Table' temporarily hide table
  ];
  selectedOption = this.options[0];

  sheetOptions = [
    'Spleen',
    'Kidney',
    'Liver',
    'Lymph Nodes',
    'Heart',
    'Small Intestine',
    'Large Intestine',
    'Skin'
  ]

  selectedSheetOption = this.sheetOptions[0]

  @Output() showReport = new EventEmitter<any>();
  @Output() showLog = new EventEmitter<any>();
  @Output() showGraph = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();
  @Output() getSheet = new EventEmitter<any>();

  constructor() {
    this.getSheetSelection();
    this.getSelection();
    
  }

  ngOnInit(): void {
  }

  getSelection() {
    this.showGraph.emit(this.selectedOption);
  }

  getSheetSelection() {
    this.getSheet.emit(this.selectedSheetOption)
  }

  showLogs() {
    this.showLog.emit(true);
  }

  showReports() {
    this.showReport.emit(true);
  }

  refreshData() {
    this.refresh.emit(this.selectedOption);
  }

  openGithub() {
    window.open('https://github.com/hubmapconsortium/ccf-asct-reporter', '_blank');
  }

}
