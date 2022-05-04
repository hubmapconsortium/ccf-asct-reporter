export interface LookupResponse {
  label: string;
  description: string;
  link: string;
  additionalInfo?: string;
  extraLinks?: Record<string, string>;
}

export enum OntologyCode {
  UBERON = 'UBERON',
  CL = 'CL',
  FMA = 'FMA',
  HGNC = 'HGNC',
  LMHA = 'LMHA',
}
