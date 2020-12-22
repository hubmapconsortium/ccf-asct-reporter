import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Sheet } from '../../models/sheet.model';

@Component({
  selector: 'app-debug-logs',
  templateUrl: './debug-logs.component.html',
  styleUrls: ['./debug-logs.component.scss']
})
export class DebugLogsComponent implements OnInit {
  
  @Input() currentSheet: Sheet;
  @Input() logs: any;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void { }

}
