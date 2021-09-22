export interface LookupResponse {
  name: string;
  label: string;
  description: string;
  link: string;
  extraLinks:{'Uniprot Link':string, 'Entrez Link':string};
}

export enum OntologyCode {
  UBERON = 'UBERON',
  CL = 'CL',
  FMA = 'FMA',
  HGNC = 'HGNC',
}
