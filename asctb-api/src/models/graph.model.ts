/* tslint:disable:variable-name */
export enum Node_type {
  AS = 'AS',
  CT = 'CT',
  BM = 'BM',
  R = 'root',
}

export enum Edge_type {
  AS_AS = 'ASAS',
  AS_CT = 'ASCT',
  CT_CT = 'CTCT',
  CT_G = 'CTgene',
  CT_P = 'CTprotein',
  CT_BL = 'CTlipids',
  CT_BM = 'CTmetalloids',
  CT_BF = 'CTproteoforms',
  AS_G = 'ASgene', // Not supported, but shows up in the data
  AS_P = 'ASprotein' // Not supported, but shows up in the data
}

export class GNode {
  id: any;
  parent: number;
  type: string;
  name: string;
  comparator: string;
  comparatorName: string;
  comparatorId: string;
  metadata: Metadata;

  constructor(
    id: number,
    name: string,
    parent: number,
    ontologyId: string,
    label: string,
    type: string
  ) {
    this.id = id;
    this.parent = parent;
    this.type = type;
    this.comparator = '';
    this.comparatorId = '';
    this.comparatorName = '';
    this.name = name;
    this.metadata = new Metadata(name, ontologyId, label);
  }
}

export class Metadata {
  ontologyId: string;
  label: string;
  name: string;

  constructor(name: string, ontologyId: string, label: string) {
    this.name = name;
    this.ontologyId = ontologyId;
    this.label = label;
  }
}

export interface GEdge {
  source: number;
  target: number;
}

export interface GraphData {
  nodes: Array<GNode>;
  edges: Array<GEdge>;
}
