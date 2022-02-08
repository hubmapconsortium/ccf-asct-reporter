/* tslint:disable:variable-name */

export interface Reference {
  id?: string;
  doi?: string;
  notes?: string;
}

export enum BM_TYPE {
  G = 'gene',
  P = 'protein',
  BL = 'lipids',
  BM = 'metabolites',
  BF = 'proteoforms',
}

export enum PROTEIN_PRESENCE {
  P = 'POS',
  N = 'NEG',
  U = 'UNKNOWN'
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

// Copied interface out of @types/express-fileupload to avoid type casting failure
export interface UploadedFile {
    /** file name */
    name: string;
    /** A function to move the file elsewhere on your server */
    mv(path: string, callback: (err: any) => void): void;
    mv(path: string): Promise<void>;
    /** Encoding type of the file */
    encoding: string;
    /** The mimetype of your file */
    mimetype: string;
    /** A buffer representation of your file, returns empty buffer in case useTempFiles option was set to true. */
    data: Buffer;
    /** A path to the temporary file in case useTempFiles option was set to true. */
    tempFilePath: string;
    /** A boolean that represents if the file is over the size limit */
    truncated: boolean;
    /** Uploaded size in bytes */
    size: number;
    /** MD5 checksum of the uploaded file */
    md5: string;
}
