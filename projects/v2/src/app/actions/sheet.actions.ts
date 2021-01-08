import {Sheet, CompareData} from './../models/sheet.model';

export class FetchSheetData {
  static readonly type = '[FETCH] Sheet Data';
  constructor(public sheet: Sheet) {}
}

export class RefreshData {
  static readonly type = '[FETCH] Refresh';
  constructor() {}
}

export class FetchDataFromAssets {
  static readonly type = '[FETCH] Data from Assets';
  constructor(public version: string, public sheet: Sheet) {}
}

export class FetchAllOrganData {
  static readonly type = '[FETCH] All Organ Data';
  constructor(public sheet: Sheet) {}
}

export class FetchCompareData {
  static readonly type = '[FETCH] Compare Data';
  constructor(public compareData: CompareData[]) {}
}