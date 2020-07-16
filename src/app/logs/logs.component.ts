import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { SheetService } from '../services/sheet.service';
import { ReportService } from '../report/report.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  @Output() closeComponent = new EventEmitter();
  @Input() refreshData;

  logs = [];
  sheetLogs = [];

  constructor(public sheet: SheetService, public report: ReportService) {
    }

  async ngOnInit() {
    let logData = await this.report.getAllLogs();
    this.logs = logData.allLogs;
    this.sheetLogs = logData.sheetLogs;
  }

  closeDrawer() {
    this.closeComponent.emit(false);
  }

}
