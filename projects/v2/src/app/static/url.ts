import { environment } from 'projects/v2/src/environments/environment';

export const URL = environment.asctbApiUrl;

export const PLAYGROUND = 'assets/playground/sheet.csv';

export function getAssetsURL(dataVersion, currentSheet) {
  return `assets/data/${dataVersion}/${currentSheet.name}.csv`;
}

export function getInformation(id: string, group = 1) {
  return `https://www.ebi.ac.uk/ols/api/ontologies/uberon/terms?iri=http://purl.obolibrary.org/obo/${id.replace(':', '_')}`;
}
