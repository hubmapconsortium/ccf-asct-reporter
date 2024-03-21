import { Reference } from './api.model';

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
  CT_BM = 'CTmetabolites',
  CT_BF = 'CTproteoforms',
  AS_G = 'ASgene', // Not supported, but shows up in the data
  AS_P = 'ASprotein', // Not supported, but shows up in the data
}

export class GNode {
  id: number;
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
    references: Reference[],
    bType?: string
  ) {
    this.id = id;
    this.parent = parent;
    this.type = type;
    this.comparator = '';
    this.comparatorId = '';
    this.comparatorName = '';
    this.name = name;
    this.metadata = new Metadata(name, ontologyId, label, references, bType);
  }
}

export class Metadata {
  ontologyTypeId: string;
  ontologyType: string;
  label: string;
  name: string;
  ontologyId: string;
  bmType?: string;
  references: Reference[];

  constructor(
    name: string,
    ontologyId: string,
    label: string,
    references: Reference[],
    bmType?: string
  ) {
    this.name = name;
    this.ontologyId = ontologyId;
    if (ontologyId.toLowerCase().startsWith('fma')) {
      ontologyId = ontologyId.substring(3);
      if (ontologyId.includes(':')) {
        ontologyId = ontologyId.split(':')[1];
      }
      ontologyId = 'FMA:' + ontologyId;
    } else if (ontologyId.toLowerCase().startsWith('uberon')) {
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
    this.references = references;
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
