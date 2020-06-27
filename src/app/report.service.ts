import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { SheetService } from './sheet.service';

export class Log {
  message: string;
  icon: string;
  time: string;
  type: string;

  constructor(message, icon, time, type) {
    this.message = message;
    this.icon = icon;
    this.time = time;
    this.type = type;
  }
}


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  icons = {
    error: 'cancel',
    warning: 'error',
    success: 'check_circle'
  };
  reportedLogs = [];
  report = {};
  constructor() { }

  reportLog(sheetName, message, icon, type) {
    let time = new Date();
    console.log(moment(time).format('hh:mm:ss'))
    if(!this.reportedLogs.some(i => i.message == message && moment(i.time).format('hh:mm:ss') == moment(i.time).format('hh:mm:ss')))
      this.reportedLogs.push(new Log(message, this.icons[icon], moment(time).format('hh:mm A'), type))
  }

  getAllLogs() {
    return this.reportedLogs;
  }

  createReport(anatomicalStructures, cellTypes) {
    this.report = {
      anatomicalStructures: anatomicalStructures,
      cellTypes: cellTypes
    }
  }

  getAllReport() {
    return this.report;
  }
}
