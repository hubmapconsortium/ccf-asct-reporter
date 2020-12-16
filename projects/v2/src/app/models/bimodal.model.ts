const groupNameMapper = {
  1: 'Anatomical Structures',
  2: 'Cell Types',
  3: 'Biomarkers',
};

export class BMNode {
  name: string;
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
  uberonId: string;
  problem: boolean;
  pathColor: string;
  isNew: boolean;

  constructor(
    name,
    group,
    x,
    y,
    fontSize,
    uberonId = '',
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
    this.uberonId = uberonId;
    this.pathColor = '#ccc';
    this.isNew = false;
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

export const bimodalSortOptions = ['Alphabetically', 'Degree'],
             bimodalSizeOptions = ['None', 'Degree'],
             bimodalCTSizeOptions = ['None', 'Degree', 'Indegree', 'Outdegree'];