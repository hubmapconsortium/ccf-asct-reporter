import { environment } from 'projects/v2/src/environments/environment';

export const URL = environment.asctbApiUrl;

export const PLAYGROUND = 'assets/playground/sheet.csv';

export function getAssetsURL(dataVersion, currentSheet) {
  return `assets/data/${dataVersion}/${currentSheet.name}.csv`;
}

export function buildASCTApiUrl(id: string, group = 1) {
  return `/ebi_api/findByIdAndIsDefiningOntology?obo_id=${id}`;
}

export function buildHGNCApiUrl(id: string, group = 1) {
  let numid = id.split(':')[1];
  return `/hgnc_api/hgnc_id/${numid}`;
}

export function buildHGNCLink(id: string) {
  return "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/" + id;
}