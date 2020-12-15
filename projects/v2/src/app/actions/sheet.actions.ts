import {Sheet} from './../models/sheet.model'

export class fetchSheetData {
  static readonly type = '[FETCH] Sheet Data';
  constructor(public sheet: Sheet) {}
}

export class updateVegaSpec {
  static readonly type = '[UPDATE] Vega Spec';
  constructor(public spec: any) {}
}

export class updateTreeView {
  static readonly type = '[UPDATE] Tree View';
  constructor(public view: any) {}
}