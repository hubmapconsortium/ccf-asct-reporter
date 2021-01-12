
import { State, Action, StateContext, Selector } from '@ngxs/store';

import { Injectable } from '@angular/core';
import { ReportLog, ClearSheetLogs } from '../actions/logs.actions';
import { Log, LogEntry } from '../models/logs.model';

export class LogsStateModel {
  id: number;
  sheetLogs: Log;
  allLogs: Log[];
}

@State<LogsStateModel>({
  name: 'logsState',
  defaults: {
    id: 0,
    sheetLogs: {id: 0, messages: [], NO_IN_LINKS: [], NO_OUT_LINKS: [], MULTI_IN_LINKS: [], SELF_LINKS: []},
    allLogs: [{id: 0, messages: [], NO_IN_LINKS: [], NO_OUT_LINKS: [], MULTI_IN_LINKS: [], SELF_LINKS: []}]
  }
})
@Injectable()
export class LogsState {

  constructor() {
  }

  @Selector()
  static getLogs(state: LogsStateModel) {
    return {
      sheetLogs: state.sheetLogs,
      allLogs: state.allLogs
    };
  }


  @Action(ReportLog)
  reportLog({getState, setState}: StateContext<LogsStateModel>, {type, message, icon, version}: ReportLog) {
    const state = getState();
    const allLogs = state.allLogs;
    const sheetLogs = state.sheetLogs;
    const id = state.id;

    switch (type) {
      case 'MSG':
        const newLog: LogEntry = { text: message, icon, version };
        sheetLogs.messages.push(newLog);

        const foundLog = allLogs.find(l => l.id === id);
        foundLog.messages.push(newLog);
        break;

      case 'NO_OUT_LINKS':
        sheetLogs.NO_OUT_LINKS.push(message);
        const foundNOLLog = allLogs.find(l => l.id === id);
        foundNOLLog.NO_OUT_LINKS.push(message);
        break;

      case 'NO_IN_LINKS':
        sheetLogs.NO_IN_LINKS.push(message);
        const foundNILLog = allLogs.find(l => l.id === id);
        foundNILLog.NO_IN_LINKS.push(message);
        break;

      case 'MULTI_IN_LINKS':
        sheetLogs.MULTI_IN_LINKS.push(message);
        const foundMILLLog = allLogs.find(l => l.id === id);
        foundMILLLog.MULTI_IN_LINKS.push(message);
        break;

      case 'SELF_LINKS':
        sheetLogs.SELF_LINKS.push(message);
        const foundSLLog = allLogs.find(l => l.id === id);
        foundSLLog.SELF_LINKS.push(message);
        break;

    }

    // const time = new Date();
    // if (!reporterLogs.some(i => i.message === message && i.time === moment(time).format('hh:mm:ss'))) {
    //   const newLog = new Log(id, message, icon, moment(time).format('hh:mm:ss'), LOG_TYPES.MSG);
    //   reportedLogsForSheet.push(newLog)
    //   reporterLogs.push(newLog)

    //   setState({
    //     ...state,
    //     sheetLogs: reportedLogsForSheet,
    //     allLogs: reporterLogs
    //   })
    // }
  }

  @Action(ClearSheetLogs)
  clearSheetLogs({getState, setState}: StateContext<LogsStateModel>) {
    const state = getState();
    const allLogs = state.allLogs;

    const id = state.id + 1;
    allLogs.push({id, messages: [], NO_IN_LINKS: [], NO_OUT_LINKS: [], MULTI_IN_LINKS: [], SELF_LINKS: []});
    setState({
      ...state,
      id ,
      sheetLogs: {id, messages: [], NO_IN_LINKS: [], NO_OUT_LINKS: [], MULTI_IN_LINKS: [], SELF_LINKS: []},
      allLogs
    });
  }

  // @Action(ReportMultiLog)
  // reportMultiLog({getState, setState}: StateContext<LogsStateModel>, {message, icon, multiMessage}: ReportMultiLog) {
  //   const state = getState();
  //   const reporterLogs = state.allLogs;
  //   const reportedLogsForSheet = state.sheetLogs;
  //   const time = new Date();

  //   const foundSheetLog = reportedLogsForSheet.findIndex(i => i.message === message);
  //     if (foundSheetLog !== -1) {
  //       if (reportedLogsForSheet[foundSheetLog].multi.findIndex(r => r === multiMessage) === -1) {
  //         reportedLogsForSheet[foundSheetLog].multi.push(multiMessage);
  //       }
  //     } else {

  //       const nl = new Log(message, icon, moment(time).format('hh:mm:ss'), LOG_TYPES.MULTI);
  //       nl.multi.push(multiMessage);
  //       reportedLogsForSheet.push(nl);
  //     }

  // }



}
