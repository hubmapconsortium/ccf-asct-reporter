import { Injectable } from '@angular/core';
import * as moment from 'moment';

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

  reportLog(message, icon, type) {
    const time = new Date();
    if (!this.reportedLogs.some(i => i.message == message && i.time == moment(time).format('hh:mm:ss'))) {
      this.reportedLogs.push(new Log(message, this.icons[icon], moment(time).format('hh:mm:ss'), type));
    }
  }

  getAllLogs() {
    return this.reportedLogs;
  }

  createReport(anatomicalStructures, cellTypes) {
    this.report = {
      anatomicalStructures,
      cellTypes
    };
  }

  getAllReport() {
    return this.report;
  }

}
