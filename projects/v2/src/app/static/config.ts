import { SheetDetails, SheetOptions } from '../models/sheet.model';

export const HEADER_COUNT = 11;

export const IMG_OPTIONS = ['PNG', 'SVG', 'Vega Spec', 'Graph Data'];

export const MASTER_SHEET_LINK =
  'https://docs.google.com/spreadsheets/d/1tK916JyG5ZSXW_cXfsyZnzXfjyoN-8B2GXLbYD6_vF0/edit#gid=2034682742';

export const SHEET_ID = '1tK916JyG5ZSXW_cXfsyZnzXfjyoN-8B2GXLbYD6_vF0';

export const version1Url = 'https://hubmapconsortium.github.io/ccf-releases/v1.0/asct-b/';

export const SHEET_CONFIG: SheetDetails[] = [
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
    name: 'some',
    display: 'Selected Organs',
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
    body: 'Spleen',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 1000,
      height: 1400,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '22580074',
        value: 'spleen-v1.0',
        viewValue: 'v1.0',
        // csvUrl: `${version1Url}ASCT-B_VH_Spleen.csv`
      },
      {
        sheetId: SHEET_ID,
        gid: '984946629',
        value: 'spleen-v1.1-Draft',
        viewValue: 'v1.1 Draft',
      },
    ],
    title: 'Anatomical Structures',
  },
  {
    name: 'thymus',
    display: 'Thymus',
    body: 'Thymus',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 800,
      height: 1000,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '314238819',
        value: 'thymus-v1.0',
        viewValue: 'v1.0',
        // csvUrl: `${version1Url}ASCT-B_VH_Thymus.csv`
      },
      {
        sheetId: SHEET_ID,
        gid: '1823527529',
        value: 'thymus-v1.1-Draft',
        viewValue: 'v1.1 Draft',
      },
    ],
    title: 'Anatomical Structures',
  },
  {
    name: 'kidney',
    display: 'Kidney',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1760639962',
        value: 'kidney-v1.0',
        viewValue: 'v1.0',
        // csvUrl: `${version1Url}ASCT-B_VH_Kidney.csv`
      },
      {
        sheetId: SHEET_ID,
        gid: '2137043090',
        value: 'kidney-v1.1-Draft',
        viewValue: 'v1.1 Draft',
      },
    ],
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
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 1000,
      height: 1400,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '272157091',
        value: 'lymph_nodes-v1.0',
        viewValue: 'v1.0',
        // csvUrl: `${version1Url}ASCT-B_NIH_Lymph_Node.csv`
      },
      {
        sheetId: SHEET_ID,
        gid: '1440276882',
        value: 'lymph_nodes-v1.1-Draft',
        viewValue: 'v1.1 Draft',
      },
    ],
    title: 'Anatomical Structures',
  },
  {
    name: 'heart',
    display: 'Heart',
    config: {
      bimodal_distance_x: 300,
      bimodal_distance_y: 60,
      width: 600,
      height: 2500,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1240281363',
        value: 'heart-v1.0',
        viewValue: 'v1.0',
        // csvUrl: `${version1Url}ASCT-B_VH_Heart.csv`
      },
      {
        sheetId: SHEET_ID,
        gid: '2133445058',
        value: 'heart-v1.1-Draft',
        viewValue: 'v1.1 Draft',
      },
    ],
    title: 'Anatomical Structures',
  },
  {
    name: 'brain',
    display: 'Brain',
    config: {
      bimodal_distance_x: 200,
      bimodal_distance_y: 50,
      width: 800,
      height: 5000,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '345174398',
        value: 'brain-v1.0',
        viewValue: 'v1.0',
        // csvUrl: `${version1Url}ASCT-B_Allen_Brain.csv`
      },
      {
        sheetId: SHEET_ID,
        gid: '1379088218',
        value: 'brain-v1.1-Draft',
        viewValue: 'v1.1 Draft',
      },
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'large_intestine',
    display: 'Intestine, Large',
    config: {
      bimodal_distance_x: 200,
      bimodal_distance_y: 50,
      width: 1000,
      height: 8000,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1687995716',
        value: 'large_intestine-v1.0',
        viewValue: 'v1.0',
        // csvUrl: `${version1Url}ASCT-B_VH_Intestine_Large.csv`
      },
      {
        sheetId: SHEET_ID,
        gid: '512613979',
        value: 'large_intestine-v1.1-Draft',
        viewValue: 'v1.1 Draft',
      },
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'vasculature',
    display: 'Vasculature',
    config: {
      bimodal_distance_x: 200,
      bimodal_distance_y: 50,
      width: 1500,
      height: 15000,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1896956438',
        value: 'vasculature-v1.0',
        viewValue: 'v1.0',
        // csvUrl: `${version1Url}ASCT-B_VH_Vasculature.csv`
      },
      {
        sheetId: SHEET_ID,
        gid: '361657182',
        value: 'vasculature-v1.1-Draft',
        viewValue: 'v1.1 Draft',
      },
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'bone_marrow',
    display: 'Bone Marrow',
    config: {
      bimodal_distance_x: 200,
      bimodal_distance_y: 50,
      width: 500,
      height: 1000,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1852470103',
        value: 'bone_marrow-v1.0',
        viewValue: 'v1.0',
        // csvUrl: `${version1Url}ASCT-B_VH_BM_Blood_Pelvis.csv`
      },
      {
        sheetId: SHEET_ID,
        gid: '1845311048',
        value: 'bone_marrow-v1.1-Draft',
        viewValue: 'v1.1 Draft',
      },
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'skin',
    display: 'Skin',
    config: {
      bimodal_distance_x: 200,
      bimodal_distance_y: 50,
      width: 600,
      height: 1000,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '104836770',
        value: 'skin-v1.0',
        viewValue: 'v1.0',
        // csvUrl: `${version1Url}ASCT-B_VH_Skin.csv`
      },
      {
        sheetId: SHEET_ID,
        gid: '1158675184',
        value: 'skin-v1.1-Draft',
        viewValue: 'v1.1 Draft',
      },
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'lung',
    display: 'Lung',
    config: {
      bimodal_distance_x: 200,
      bimodal_distance_y: 50,
      width: 1000,
      height: 50000,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1824552484',
        value: 'lung-v1.1-Draft',
        viewValue: 'v1.1 Draft',
      },
    ],
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

