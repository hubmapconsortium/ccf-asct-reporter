import { environment } from 'projects/v2/src/environments/environment';

export const URL = environment.asctbApiUrl;

export const PLAYGROUND = 'assets/playground/sheet.csv';

export function getAssetsURL(dataVersion, currentSheet) {
  return `assets/data/${dataVersion}/${currentSheet.name}.csv`;
}
