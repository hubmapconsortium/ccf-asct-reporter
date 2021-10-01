export interface LookupResponse {
  label: string;
  description: string;
  link: string;
  extraLinks?: Record<string, string>;
}

export enum OntologyCode {
  UBERON = 'UBERON',
  CL = 'CL',
  FMA = 'FMA',
  HGNC = 'HGNC',
}
