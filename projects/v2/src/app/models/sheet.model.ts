enum BM_TYPE {
  G = 'gene',
  P = 'protein',
  BL = 'lipids',
  BM = 'metalloids',
  BF = 'proteoforms'
}

export interface Reference {
  id?: string;
  doi?: string;
  notes?: string;
}

export interface Structure {
  name?: string;
  id?: string;
  rdfs_label?: string;
  b_type?: BM_TYPE;
  isNew?: boolean;
  color?: string;
  organName?: string;
  notes?: string;
}

export interface Row {
  anatomical_structures: Array<Structure>;
  cell_types: Array<Structure>;
  biomarkers: Array<Structure>;
  biomarkers_gene: Array<Structure>;
  biomarkers_protein: Array<Structure>;
  biomarkers_lipids: Array<Structure>;
  biomarkers_meta: Array<Structure>;
  biomarkers_prot: Array<Structure>;
  references: Reference[];
  organName: string;
}

export interface ResponseData {
  csv: string;
  data: Row[];
  parsed: [];
}

export interface Sheet {
  name: string;
  sheetId: string;
  gid: string;
  display: string;
  config: SheetConfig;
  title: string;
  data?: string;
  csvUrl?: string;
  formData?: FormData;
}

export interface CompareData {
  link: string;
  title: string;
  description: string;
  color: string;
  sheetId: string;
  gid: string;
  csvUrl?: string;
  formData?: FormData;
  fileName?: string;
}

export interface SheetConfig {
  bimodal_distance_y: number;
  bimodal_distance_x: number;
  width: number;
  height: number;
  show_ontology?: boolean;
  show_all_AS?: boolean;
  discrepencyLabel?: boolean;
  discrepencyId?: boolean;
  duplicateId?: boolean;
}

export interface SheetInfo {
  name: string;
  ontologyId: string;
  ontologyCode: string;
  iri: string;
  label: string;
  desc: string;
  hasError: boolean;
  msg: string;
  status: number;
  notes: string;
}

export interface DOI {
  name: string;
  id: string;
  notes: string;
}

export interface SheetDetails {
  name: string;
  display: string;
  body?: string;
  sheetId: string;
  gid: string;
  config: {
      bimodal_distance_x: number;
      bimodal_distance_y: number;
      width: number;
      height: number;
  };
  title: string;
  data?: any;
  csvUrl?: string;
}
