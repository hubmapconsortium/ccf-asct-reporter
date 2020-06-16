import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { SheetService } from './sheet.service';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('logs_drawer') logs_drawer;


  displayGraph = 'Tree';
  refreshTree = false;
  refreshIndent = false;

  constructor() {}

  ngOnInit() {}

  toggleDrawer(val) {
    this.logs_drawer.opened = val;
  }

  showGraph(val) {
    this.displayGraph = val;
  }

  refreshData(val) {
    if (val== 'Tree') {
      this.refreshTree = true;
    } else if (val == 'Indent') {
      this.refreshIndent = true;
    }
  }

  returnRefresh(val) {
    if (val == 'Tree') {
      this.refreshTree = false;

    } else if (val == 'Indent') {
      this.refreshIndent = false;
    }
  }
 }
