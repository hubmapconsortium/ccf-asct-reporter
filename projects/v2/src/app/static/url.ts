import { environment } from 'projects/v2/src/environments/environment';

export const URL = environment.asctbApiUrl;

export const PLAYGROUND = 'assets/playground/sheet.csv';

export function getAssetsURL(dataVersion, currentSheet) {
  return `assets/data/${dataVersion}/${currentSheet.name}.csv`;
}

export function buildASCTApiUrl(id: string, group = 1) {
  return `http://www.ebi.ac.uk/ols/api/terms/findByIdAndIsDefiningOntology?obo_id=${id}`;
}

export function buildHGNCApiUrl(id: string, group = 1) {
  const numid = id.split(':')[1];
  return `https://rest.genenames.org/fetch/hgnc_id/${numid}`;
  //return `/hgnc_api/hgnc_id/${numid}`;
}

export function buildHGNCLink(id: string) {
  return 'https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/' + id;
}
