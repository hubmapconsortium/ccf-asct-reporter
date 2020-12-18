export const AS_RED = '#E41A1C';
export const CT_BLUE = '#377EB8';
export const B_GREEN = '#4DAF4A';

export class TNode {
  id: any;
  name: string;
  parent: string;
  uberonId: string;
  color: string;
  problem: boolean;
  found: boolean;
  groupName: string;
  isNew: boolean;
  pathColor: string;
  parents: Array<number>;
  children: number;
  x: number;
  y: number;

  constructor(id, name, parent, uId, color = '#808080') {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.uberonId = uId;
    this.color = color;
    this.problem = false;
    this.groupName = 'Multi-parent Nodes';
    this.isNew = false;
    this.pathColor = '#ccc';
    this.parents = [];
  }
}

export class TreeAndMultiParent {
  tree: Array<TNode>;
  multiParentLinks: any;

}

export interface AS {
  structure: string;
  uberon: string;
}

export interface ASCTBConfig {
  report_cols?: Array<number>;
  cell_col?: number;
  marker_col?: number;
  uberon_col?: number;
}

export interface CT {
  structure: string;
  link: string;
  nodeSize: number;
  isNew: boolean;
  color: string;
}

export interface B {
  structure: string;
  link: string;
  isNew: boolean;
  color: string;
}

export class Cell {
  structure: string;
  parents: Array<string>;
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
  parents: Array<string>;
  count: number;
  isNew: boolean;
  color: string;

  constructor(structure, count) {
    this.structure = structure;
    this.parents = [];
    this.count = count;
    this.isNew = false;
    this.color = '#ccc';
  }
}


export class Organ {
  body: string;
  organ: string;
  cellType: string;
  markers: string;
  organRow: Array<Organ>;
}


export interface SearchStructure {
  id: number;
  name: string;
  groupName: string;
  x: number;
  y: number;
}
