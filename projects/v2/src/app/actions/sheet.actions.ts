import {Sheet} from './../models/sheet.model'

export class fetchSheetData {
  static readonly type = '[FETCH] Sheet Data';
  constructor(public sheet: Sheet) {}
}

export class updateVegaSpec {
  static readonly type = '[UPDATE] Vega Spec';
  constructor(public spec: any) {}
}

export class updateVegaView {
  static readonly type = '[UPDATE] Vega View';
  constructor(public view: any) {}
}

export class updateBimodal {
  static readonly type = '[UPDATE] Bimodal Network';
  constructor(public nodes: any, public links: any) {}
}