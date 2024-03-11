import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Sheet } from '../../models/sheet.model';
import { Logs } from '../../models/ui.model';

@Component({
  selector: 'app-debug-logs',
  templateUrl: './debug-logs.component.html',
  styleUrls: ['./debug-logs.component.scss'],
})
export class DebugLogsComponent implements OnInit {
  @Input() currentSheet: Sheet;
  @Input() logs: Logs;
  @Output() closeDebug: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}
}
