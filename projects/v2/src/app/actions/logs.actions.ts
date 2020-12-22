import { LOG_TYPES } from '../models/logs.model';

export class ReportLog {
  static readonly type = '[REPORT] Log';
  constructor(public type: string, public message: string, public icon?: string, public version: string = 'latest') {}
}

export class ReportMultiLog {
  static readonly type = '[REPORT] Milti Log';
  constructor(public message: string, public icon: string, public multiMessage = '') {}
}

export class ClearSheetLogs {
  static readonly type = '[CLEAR] Sheet Logs';
  constructor() {}
}