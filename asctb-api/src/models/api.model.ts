/* tslint:disable:variable-name */

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

export const arrayNameMap: Record<string, string> = {
  AS: 'anatomical_structures',
  CT: 'cell_types',
  FTU: 'ftu_types',
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
  BF: 'biomarkers_prot'
};

export const objectFieldMap: Record<string, string> = {
  ID: 'id',
  LABEL: 'rdfs_label',
  DOI: 'doi',
  NOTES: 'notes'
};

export class Reference {
  id?: string;
  doi?: string;
  notes?: string;

  constructor(id: string) {
    this.id = id;
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
    if (structureType === 'BGene' || structureType === 'BG') {
      this.b_type = BM_TYPE.G;
    }
    if (structureType === 'BProtein' || structureType === 'BP') {
      name = this.name = name.replace('Protein', '');
      const hasPos = name.indexOf('+') > -1;
      const hasNeg = name.indexOf('-') > -1;

      if (hasPos && hasNeg || (!hasPos && !hasNeg)) {
        this.proteinPresence = PROTEIN_PRESENCE.UNKNOWN;
      } else if (hasPos){
        this.name = name.slice(name.lastIndexOf('+'));
        this.proteinPresence = PROTEIN_PRESENCE.POS;
      } else if (hasNeg){
        this.name = name.slice(name.lastIndexOf('-'));
        this.proteinPresence = PROTEIN_PRESENCE.NEG;
      }
      this.b_type = BM_TYPE.P;
    }
    if (structureType === 'BLipid' || structureType === 'BL') {
      this.b_type = BM_TYPE.BL;
    }
    if (structureType === 'BMetabolites' || structureType === 'BM') {
      this.b_type = BM_TYPE.BM;
    }
    if (structureType === 'BProteoform' || structureType === 'BF') {
      this.b_type = BM_TYPE.BF;
    }
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

  finalize(): void {
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
