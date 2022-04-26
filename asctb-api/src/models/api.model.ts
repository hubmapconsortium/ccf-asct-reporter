/* tslint:disable:variable-name */
export const DELIMETER = ';';
export const TITLE_ROW_INDEX = 0;

export const metadataArrayFields = ['author_names', 'author_orcids', 'reviewer_names', 'reviewer_orcids', 'general_publications'];
export const metadataNameMap: Record<string, string> = {
  'Author Name(s):': 'author_names',
  'Author ORCID(s):': 'author_orcids',
  'Reviewer(s):': 'reviewer_names',
  'Reviewer ORCID(s):': 'reviewer_orcids',
  'General Publication(s):': 'general_publications',
  'Data DOI:': 'data_doi',
  'Date:': 'date',
  'Version Number:': 'version'
};
export enum BM_TYPE {
  G = 'gene',
  P = 'protein',
  BL = 'lipids',
  BM = 'metabolites',
  BF = 'proteoforms',
}

export enum PROTEIN_PRESENCE {
  POS = 'Positive',
  NEG = 'Negative',
  UNKNOWN = 'Unknown'
}

export const HEADER_FIRST_COLUMN = 'AS/1';

export const arrayNameMap: Record<string, string> = {
  AS: 'anatomical_structures',
  CT: 'cell_types',
  FTU: 'ftu_types',
  BG: 'biomarkers_gene',
  BP: 'biomarkers_protein',
  BGENE: 'biomarkers_gene',
  BPROTEIN: 'biomarkers_protein',
  REF: 'references',
  BLIPID: 'biomarkers_lipids',
  BMETABOLITES: 'biomarkers_meta',
  BPROTEOFORM: 'biomarkers_prot',
  BL: 'biomarkers_lipids',
  BM: 'biomarkers_meta',
  BF: 'biomarkers_prot'
};

export const objectFieldMap: Record<string, string> = {
  ID: 'id',
  LABEL: 'rdfs_label',
  DOI: 'doi',
  NOTES: 'notes',
  NOTE: 'notes'
};

export function createObject(name: string, structureType: string): any {
  switch (structureType) {
  case 'REF':
    return new Reference(name);
  case 'AS':
  default:
    return new Structure(name, structureType);
  }
}

export class Reference {
  id?: string;
  doi?: string;
  notes?: string;

  constructor(id: string) {
    this.id = id;
  }

  isValid(): boolean {
    return !!this.id || !!this.doi || !!this.notes;
  }
}

export class Structure {
  name?: string;
  id?: string = '';
  rdfs_label?: string = '';
  b_type?: BM_TYPE;
  proteinPresence?: PROTEIN_PRESENCE;

  constructor(name: string, structureType: string) {
    this.name = name;
    this.setBiomarkerProperties(structureType, name);
  }

  setBiomarkerProperties(structureType: string, name: string): void {
    if (structureType === 'BGENE' || structureType === 'BG') {
      this.b_type = BM_TYPE.G;
    }
    if (structureType === 'BPROTEIN' || structureType === 'BP') {
      name = this.name = name.replace('Protein', '').trim();
      const hasPos = name.endsWith('+');
      const hasNeg = name.endsWith('-');

      if (hasPos){
        this.name = name.slice(0, -1);
        this.proteinPresence = PROTEIN_PRESENCE.POS;
      } else if (hasNeg){
        this.name = name.slice(0, -1);
        this.proteinPresence = PROTEIN_PRESENCE.NEG;
      } else {
        this.proteinPresence = PROTEIN_PRESENCE.UNKNOWN;
      }
      this.b_type = BM_TYPE.P;
    }
    if (structureType === 'BLIPID' || structureType === 'BL') {
      this.b_type = BM_TYPE.BL;
    }
    if (structureType === 'BMETABOLITES' || structureType === 'BM') {
      this.b_type = BM_TYPE.BM;
    }
    if (structureType === 'BPROTEOFORM' || structureType === 'BF') {
      this.b_type = BM_TYPE.BF;
    }
  }

  isValid(): boolean {
    return !!this.id || !!this.name || !!this.rdfs_label;
  }
}

export class Row {
  anatomical_structures: Array<Structure> = [];
  cell_types: Array<Structure> = [];
  biomarkers: Array<Structure> = [];
  biomarkers_protein: Array<Structure> = [];
  biomarkers_gene: Array<Structure> = [];
  biomarkers_lipids: Array<Structure> = [];
  biomarkers_meta: Array<Structure> = [];
  biomarkers_prot: Array<Structure> = [];
  ftu_types: Array<Structure> = [];
  references: Reference[] = [];

  constructor(public rowNumber: number) {}

  finalize(): void {
    this.anatomical_structures = this.anatomical_structures.filter(s => s.isValid());
    this.cell_types = this.cell_types.filter(s => s.isValid());
    this.ftu_types = this.ftu_types.filter(s => s.isValid());
    this.references = this.references.filter(s => s.isValid());

    this.biomarkers_gene = this.biomarkers_gene.filter(s => s.isValid());
    this.biomarkers_protein = this.biomarkers_protein.filter(s => s.isValid());
    this.biomarkers_lipids = this.biomarkers_lipids.filter(s => s.isValid());
    this.biomarkers_meta = this.biomarkers_meta.filter(s => s.isValid());
    this.biomarkers_prot = this.biomarkers_prot.filter(s => s.isValid());

    this.biomarkers = [
      ...this.biomarkers_gene,
      ...this.biomarkers_protein,
      ...this.biomarkers_lipids,
      ...this.biomarkers_meta,
      ...this.biomarkers_prot
    ];
  }
}

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
