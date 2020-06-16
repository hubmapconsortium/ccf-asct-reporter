import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  logs = [];
  constructor(public report: ReportService) { 
    this.logs = report.getAllLogs();
  }

  ngOnInit(): void {
  }

}
