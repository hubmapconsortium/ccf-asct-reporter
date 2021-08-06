import { SheetDetails } from '../models/sheet.model';

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
    sheetId: SHEET_ID,
    gid: '22580074',
    body: 'Spleen',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 1000,
      height: 1400,
    },
    version: [
      {
        value: 'spleen-v1.0',
        viewValue: 'v1.0',
        csvUrl: `${version1Url}ASCT-B_VH_Spleen.csv`
      },
      {
        value: 'spleen-v1.5',
        viewValue: 'v1.5',
      },
    ],
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
    version: [
      {
        value: 'thymus-v1.0',
        viewValue: 'v1.0',
        csvUrl: `${version1Url}ASCT-B_VH_Thymus.csv`
      },
      {
        value: 'thymus-v1.5',
        viewValue: 'v1.5',
      },
    ],
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
    version: [
      {
        value: 'kidney-v1.0',
        viewValue: 'v1.0',
        csvUrl: `${version1Url}ASCT-B_VH_Kidney.csv`
      },
      {
        value: 'kidney-v1.5',
        viewValue: 'v1.5',
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
    sheetId: SHEET_ID,
    gid: '272157091',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 1000,
      height: 1400,
    },
    version: [
      {
        value: 'lymph_nodes-v1.0',
        viewValue: 'v1.0',
        csvUrl: `${version1Url}ASCT-B_NIH_Lymph_Node.csv`
      },
      {
        value: 'lymph_nodes-v1.5',
        viewValue: 'v1.5',
      },
    ],
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
    version: [
      {
        value: 'heart-v1.0',
        viewValue: 'v1.0',
        csvUrl: `${version1Url}ASCT-B_VH_Heart.csv`
      },
      {
        value: 'heart-v1.5',
        viewValue: 'v1.5',
      },
    ],
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
    version: [
      {
        value: 'brain-v1.0',
        viewValue: 'v1.0',
        csvUrl: `${version1Url}ASCT-B_Allen_Brain.csv`
      },
      {
        value: 'brain-v1.5',
        viewValue: 'v1.5',
      },
    ],
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
    version: [
      {
        value: 'large_intestine-v1.0',
        viewValue: 'v1.0',
        csvUrl: `${version1Url}ASCT-B_VH_Intestine_Large.csv`
      },
      {
        value: 'large_intestine-v1.5',
        viewValue: 'v1.5',
      },
    ],
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
    version: [
      {
        value: 'vasculature-v1.0',
        viewValue: 'v1.0',
        csvUrl: `${version1Url}ASCT-B_VH_Vasculature.csv`
      },
      {
        value: 'vasculature-v1.5',
        viewValue: 'v1.5',
      },
    ],
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
    version: [
      {
        value: 'bone_marrow-v1.0',
        viewValue: 'v1.0',
        csvUrl: `${version1Url}ASCT-B_VH_BM_Blood_Pelvis.csv`
      },
      {
        value: 'bone_marrow-v1.5',
        viewValue: 'v1.5',
      },
    ],
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
    version: [
      {
        value: 'skin-v1.0',
        viewValue: 'v1.0',
        csvUrl: `${version1Url}ASCT-B_VH_Skin.csv`
      },
      {
        value: 'skin-v1.5',
        viewValue: 'v1.5',
      },
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'lung',
    display: 'Lung DRAFT',
    sheetId: SHEET_ID,
    gid: '1824552484',
    config: {
      bimodal_distance_x: 200,
      bimodal_distance_y: 50,
      width: 1000,
      height: 50000,
    },
    version: [
      {
        value: 'lung-v1.0',
        viewValue: 'v1.0',
        csvUrl: `${version1Url}ASCT-B_VH_Lung.csv`
      },
      {
        value: 'lung-v1.5',
        viewValue: 'v1.5',
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
    sheet: 'bone_marrow',
    version: [
      {
        value: 'bone_marrow-v1.0',
        viewValue: 'v1.0',
      },
      {
        value: 'bone_marrow-v1.5',
        viewValue: 'v1.5',
      },
    ],
  },
  {
    title: 'Brain',
    sheet: 'brain',
    version: [
      { value: 'brain-v1.0', viewValue: 'v1.0' },
      { value: 'brain-v1.5', viewValue: 'v1.5' },
    ],
  },
  {
    title: 'Heart',
    sheet: 'heart',
    version: [
      { value: 'heart-v1.0', viewValue: 'v1.0' },
      { value: 'heart-v1.5', viewValue: 'v1.5' },
    ],
  },
  {
    title: 'Kidney',
    sheet: 'kidney',
    version: [
      { value: 'kidney-v1.0', viewValue: 'v1.0' },
      { value: 'kidney-v1.5', viewValue: 'v1.5' },
    ],
  },
  {
    title: 'Intestine, Large',
    sheet: 'large_intestine',
    version: [
      { value: 'large_intestine-v1.0', viewValue: 'v1.0' },
      { value: 'large_intestine-v1.5', viewValue: 'v1.5' },
    ],
  },
  // {
  //   title: 'Liver',
  //   sheet: 'liver',
  // },
  {
    title: 'Lung DRAFT',
    sheet: 'lung',
    version: [
      { value: 'lung-v1.0', viewValue: 'v1.0' },
      { value: 'lung-v1.5', viewValue: 'v1.5' },
    ],
  },
  {
    title: 'Lymph Nodes',
    sheet: 'lymph_nodes',
    version: [
      { value: 'lymph_nodes-v1.0', viewValue: 'v1.0' },
      { value: 'lymph_nodes-v1.5', viewValue: 'v1.5' },
    ],
  },
  {
    title: 'Skin',
    sheet: 'skin',
    version: [
      { value: 'skin-v1.0', viewValue: 'v1.0' },
      { value: 'skin-v1.5', viewValue: 'v1.5' },
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
      { value: 'spleen-v1.5', viewValue: 'v1.5' },
    ],
  },
  {
    title: 'Thymus',
    sheet: 'thymus',
    version: [
      { value: 'thymus-v1.0', viewValue: 'v1.0' },
      { value: 'thymus-v1.5', viewValue: 'v1.5' },
    ],
  },
  {
    title: 'Vasculature',
    sheet: 'vasculature',
    version: [
      { value: 'vasculature-v1.0', viewValue: 'v1.0' },
      { value: 'vasculature-v1.5', viewValue: 'v1.5' },
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
