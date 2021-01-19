export const HEADER_COUNT = 11;

export const IMG_OPTIONS = ['PNG', 'SVG', 'Vega Spec'];

export const SHEET_ID = '1WHZishoufxzeTzmJuPa51b-uCHTbfMhx';

export const SHEET_CONFIG = [
  {
    name: 'all',
    display: 'All Organs',
    body: 'Body',
    sheetId: SHEET_ID,
    gid: '',
    config: {
      bimodal_distance_x: 350,
      bimodal_distance_y: 60,
      width: 700,
      height: 5000,
    },

    title: 'Organs',
  },
  {
    name: 'spleen',
    display: 'Spleen',
    sheetId: SHEET_ID,
    gid: '124181304',
    body: 'Spleen',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 1000,
      height: 1400,
    },
    title: 'Anatomical Structures',
  },
  {
    name: 'kidney',
    display: 'Kidney',
    sheetId: SHEET_ID,
    gid: '1159046280',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 1400,
    },
    title: 'Anatomical Structures',
  },
  {
    name: 'liver',
    display: 'Liver',
    sheetId: SHEET_ID,
    gid: '1042410095',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 1400,
    },
    title: 'Anatomical Structures',
  },
  {
    name: 'lymph_nodes',
    display: 'Lymph Nodes',
    sheetId: SHEET_ID,
    gid: '1534783756',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 1200,
      height: 1400,
    },
    title: 'Anatomical Structures',
  },
  {
    name: 'heart',
    display: 'Heart',
    sheetId: SHEET_ID,
    gid: '417014363',
    config: {
      bimodal_distance_x: 300,
      bimodal_distance_y: 60,
      width: 500,
      height: 1400,
    },
    title: 'Anatomical Structures',
  },
  {
    name: 'brain',
    display: 'Brain',
    sheetId: SHEET_ID,
    gid: '424264987',
    config: {
      bimodal_distance_x: 200,
      bimodal_distance_y: 50,
      width: 800,
      height: 5000,
    },
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'large_intestine',
    display: 'Large Intestine',
    sheetId: SHEET_ID,
    gid: '626111095',
    config: {
      bimodal_distance_x: 200,
      bimodal_distance_y: 50,
      width: 500,
      height: 500,
    },
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'vasculature',
    display: 'Vasculature',
    sheetId: SHEET_ID,
    gid: '549887416',
    config: {
      bimodal_distance_x: 200,
      bimodal_distance_y: 50,
      width: 1500,
      height: 15000,
    },
    title: 'Anatomical Structures',
    data: '',
  },

  {
    name: 'example',
    display: 'Example',
    sheetId: '0',
    gid: '0',
    config: {
      bimodal_distance_x: 200,
      bimodal_distance_y: 50,
      width: 500,
      height: 500,
    },
    title: 'Anatomical Structures',
    data: '',
  },
];
export const PLAYGROUND_SHEET_OPTIONS = [
  {
    title: 'Example',
    sheet: 'example',
  },
];
export const SHEET_OPTIONS = [
  {
    title: 'All Organs',
    sheet: 'all',
  },
  {
    title: 'Brain',
    sheet: 'brain',
  },
  {
    title: 'Heart',
    sheet: 'heart',
  },
  {
    title: 'Kidney',
    sheet: 'kidney',
  },
  {
    title: 'Large Intestine',
    sheet: 'large_intestine',
  },
  {
    title: 'Liver',
    sheet: 'liver',
  },
  {
    title: 'Lung',
    sheet: 'lung',
  },
  {
    title: 'Lymph Nodes',
    sheet: 'lymph_nodes',
  },
  {
    title: 'Skin',
    sheet: 'skin',
  },
  {
    title: 'Small Intestine',
    sheet: 'small_intestine',
  },
  {
    title: 'Spleen',
    sheet: 'spleen',
  },
  {
    title: 'Vasculature',
    sheet: 'vasculature',
  },
];

export const VERSION = [
  {
    display: 'Latest',
    folder: 'latest',
  },
  {
    display: 'v1.0.0',
    folder: 'v100',
  },
  {
    display: 'v1.0.1',
    folder: 'v101',
  },
];

export const MORE_OPTIONS = [
  {
    name: 'GitHub',
    url: 'https://github.com/hubmapconsortium/ccf-asct-reporter',
  },
  {
    name: 'T&C',
    url:
      'https://hubmapconsortium.org/wp-content/uploads/2020/06/DUA_FINAL_2020_02_03_for_Signature.pdf',
  },
  {
    name: 'Policy',
    url: 'https://hubmapconsortium.org/policies/',
  },
];
