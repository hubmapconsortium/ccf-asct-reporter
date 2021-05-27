
export const HEADER_COUNT = 11;

export const IMG_OPTIONS = ['PNG', 'SVG', 'Vega Spec'];

export const MASTER_SHEET_LINK = 'https://docs.google.com/spreadsheets/d/1tK916JyG5ZSXW_cXfsyZnzXfjyoN-8B2GXLbYD6_vF0/edit#gid=2034682742';

export const SHEET_ID = '1tK916JyG5ZSXW_cXfsyZnzXfjyoN-8B2GXLbYD6_vF0';

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
    gid: '22580074',
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
    name: 'thymus',
    display: 'Thymus',
    sheetId: SHEET_ID,
    gid: '314238819',
    body: 'Thymus',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 800,
      height: 1000,
    },
    title: 'Anatomical Structures',
  },
  {
    name: 'kidney',
    display: 'Kidney',
    sheetId: SHEET_ID,
    gid: '1760639962',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    title: 'Anatomical Structures',
  },
  // {
  //   name: 'liver',
  //   display: 'Liver',
  //   sheetId: SHEET_ID,
  //   gid: '2079993346',
  //   config: {
  //     bimodal_distance_x: 250,
  //     bimodal_distance_y: 60,
  //     width: 700,
  //     height: 1400,
  //   },
  //   title: 'Anatomical Structures',
  // },
  {
    name: 'lymph_nodes',
    display: 'Lymph Nodes',
    sheetId: SHEET_ID,
    gid: '272157091',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 1000,
      height: 1400,
    },
    title: 'Anatomical Structures',
  },
  {
    name: 'heart',
    display: 'Heart',
    sheetId: SHEET_ID,
    gid: '1240281363',
    config: {
      bimodal_distance_x: 300,
      bimodal_distance_y: 60,
      width: 600,
      height: 2500,
    },
    title: 'Anatomical Structures',
  },
  {
    name: 'brain',
    display: 'Brain',
    sheetId: SHEET_ID,
    gid: '345174398',
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
    display: 'Intestine, Large',
    sheetId: SHEET_ID,
    gid: '1687995716',
    config: {
      bimodal_distance_x: 200,
      bimodal_distance_y: 50,
      width: 1000,
      height: 8000,
    },
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'vasculature',
    display: 'Vasculature',
    sheetId: SHEET_ID,
    gid: '1896956438',
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
    name: 'bone_marrow',
    display: 'Bone Marrow',
    sheetId: SHEET_ID,
    gid: '1852470103',
    config: {
      bimodal_distance_x: 200,
      bimodal_distance_y: 50,
      width: 500,
      height: 1000,
    },
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'skin',
    display: 'Skin',
    sheetId: SHEET_ID,
    gid: '104836770',
    config: {
      bimodal_distance_x: 200,
      bimodal_distance_y: 50,
      width: 600,
      height: 1000,
    },
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'lung',
    display: 'Lung',
    sheetId: SHEET_ID,
    gid: '1824552484',
    config: {
      bimodal_distance_x: 200,
      bimodal_distance_y: 50,
      width: 1000,
      height: 50000,
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
    title: 'Bone Marrow',
    sheet: 'bone_marrow'
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
    title: 'Intestine, Large',
    sheet: 'large_intestine',
  },
  // {
  //   title: 'Liver',
  //   sheet: 'liver',
  // },
  {
    title: 'Lung DRAFT',
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
  // {
  //   title: 'Small Intestine',
  //   sheet: 'small_intestine',
  // },
  {
    title: 'Spleen',
    sheet: 'spleen',
  },
  {
    title: 'Thymus',
    sheet: 'thymus',
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
    name: 'About',
    url: '/docs',
    type: 'route'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/hubmapconsortium/ccf-asct-reporter',
    type: 'tab'
  },
  {
    name: 'T&C',
    url:
      'https://hubmapconsortium.org/wp-content/uploads/2020/06/DUA_FINAL_2020_02_03_for_Signature.pdf',
    type: 'tab'
  },
  {
    name: 'Policy',
    url: 'https://hubmapconsortium.org/policies/',
    type: 'tab'
  },
];
