import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  options = [
    'Tree',
    'Indent'
  ]
  selectedOption = this.options[0];

  @Output() showLog = new EventEmitter<any>();
  @Output() showGraph = new EventEmitter<any>();

  constructor() { 
    this.getSelection();
  }

  ngOnInit(): void {
  }

  getSelection() {
    console.log(this.selectedOption)
    this.showGraph.emit(this.selectedOption)
  }

  showLogs() {
    this.showLog.emit(true)
  }

}
