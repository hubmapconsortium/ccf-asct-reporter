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
    type: string,
    bType?: string,
  ) {
    this.id = id;
    this.parent = parent;
    this.type = type;
    this.comparator = '';
    this.comparatorId = '';
    this.comparatorName = '';
    this.name = name;
    this.metadata = new Metadata(name, ontologyId, label, bType);
  }
}

export class Metadata {
  ontologyTypeId: string;
  ontologyType: string;
  label: string;
  name: string;
  ontologyId: string;
  bmType?: string;

  constructor(name: string, ontologyId: string, label: string, bmType?: string) {
    this.ontologyId = ontologyId;
    if (ontologyId.toLowerCase().startsWith('fma')) {
      ontologyId = ontologyId.substring(3);
      if (ontologyId.includes(':')) {
        ontologyId = ontologyId.split(':')[1];
      }
      ontologyId = 'FMA:' + ontologyId;
    }
    else if (ontologyId.toLowerCase().startsWith('uberon')) {
      ontologyId = ontologyId.substring('uberon'.length);
      if (ontologyId.includes(':')) {
        ontologyId = ontologyId.split(':')[1];
      }
      ontologyId = 'UBERON:' + ontologyId;
    }
    [this.ontologyType, this.ontologyTypeId] = ontologyId.split(':');
    this.name = name;
    this.label = label;
    this.bmType = bmType;
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
