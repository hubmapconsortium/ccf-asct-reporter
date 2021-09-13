import { OntologyCode } from './../models/lookup.model';

export function buildASCTApiUrl(id: string): string {
  return `http://www.ebi.ac.uk/ols/api/terms/findByIdAndIsDefiningOntology?obo_id=${id}`;
}

export function buildHGNCApiUrl(id: string): string {
  return `https://rest.genenames.org/fetch/hgnc_id/${id}`;
}

export function buildHGNCLink(id: string): string {
  return `https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${id}`;
}

export function fixOntologyId(id: string): string {
  if (id?.toLowerCase() === 'n/a') {
    return '';
  }
  // Fix IDs from ASCT+B Tables. Ideally, these changes are made up stream for next release and no transformation is necessary
  if (id.startsWith('fma') && /[0-9]/.test(id[3])) {
    id = 'fma:' + id.slice(3);
  }
  id = id.replace('_', ':').replace('::', ':').replace(': ', ':').replace('fmaid:', 'FMA:').split(' ')[0].toUpperCase();
  id = id.split(':').map((s: string) => s.trim()).join(':');
  return id;
}

export function guessIri(id: string): string {
  const [code, idNumber] = id.split(':');
  switch (code) {
  case OntologyCode.CL:
    return `http://purl.obolibrary.org/obo/CL_${idNumber}`;
  case OntologyCode.FMA:
    return `http://purl.org/sig/ont/fma/fma${idNumber}`;
  case OntologyCode.HGNC:
    return `http://ncicb.nci.nih.gov/xml/owl/EVS/Hugo.owl#HGNC_${idNumber}`;
  case OntologyCode.UBERON:
    return `http://purl.obolibrary.org/obo/UBERON_${idNumber}`;
  default:
    return undefined;
  }
}
