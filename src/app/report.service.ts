import { Injectable } from '@angular/core';

export class Log {
  message: string;
  icon: string

  constructor(message, icon) {
    this.message = message
    this.icon = icon
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
  }
  reportedLogs = [];
  constructor() { }

  reportLog(message, icon) {
    this.reportedLogs.push(new Log(message, this.icons[icon]))
  }

  getAllLogs() {
    return this.reportedLogs;
  }
}
