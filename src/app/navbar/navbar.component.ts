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
    'Spleen_R2_EMQverify.xlsx',
    'KidneyR1EMQverify.xlsx',
    'Liver-R1_EMQverify.xlsx',
    'LymphNodes-R1_EMQverify.xlsx',
    'Heart-R1_EMQverify.xlsx',
    'Small intestine-R1_EMQverify06212020.xlsx',
    'Large Intestine_R1_EMQVerify06212020.xlsx'
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
    console.log(this.selectedSheetOption)
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
