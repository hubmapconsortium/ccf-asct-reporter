import {Sheet} from './../models/sheet.model';

export class FetchSheetData {
  static readonly type = '[FETCH] Sheet Data';
  constructor(public sheet: Sheet) {}
}

export class RefreshData {
  static readonly type = '[FETCH] Refresh';
  constructor() {}
}