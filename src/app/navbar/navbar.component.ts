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
    'Spleen_R2_EMQverify.csv',
    'Kidney_updated_R1_EMQverify6_21_2020.csv',
    'Liver-R1_EMQverify.csv',
    'LymphNodes-R1_EMQverify.csv',
    'Heart-R1_EMQverify.csv',
    'Small intestine-R1_EMQverify06212020.csv',
    'Large Intestine_R1_EMQVerify06212020.csv'
  ]

  selectedSheetOption = this.sheetOptions[0]

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

  refreshData() {
    this.refresh.emit(this.selectedOption);
  }

  openGithub() {
    window.open('https://github.com/hubmapconsortium/ccf-asct-reporter', '_blank');
  }

}
