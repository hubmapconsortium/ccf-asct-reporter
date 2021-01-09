enum BM_TYPE {
  G = 'gene',
  P = 'protein'
}

export interface Structure {
  name?: string;
  id?: string;
  rdfs_label?: string;
  b_type?: BM_TYPE;
  isNew?: boolean;
  color?: string;
}

export interface Row {
  anatomical_structures: Array<Structure>;
  cell_types: Array<Structure>;
  biomarkers: Array<Structure>;
}

export interface Data {

}

export interface Sheet {
  name: string;
  sheetId: string;
  gid: string;
  display: string;
  body: string;
  config: SheetConfig;
  title: string;
}

export interface CompareData {
  link: string;
  title: string;
  description: string;
  color: string;
  sheetId: string;
  gid: string;
}

export interface SheetConfig {
  bimodal_distance_y: number;
  bimodal_distance_x: number;
  width: number;
  height: number;
  show_ontology?: boolean;
}