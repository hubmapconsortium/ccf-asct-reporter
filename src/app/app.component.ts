import { Component, OnInit, ViewChild } from '@angular/core';
import { SheetService } from './sheet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('logs_drawer') logs_drawer;

  constructor() {
    
  }

  ngOnInit() {
    
  }

  toggleDrawer(val) {
    this.logs_drawer.opened = val;
  }
}
