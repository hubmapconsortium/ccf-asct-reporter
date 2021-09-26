export interface LookupResponse {
  name: string;
  label: string;
  description: string;
  link: string;
  additionalInfo?: string;
}

export enum OntologyCode {
  UBERON = 'UBERON',
  CL = 'CL',
  FMA = 'FMA',
  HGNC = 'HGNC',
}
