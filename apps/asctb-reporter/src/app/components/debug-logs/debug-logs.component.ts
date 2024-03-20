import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sheet } from '../../models/sheet.model';
import { Logs } from '../../models/ui.model';

@Component({
  selector: 'app-debug-logs',
  templateUrl: './debug-logs.component.html',
  styleUrls: ['./debug-logs.component.scss'],
})
export class DebugLogsComponent {
  @Input() currentSheet!: Sheet;
  @Input() logs!: Logs;
  @Output() closeDebug = new EventEmitter<void>();
}
