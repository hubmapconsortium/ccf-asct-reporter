import { environment } from 'projects/v2/src/environments/environment';

export const URL = environment.asctbApiUrl;

export const PLAYGROUND = 'assets/playground/sheet.csv';

export function getAssetsURL(dataVersion, currentSheet) {
  return `assets/data/${dataVersion}/${currentSheet.name}.csv`;
}

export function buildUberonOrCellTypeUrl(id: string, group = 1) {
  return `/ebi_api/findByIdAndIsDefiningOntology?id=${id}`;
}

export function buildHNGCUrl(id: string, group = 1) {
  let numid = id.split(':')[1];
  return `/hgnc_api/hgnc_id/${numid}`;
}
