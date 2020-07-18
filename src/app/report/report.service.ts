import { Injectable } from '@angular/core';
import * as moment from 'moment';

export class Log {
  message: string;
  icon: string;
  time: string;
  type: string;
  multi: Array<string>;

  constructor(message, icon, time, type) {
    this.message = message;
    this.icon = icon;
    this.time = time;
    this.type = type;
    this.multi = [];
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
  reportedLogsForSheet = [];
  constructor() { }

  async reportLog(message, icon, type, multiMessage = '') {
    if (type === 'file') {
      this.reportedLogsForSheet = []
    }

    const time = new Date();
    if (!this.reportedLogs.some(i => i.message === message && i.time === moment(time).format('hh:mm:ss')) && type !== 'multi') {
      this.reportedLogsForSheet.push(new Log(message, this.icons[icon], moment(time).format('hh:mm:ss'), type));
    }
    if (type === 'multi') {
      let foundSheetLog = this.reportedLogsForSheet.findIndex(i => i.message === message);
      if (foundSheetLog !== -1) {
        if (this.reportedLogsForSheet[foundSheetLog].multi.findIndex(r => r === multiMessage) == -1)
          this.reportedLogsForSheet[foundSheetLog].multi.push(multiMessage)
      } else {
        
        let nl = new Log(message, this.icons[icon], moment(time).format('hh:mm:ss'), type);
        nl.multi.push(multiMessage);
        this.reportedLogsForSheet.push(nl);
      }
    }
  }

  getAllLogs() {
    this.reportedLogs.push(...this.reportedLogsForSheet)
    return {
      allLogs: this.reportedLogs,
      sheetLogs: this.reportedLogsForSheet
    }
  }

  createReport(anatomicalStructures, cellTypes) {
    this.report = {
      anatomicalStructures,
      cellTypes
    };
  }

  checkLinks(data) {
    data.forEach(node => {
      if (node.targets.length === 0 && node.group === 2) {
        this.reportLog(`Nodes with no out-links`, 'warning', 'multi', node.name);
      }

      if (node.sources.length === 0 && node.group === 2) {
        this.reportLog(`Nodes with no in-links`, 'warning', 'multi', node.name);
      }

      if (node.sources.length === 0 && node.group === 3) {
        this.reportLog(`Nodes with no in-links`, 'warning', 'multi', node.name);
      }
    });
  }

  getAllReport() {
    return this.report;
  }

}
