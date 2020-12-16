export class UpdateGraphWidth{
  static readonly type = '[UPDATE WIDTH] Update Graph Width';
  constructor(width: number) {}
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