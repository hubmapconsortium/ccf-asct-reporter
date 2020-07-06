import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { SheetService } from '../services/sheet.service';
import { ReportService } from '../report/report.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Input() refreshData;

  logs = [];

  constructor(public sheet: SheetService, public report: ReportService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.logs = this.report.getAllLogs();
    }, 100);
  }

  closeDrawer() {
    this.close.emit(false);
  }

}
