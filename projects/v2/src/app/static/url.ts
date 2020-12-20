export const URL = `http://localhost:5000`;

export function getAssetsURL(dataVersion, currentSheet) {
  return `assets/data/${dataVersion}/${currentSheet.name}.csv`
}
