import { Injectable } from '@angular/core';
import * as moment from 'moment';

export class Log {
  message: string;
  icon: string;
  time: string;

  constructor(message, icon, time) {
    this.message = message;
    this.icon = icon;
    this.time = time;
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
  constructor() { }

  reportLog(message, icon) {
    const time = new Date();
    this.reportedLogs.push(new Log(message, this.icons[icon], moment(time).format('hh:mm A')));
  }

  getAllLogs() {
    return this.reportedLogs;
  }
}
