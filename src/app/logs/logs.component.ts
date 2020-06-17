import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  logs = [];
  @Output() close = new EventEmitter();

  constructor(public report: ReportService) {
    this.logs = report.getAllLogs();
  }

  ngOnInit(): void {
  }

  closeDrawer() {
    this.close.emit(false);
  }

}
