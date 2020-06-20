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
    'Table'
  ];
  selectedOption = this.options[0];

  @Output() showLog = new EventEmitter<any>();
  @Output() showGraph = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();

  constructor() {
    this.getSelection();
  }

  ngOnInit(): void {
  }

  getSelection() {
    this.showGraph.emit(this.selectedOption);
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
