export function buildASCTApiUrl(id: string) {
  return `http://www.ebi.ac.uk/ols/api/terms/findByIdAndIsDefiningOntology?obo_id=${id}`;
}

export function buildHGNCApiUrl(id: string) {
  return `https://rest.genenames.org/fetch/hgnc_id/${id}`;
}

export function buildHGNCLink(id: string) {
  return `https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${id}`;
}
