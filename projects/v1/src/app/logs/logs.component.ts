import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { SheetService } from '../services/sheet.service';
import { ReportService } from '../report/report.service';
import {GaService} from '../services/ga.service';

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

  constructor(public sheet: SheetService, public report: ReportService, public ga: GaService) {
    }

  async ngOnInit() {
    const logData = await this.report.getAllLogs();
    this.logs = logData.allLogs;
    this.sheetLogs = logData.sheetLogs;
  }

  closeDrawer() {
    this.closeComponent.emit(false);
    this.ga.eventEmitter('debug_log',  'click',  'Close' , 1);
  }

  mail() {
    const subject = `Problem with ${this.currentSheet.name}.xlsx`;
    const mailText = `mailto:infoccf@indiana.edu?subject=${subject}`;
    window.location.href = mailText;
  }

  gaIconInfo(){
    this.ga.eventEmitter('debug_log',  'click',  'Info' , 1);
  }

  tabSelection(event){
    this.ga.eventEmitter('debug_log',  'click',  event.tab.textLabel , 1);
  }

  panelClick(event){
    this.ga.eventEmitter('debug_log',  'click',  event.target.innerText , 1);
  }
}
