import { Component, OnInit, ViewChild } from '@angular/core';
import { SheetService } from './sheet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('logs_drawer') logs_drawer;

  displayGraph = 'Tree';

  constructor() {
    
  }

  ngOnInit() {
    
  }

  toggleDrawer(val) {
    this.logs_drawer.opened = val;
  }

  showGraph(val) {
    this.displayGraph = val;
  }
}
