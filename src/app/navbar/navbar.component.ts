import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  options = [
    {
      value: 'tree', display: 'Tree',
    },
    {
      value: 'indent', display: 'Indent'
    }
  ]

  selectedOption = this.options[0]
  @Output() showLog = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  getSelection() {
    console.log(this.selectedOption)
  }

  showLogs() {
    this.showLog.emit(true)
  }

}
