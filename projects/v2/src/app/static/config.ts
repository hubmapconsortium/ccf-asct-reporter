export const HEADER_COUNT = 11;

export const IMG_OPTIONS = ['PNG', 'SVG', 'Vega Spec'];

export const SHEET_ID = '1U8-3BMJgCI-vaZDQjdQdTY6Rp48LoBys'

export const SHEET_CONFIG = [
  {
    name: 'all',
    display: 'All Organs',
    body: 'Body',
    config: {
      bimodal_distance_x: 350,
      bimodal_distance_y: 60,
      width: 700,
      height: 5000
    },
    
    title: 'Organs',
  },
  {
    name: 'spleen',
    display: 'Spleen',
    sheetId: SHEET_ID,
    gid: '1195641392',
    body: 'Spleen',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 1000,
      height: 1400
    },
    title: 'Anatomical Structures',
  },
  {
    name: 'kidney',
    display: 'Kidney',
    sheetId: SHEET_ID,
    gid: '1459184913',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 1400
    },
    title: 'Anatomical Structures',
  },
  // {
  //   name: 'liver',
  //   display: 'Liver',
  //   sheetId: '1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI',
  //   gid: '1218756021',
  //   header_count: 11,
  //   cell_col: 3,
  //   marker_col: 4,
  //   uberon_col: 0,
  //   report_cols: [0, 1, 2, 3, 4],
  //   tree_cols: [0, 1, 2],
  //   indent_cols: [0, 1, 2, 3],
  //   body: 'Liver',
  //   config: {
  //     bimodal_distance: 260,
  //     width: 800,
  //     width_offset: 600,
  //     height_offset: 200,
  //   },
  //   title: 'Anatomical Structures',
  // },
  {
    name: 'lymph_nodes',
    display: 'Lymph Nodes',
    sheetId: SHEET_ID,
    gid: '1412289765',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 1200,
      height: 1400
    },
    title: 'Anatomical Structures',
  },
  {
    name: 'heart',
    display: 'Heart',
    sheetId: SHEET_ID,
    gid: '667925588',
    config: {
      bimodal_distance_x: 300,
      bimodal_distance_y: 60,
      width: 500,
      height: 1400
    },
    title: 'Anatomical Structures',
  },
  // {
  //   name: 'small_intestine',
  //   display: 'Small Intestine',
  //   sheetId: '1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI',
  //   gid: '766906089',
  //   header_count: 11,
  //   cell_col: 4,
  //   marker_col: 6,
  //   uberon_col: 0,
  //   report_cols: [0, 1, 2, 3, 4, 6],
  //   tree_cols: [0, 1, 2, 3],
  //   indent_cols: [0, 1, 2, 3, 4],
  //   body: 'Small Intestine',
  //   config: {
  //     bimodal_distance: 360,
  //     width: 1200,
  //     width_offset: 0,
  //     height_offset: 200,
  //   },
  //   title: 'Anatomical Structures',
  // },
  // {
  //   name: 'large_intestine',
  //   display: 'Large Intestine',
  //   sheetId: '1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3ht',
  //   gid: '82644608',
  //   header_count: 11,
  //   cell_col: 4,
  //   marker_col: 5,
  //   uberon_col: 0,
  //   report_cols: [0, 1, 2, 3, 4, 5],
  //   tree_cols: [0, 1, 2, 3],
  //   indent_cols: [0, 1, 2, 3, 4],
  //   body: 'Large Intestine',
  //   config: {
  //     bimodal_distance: 260,
  //     width: 1200,
  //     width_offset: 0,
  //     height_offset: 200,
  //   },
  //   title: 'Anatomical Structures',
  // },
  // {
  //   name: 'skin',
  //   display: 'Skin',
  //   sheetId: '18lJe-9fq5fHWr-9HuFTzhWnmfygeuXs2bbsXO8vh1FU',
  //   gid: '1867953125',
  //   header_count: 11,
  //   cell_col: 3,
  //   marker_col: 4,
  //   uberon_col: 0,
  //   report_cols: [0, 1, 2, 3],
  //   tree_cols: [0, 1, 2],
  //   indent_cols: [0, 1, 2, 3],
  //   body: 'Skin',
  //   config: {
  //     bimodal_distance: 250,
  //     width: 800,
  //     width_offset: 650,
  //     height_offset: 200,
  //   },
  //   title: 'Anatomical Structures',
  // },
  // {
  //   name: 'lung',
  //   display: 'Lung',
  //   sheetId: '1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI',
  //   gid: '1167730392',
  //   header_count: 11,
  //   cell_col: 2,
  //   marker_col: 3,
  //   uberon_col: 0,
  //   report_cols: [0, 1, 2],
  //   tree_cols: [0, 1],
  //   indent_cols: [0, 1],
  //   body: 'Lung',
  //   config: {
  //     bimodal_distance: 250,
  //     width: 800,
  //     width_offset: 650,
  //     height_offset: 200,
  //   },
  //   title: 'Anatomical Structures',
  // },
  // {
  //   name: 'brain',
  //   display: 'Brain',
  //   sheetId: '1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI',
  //   gid: '870372095',
  //   header_count: 11,
  //   cell_col: 7,
  //   marker_col: 8,
  //   uberon_col: 0,
  //   report_cols: [0, 1, 2, 3, 4, 5, 7],
  //   tree_cols: [0, 1, 2, 3, 4, 5],
  //   indent_cols: [0, 1, 2, 3, 4, 5],
  //   body: 'Brain',
  //   config: {
  //     bimodal_distance: 250,
  //     width: 800,
  //     width_offset: 1000,
  //     height_offset: 4000,
  //   },
  //   title: 'Anatomical Structures',
  // },
];

export const SHEET_OPTIONS = [
  {
    title: 'All Organs',
    sheet: 'all'
  },
  {
    title: 'Brain',
    sheet: 'brain'
  },
  {
    title: 'Heart',
    sheet: 'heart'
  },
  {
    title: 'Kidney',
    sheet: 'kidney'
  },
  {
    title: 'Large Intestine',
    sheet: 'large_intestine'
  },
  {
    title: 'Liver',
    sheet: 'liver'
  },
  {
    title: 'Lung',
    sheet: 'lung'
  },
  {
    title: 'Lymph Nodes',
    sheet: 'lymph_nodes'
  },
  {
    title: 'Skin',
    sheet: 'skin'
  },
  {
    title: 'Small Intestine',
    sheet: 'small_intestine'
  },
  {
    title: 'Spleen',
    sheet: 'spleen'
  }
];

export const VERSION  = [
  {
    display: 'Latest',
    folder: 'latest'
  },
  {
    display: 'v1.0.0',
    folder: 'v100'
  },
  {
    display: 'v1.0.1',
    folder: 'v101'
  }
];

export const MORE_OPTIONS = [
  {
    name: 'Data Tables',
    url:
      'https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1268820100',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/hubmapconsortium/ccf-asct-reporter',
  },
];
