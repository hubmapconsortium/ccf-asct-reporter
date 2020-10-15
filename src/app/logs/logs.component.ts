import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { SheetService } from '../services/sheet.service';
import { ReportService } from '../report/report.service';
import {GoogleAnalyticsService} from '../google-analytics.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  @Output() closeComponent = new EventEmitter();
  @Input() refreshData: any;
  @Input() currentSheet: any;

  logs = [];
  sheetLogs = [];

  constructor(public sheet: SheetService, public report: ReportService, public googleAnalyticsService: GoogleAnalyticsService) {
    }

  async ngOnInit() {
    const logData = await this.report.getAllLogs();
    this.logs = logData.allLogs;
    this.sheetLogs = logData.sheetLogs;
  }

  closeDrawer() {
    this.closeComponent.emit(false);
    this.googleAnalyticsService.eventEmitter('debug_log_close', 'debug_log', 'click', 'Close' , 1);
  }

  mail() {
    const subject = `Problem with ${this.currentSheet.name}.xlsx`;
    const mailText = `mailto:infoccf@indiana.edu?subject=${subject}`;
    window.location.href = mailText;
  }

}
