import { BimodalConfig, BMNode, Link } from '../models/bimodal.model';
import { DiscrepencyStructure, SearchStructure } from '../models/tree.model';
import { OmapConfig } from '../models/omap.model';

export class UpdateGraphWidth {
  static readonly type = '[UPDATE WIDTH] Update Graph Width';
  constructor(public width: number) { }
}

export class UpdateVegaSpec {
  static readonly type = '[UPDATE] Vega Spec';
  constructor(public spec: any) { }
}

export class UpdateVegaView {
  static readonly type = '[UPDATE] Vega View';
  constructor(public view: any) { }
}

export class UpdateBimodal {
  static readonly type = '[UPDATE] Bimodal Network';
  constructor(public nodes: BMNode[], public links: Link[]) { }
}

export class UpdateBimodalConfig {
  static readonly type = '[UPDATE] Bimodal config';
  constructor(public config: BimodalConfig) { }
}

export class DoSearch {
  static readonly type = '[SEARCH] Update Search List';
  constructor(
    public searchStructures: SearchStructure[],
    public lastClickedOption: SearchStructure
  ) { }
}

export class DiscrepencyLabel {
  static readonly type = '[DISCREPENCY] Update discrepency Label List';
  constructor(public discrepencyStructures: DiscrepencyStructure[]) { }
}
export class DiscrepencyId {
  static readonly type = '[DISCREPENCY] Update discrepency Id List';
  constructor(public discrepencyStructures: DiscrepencyStructure[]) { }
}

export class DuplicateId {
  static readonly type = '[DISCREPENCY] Update duplicate Id List';
  constructor(public discrepencyStructures: DiscrepencyStructure[]) { }
}

export class UpdateBottomSheetData {
  static readonly type = '[UPDATE] Bottom Sheet Data';
  constructor(public data: any) { }
}

export class UpdateLinksData {
  static readonly type = '[UPDATE] Links data';
  constructor(
    public AS_CT: number,
    public CT_B: number,
    public AS_CT_organWise: Record<string, number>,
    public CT_B_organWise: Record<string, number>,
    public AS_AS?: number,
    public AS_AS_organWise?: Record<string, number>,
    public allOrgans?: boolean
  ) { }
}

export class UpdateOmapConfig {
  static readonly type = '[UPDATE] OMAP Config';
  constructor(public config: OmapConfig) { }
}
