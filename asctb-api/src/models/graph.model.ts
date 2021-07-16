/* tslint:disable:variable-name */
export enum Node_type {
  AS = 'AS',
  CT = 'CT',
  BM = 'BM',
  R = 'root',
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

export interface GraphData {
  nodes: Array<GNode>;
  edges: Array<Edges>;
}

export interface Edges {
  source: number;
  target: number;
}
