import { Component, OnInit, Input } from '@angular/core';
import { Sheet } from '../../models/sheet.model';

@Component({
  selector: 'app-debug-logs',
  templateUrl: './debug-logs.component.html',
  styleUrls: ['./debug-logs.component.scss']
})
export class DebugLogsComponent implements OnInit {
  
  @Input() currentSheet: Sheet;
  @Input() logs: any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.logs)
  }

}