export const PLAYGROUND_SHEET_OPTIONS: SheetOptions[] = [
  {
    title: 'Example',
    sheet: 'example',
  },
];

export const SHEET_OPTIONS: SheetOptions[] = [
  {
    title: 'Bone Marrow',
    sheet: 'bone_marrow',
    version: [
      {
        value: 'bone_marrow-v1.0',
        viewValue: 'v1.0',
      },
      {
        value: 'bone_marrow-v1.1-Draft',
        viewValue: 'v1.1 Draft',
      },
    ],
  },
  {
    title: 'Brain',
    sheet: 'brain',
    version: [
      { value: 'brain-v1.0', viewValue: 'v1.0' },
      { value: 'brain-v1.1-Draft', viewValue: 'v1.1 Draft' },
    ],
  },
  {
    title: 'Heart',
    sheet: 'heart',
    version: [
      { value: 'heart-v1.0', viewValue: 'v1.0' },
      { value: 'heart-v1.1-Draft', viewValue: 'v1.1 Draft' },
    ],
  },
  {
    title: 'Kidney',
    sheet: 'kidney',
    version: [
      { value: 'kidney-v1.0', viewValue: 'v1.0' },
      { value: 'kidney-v1.1-Draft', viewValue: 'v1.1 Draft' },
    ],
  },
  {
    title: 'Intestine, Large',
    sheet: 'large_intestine',
    version: [
      { value: 'large_intestine-v1.0', viewValue: 'v1.0' },
      { value: 'large_intestine-v1.1-Draft', viewValue: 'v1.1 Draft' },
    ],
  },
  // {
  //   title: 'Liver',
  //   sheet: 'liver',
  // },
  {
    title: 'Lung',
    sheet: 'lung',
    version: [
      { value: 'lung-v1.1-Draft', viewValue: 'v1.1 Draft' },
    ],
  },
  {
    title: 'Lymph Nodes',
    sheet: 'lymph_nodes',
    version: [
      { value: 'lymph_nodes-v1.0', viewValue: 'v1.0' },
      { value: 'lymph_nodes-v1.1-Draft', viewValue: 'v1.1 Draft' },
    ],
  },
  {
    title: 'Skin',
    sheet: 'skin',
    version: [
      { value: 'skin-v1.0', viewValue: 'v1.0' },
      { value: 'skin-v1.1-Draft', viewValue: 'v1.1 Draft' },
    ],
  },
  // {
  //   title: 'Small Intestine',
  //   sheet: 'small_intestine',
  // },
  {
    title: 'Spleen',
    sheet: 'spleen',
    version: [
      { value: 'spleen-v1.0', viewValue: 'v1.0' },
      { value: 'spleen-v1.1-Draft', viewValue: 'v1.1 Draft' },
    ],
  },
  {
    title: 'Thymus',
    sheet: 'thymus',
    version: [
      { value: 'thymus-v1.0', viewValue: 'v1.0' },
      { value: 'thymus-v1.1-Draft', viewValue: 'v1.1 Draft' },
    ],
  },
  {
    title: 'Vasculature',
    sheet: 'vasculature',
    version: [
      { value: 'vasculature-v1.0', viewValue: 'v1.0' },
      { value: 'vasculature-v1.1-Draft', viewValue: 'v1.1 Draft' },
    ],
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
    type: 'route',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/hubmapconsortium/ccf-asct-reporter',
    type: 'tab',
  },
  {
    name: 'T&C',
    url: 'https://hubmapconsortium.org/wp-content/uploads/2020/06/DUA_FINAL_2020_02_03_for_Signature.pdf',
    type: 'tab',
  },
  {
    name: 'Policy',
    url: 'https://hubmapconsortium.org/policies/',
    type: 'tab',
  },
];
