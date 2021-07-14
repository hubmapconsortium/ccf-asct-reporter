/* tslint:disable:variable-name */
export interface LookupResponse {
  name: string;
  label: string;
  description: string;
  link: string;
}

export enum OntologyCode {
  UBERON = 'UBERON',
  CL = 'CL',
  FMA = 'FMA',
  HGNC = 'HGNC',
}

export interface Reference {
  id?: string;
  doi?: string;
  notes?: string;
}

export enum BM_TYPE {
  G = 'gene',
  P = 'protein',
  BL = 'lipids',
  BM = 'metalloids',
  BF = 'proteoforms',
}

export class Structure {
  name?: string;
  id?: string;
  rdfs_label?: string;
  b_type?: BM_TYPE;

  constructor(name: string) {
    this.name = name;
    this.id = '';
    this.rdfs_label = '';
  }
}

export class Row {
  anatomical_structures: Array<Structure>;
  cell_types: Array<Structure>;
  biomarkers: Array<Structure>;
  biomarkers_protein: Array<Structure>;
  biomarkers_gene: Array<Structure>;
  biomarkers_lipids: Array<Structure>;
  biomarkers_meta: Array<Structure>;
  biomarkers_prot: Array<Structure>;
  references: Reference[];

  constructor() {
    this.anatomical_structures = [];
    this.cell_types = [];
    this.biomarkers_protein = [];
    this.biomarkers_gene = [];
    this.biomarkers = [];
    this.biomarkers_lipids = [];
    this.biomarkers_meta = [];
    this.biomarkers_prot = [];
    this.references = [];
  }
}

export const headerMap: any = {
  AS: 'anatomical_structures',
  CT: 'cell_types',
  BG: 'biomarkers_gene',
  BP: 'biomarkers_protein',
  BGene: 'biomarkers_gene',
  BProtein: 'biomarkers_protein',
  REF: 'references',
  BLipid: 'biomarkers_lipids',
  BMetabolites: 'biomarkers_meta',
  BProteoform: 'biomarkers_prot',
  BL: 'biomarkers_lipids',
  BM: 'biomarkers_meta',
  BF: 'biomarkers_prot',
};
