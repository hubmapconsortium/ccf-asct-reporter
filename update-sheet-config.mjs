import { readFileSync, writeFileSync } from 'fs';
import Papa from 'papaparse';

const CSV_LINK =
  'https://docs.google.com/spreadsheets/d/1yFHphDyCpB65yRaU9GdsIZ_IASaVnIcOb2dr-NDzdQ8/export?format=csv&gid=0';
const INPUT_SHEET_CONFIG = './projects/v2/src/assets/original-sheet-config.json';
const OUTPUT_SHEET_CONFIG = './projects/v2/src/assets/sheet-config.json';

const SHEET_CONFIG_TEMPLATE = {
  name: 'azimuth',
  display: 'Azimuth',
  config: {
    bimodal_distance_x: 250,
    bimodal_distance_y: 60,
    width: 700,
    height: 2250,
  },
  representation_of: [],
  version: [
    {
      sheetId: '11r-4iSIWR2F2ztY5ul8ZvfCvX19iLtrZvPL1vbSkfoE',
      gid: '0',
      value: 'azimuth-v1',
      viewValue: 'v1',
    },
  ],
  title: 'Anatomical Structures',
  data: '',
};

const sheets = (await fetch(CSV_LINK)
  .then((r) => r.text())
  .then((r) => Papa.parse(r, { header: true, skipEmptyLines: true }).data))
  .filter((r) => r.name && r.sheetId && r.gid);

const inConfig = JSON.parse(readFileSync(INPUT_SHEET_CONFIG).toString());

const config = sheets.map(({ name, sheetId, gid }) => {
  const sheet = JSON.parse(JSON.stringify(SHEET_CONFIG_TEMPLATE));
  const id = name.toLowerCase().replace(/\ \/\ /g, '-').replace(/\ /g, '-');

  sheet.name = id;
  sheet.display = name;
  Object.assign(sheet.version[0], {
    sheetId, gid, value: id, viewValue: name
  });

  return sheet;
}).concat(inConfig);

writeFileSync(OUTPUT_SHEET_CONFIG, JSON.stringify(config, null, 2));
