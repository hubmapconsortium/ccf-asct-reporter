import { NODE_TYPE } from './tree.model';

const groupNameMapper = {
  1: 'Anatomical Structures',
  2: 'Cell Types',
  3: 'Biomarkers',
};

export class BMNode {
  name: string;
  ontologyId: string;
  group: number;
  groupName: string;
  fontSize: number;
  x: number;
  y: number;
  id: number;
  color: string;
  nodeSize: number;
  targets: Array<number>;
  sources: Array<number>;

  problem: boolean;
  pathColor: string;
  isNew: boolean;
  type: string;
  degree?: number;
  indegree?: any;
  outdegree?: any;
  label?: string;

  constructor(
    name,
    group,
    x,
    y,
    fontSize,
    ontologyId = '',
    color = '#E41A1C',
    nodeSize = 300
  ) {
    this.name = name;
    this.group = group;
    this.fontSize = fontSize;
    this.x = x;
    this.y = y;
    this.color = color;
    this.nodeSize = nodeSize === 0 ? 50 : nodeSize;
    this.targets = [];
    this.sources = [];
    this.groupName = groupNameMapper[group];
    this.ontologyId = ontologyId;
    this.pathColor = '#ccc';
    this.isNew = false;
    this.type = NODE_TYPE.BM;
    this.label = '';
  }
}

export interface Link {
  s: number;
  t: number;
}

export interface DD {
  name: string;
}

export interface ASCTD {
  nodes: Array<BMNode>;
  links: Array<Link>;
  compareDD?: Array<DD>;
  searchIds?: Array<number>;
}

export const bimodalSortOptions = ['Alphabetically', 'Degree'];
export const bimodalBSizeOptions = ['None', 'Degree'];
export const bimodalCTSizeOptions = ['None', 'Degree', 'Indegree', 'Outdegree'];

export interface BimodalConfig {
  CT: {
    sort: string,
    size: string
  };
  BM: {
    sort: string,
    size: string
  };
}
