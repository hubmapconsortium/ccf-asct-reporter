import { Component, OnInit } from '@angular/core';
import { SheetService } from './sheet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  sheetData;

  constructor(public sheet: SheetService) {
    
  }

  ngOnInit() {
    
  }
}
