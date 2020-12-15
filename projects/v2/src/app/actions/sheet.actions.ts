import {Sheet} from './../models/sheet.model'

export class fetchSheetData {
  static readonly type = '[FETCH] Sheet Data';
  constructor(public sheet: Sheet) {}
}