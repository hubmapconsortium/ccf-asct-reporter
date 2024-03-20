import { PROTEIN_PRESENCE, Reference } from './sheet.model';
export const AS_RED = '#E41A1C';
export const CT_BLUE = '#377EB8';
export const B_GREEN = '#4DAF4A';

export const ST_ID = 2;

export enum NODE_TYPE {
  AS = 'AS',
  BM = 'BM',
  R = 'root',
}

export class TNode {
  id: number;
  name: string;
  parent: number;
  ontologyId: string;
  color: string;
  problem: boolean;
  found: boolean = false;
  groupName: string;
  isNew: boolean;
  pathColor: string;
  parents: number[];
  children: number = 0;
  x: number = 0;
  y: number = 0;
  type: string;
  comparator: string;
  comparatorName: string;
  comparatorId: string;
  label: string = '';
  notes: string;
  organName: string;

  constructor(
    id: number,
    name: string,
    parent: number,
    uId: string,
    notes: string,
    organName: string,
    color = '#808080'
  ) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.ontologyId = uId;
    this.color = color;
    this.problem = false;
    this.groupName = 'Multi-parent Nodes';
    this.isNew = false;
    this.pathColor = '#ccc';
    this.parents = [];
    this.type = NODE_TYPE.AS;
    this.comparator = '';
    this.comparatorId = '';
    this.comparatorName = '';
    this.notes = notes;
    this.organName = organName;
  }
}

export interface Base {
  id?: number;
  comparator?: string;
  comparatorId?: string;
  comparatorName?: string;
}

export interface AS extends Base {
  structure: string;
  uberon: string;
  indegree?: Set<Degree>;
  outdegree?: Set<Degree>;
  label?: string;
  isNew?: boolean;
  color?: string;
  organName?: string;
  notes: string;
}

export interface Degree {
  id: string;
  name: string;
  proteinPresence?: PROTEIN_PRESENCE;
}

export interface ASCTBConfig {
  report_cols?: number[];
  cell_col?: number;
  marker_col?: number;
  uberon_col?: number;
}

export interface CT extends Base {
  structure: string;
  link: string;
  nodeSize?: number;
  isNew: boolean;
  color: string;
  label?: string;
  indegree?: Set<Degree>;
  outdegree?: Set<Degree>;
  references?: Reference[];
  organName?: string;
  notes: string;
}

export interface B extends Base {
  structure: string;
  link: string;
  isNew: boolean;
  color: string;
  indegree?: Set<Degree>;
  outdegree?: Set<Degree>;
  nodeSize?: number;
  bType?: string;
  proteinPresence?: PROTEIN_PRESENCE;
  organName?: string;
  notes: string;
}

export class Cell {
  structure: string;
  parents: string[];
  link: string;
  isNew: boolean;
  color: string;

  constructor(structure: string, link = 'NONE') {
    this.structure = structure;
    this.parents = [];
    this.link = link;
    this.isNew = false;
    this.color = '#ccc';
  }
}

export class Marker {
  structure: string;
  parents: string[];
  count: number;
  isNew: boolean;
  color: string;

  constructor(structure: string, count: number) {
    this.structure = structure;
    this.parents = [];
    this.count = count;
    this.isNew = false;
    this.color = '#ccc';
  }
}

export interface Organ {
  body: string;
  organ: string;
  cellType: string;
  markers: string;
  organRow: Organ[];
}

export interface SearchStructure {
  id: number;
  name: string;
  groupName: string;
  x: number;
  y: number;
}

export interface DiscrepencyStructure {
  id: number;
  name: string;
  groupName: string;
  x: number;
  y: number;
  ontologyId: string;
}

export interface LinksASCTBData {
  AS_CT: number;
  CT_B: number;
  AS_AS: number;
  AS_CT_organWise: Record<string, number>;
  CT_B_organWise: Record<string, number>;
  AS_AS_organWise: Record<string, number>;
}

export interface BmCtPairings {
  BM_NAME: string;
  BM_ID: string;
  CT_NAME: string;
  CT_ID: string;
  AS_NAME: string;
  AS_ID: string;
}
