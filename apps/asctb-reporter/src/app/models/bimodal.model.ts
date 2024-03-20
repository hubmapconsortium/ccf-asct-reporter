import { PROTEIN_PRESENCE, Reference } from './sheet.model';
import { Degree, NODE_TYPE } from './tree.model';

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
  id: number = 0;
  color: string;
  nodeSize: number;
  targets: number[];
  sources: number[];

  problem: boolean = false;
  pathColor: string;
  isNew: boolean;
  type: string;
  degree?: number;
  indegree?: Set<Degree>;
  outdegree?: Set<Degree>;
  label?: string;
  bType?: string;
  proteinPresence: PROTEIN_PRESENCE;
  references?: Reference[];
  notes: string;
  organName: string;

  constructor(
    name: string,
    group: number,
    x: number,
    y: number,
    fontSize: number,
    notes: string,
    organName: string,
    ontologyId = '',
    color = '#E41A1C',
    nodeSize = 300,
    proteinPresence = PROTEIN_PRESENCE.UNKNOWN
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
    this.groupName = groupNameMapper[group as keyof typeof groupNameMapper];
    this.ontologyId = ontologyId;
    this.pathColor = '#ccc';
    this.isNew = false;
    this.type = NODE_TYPE.BM;
    this.label = '';
    this.notes = notes;
    this.organName = organName;
    this.proteinPresence = proteinPresence;
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
  nodes: BMNode[];
  links: Link[];
  compareDD?: DD[];
  searchIds?: number[];
}

export const bimodalSortOptions = ['Alphabetically', 'Degree'];
export const bimodalBSizeOptions = ['None', 'Degree'];
export const bimodalCTSizeOptions = ['None', 'Degree', 'Indegree', 'Outdegree'];
export const bimodalBTypeOptions = [
  'All',
  'Gene',
  'Protein',
  'Lipids',
  'Metabolites',
  'Proteoforms',
];

export interface BimodalConfig {
  CT: {
    sort: string;
    size: string;
  };
  BM: {
    sort: string;
    size: string;
    type: string;
  };
}

export interface BimodalData {
  nodes: BMNode[];
  links: Link[];
  config: BimodalConfig;
}
