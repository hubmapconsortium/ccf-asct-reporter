
import { State, Action, StateContext, Selector } from '@ngxs/store';

import { Injectable } from '@angular/core';
import { ReportLog, ClearSheetLogs } from '../actions/logs.actions';
import { Log, LogEntry } from '../models/logs.model';

/** Class to keep track of the logs */
export class LogsStateModel {
  /**
   * Id of the log
   */
  id: number;
  /**
   * Logs of the current sheet
   */
  sheetLogs: Log;
  /**
   * All logs of a session
   */
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
  
  /**
   * Returns the sheet logs and all logs
   */
  @Selector()
  static getLogs(state: LogsStateModel) {
    return {
      sheetLogs: state.sheetLogs,
      allLogs: state.allLogs
    };
  }

  
  /**
   * Action to add a log
   */
  @Action(ReportLog)
  reportLog({getState}: StateContext<LogsStateModel>, {type, message, icon, version}: ReportLog) {
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
  }

  /**
   * Action to clear the logs
   */
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
}
