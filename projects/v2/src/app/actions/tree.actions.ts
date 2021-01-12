import { BimodalConfig } from '../models/bimodal.model';
import { SearchStructure } from '../models/tree.model';

export class UpdateGraphWidth{
  static readonly type = '[UPDATE WIDTH] Update Graph Width';
  constructor(public width: number) {}
}

export class UpdateVegaSpec {
  static readonly type = '[UPDATE] Vega Spec';
  constructor(public spec: any) {}
}

export class UpdateVegaView {
  static readonly type = '[UPDATE] Vega View';
  constructor(public view: any) {}
}

export class UpdateBimodal {
  static readonly type = '[UPDATE] Bimodal Network';
  constructor(public nodes: any, public links: any) {}
}

export class UpdateBimodalConfig {
  static readonly type = '[UPDATE] Bimodal config';
  constructor(public config: BimodalConfig) {}
}

export class DoSearch {
  static readonly type = '[SEARCH] Update Search List';
  constructor(public searchStructures: SearchStructure[]) {}
}

export class UpdateBottomSheetData {
  static readonly type = '[UPDATE] Bottom Sheet Data';
  constructor(public data: any) {}
}

export class UpdateLinksData {
  static readonly type = '[UPDATE] Links data';
  constructor(public AS_CT: number, public CT_B: number) {}
}
