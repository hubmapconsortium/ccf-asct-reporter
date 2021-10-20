import { SheetDetails, SheetOptions } from '../models/sheet.model';

export const HEADER_COUNT = 11;

export const IMG_OPTIONS = ['PNG', 'SVG', 'Vega Spec', 'Graph Data', 'JSON-LD','OWL (RDF/XML)'];

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



  {
    name: 'eye',
    display: 'Eye',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1593659227',
        value: 'Eye-v1.0',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures', 
    data: '',
  },
  {
    name: 'fallopian_tube',
    display: 'Fallopian Tube',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1417514103',
        value: 'Fallopian_Tube_v1.0',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'knee',
    display: 'Knee',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1572314003',
        value: 'Knee_v1.0',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures', 
    data: '',
  },
  {
    name: 'liver',
    display: 'Liver',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '2079993346',
        value: 'Liver_v1.0',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures', 
    data: '',
  },
  {
    name: 'lymph_vasculature',
    display: 'Lymph Vasculature',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '598065183',
        value: 'Lymph_Vasculature_v1.0',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'pancreas',
    display: 'Pancreas',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1044871154',
        value: 'Pancreas_v1.0',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'peripheral_nervous_system',
    display: 'Peripheral Nervous System',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '887132317',
        value: 'Peripheral_Nervous_System_v1.0',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures', 
    data: '',
  },
  {
    name: 'prostate',
    display: 'Prostate',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1921589208',
        value: 'Prostate_v1.0',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures', 
    data: '',
  },
  {
    name: 'ovary',
    display: 'Ovary',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1072160013',
        value: 'Ovary_v1.0',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'small_intestine',
    display: 'Small Intestine',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1247909220',
        value: 'Small_Intestine_v1.0',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures', 
    data: '',
  },
  {
    name: 'ureter',
    display: 'Ureter',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1106564583',
        value: 'Ureter_v1.0',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures', 
    data: '',
  },
  {
    name: 'urinary_bladder',
    display: 'Urinary Bladder',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '498800030',
        value: 'Urinary_Bladder_v1.0',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'uterus',
    display: 'Uterus',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '877379009',
        value: 'Uterus_v1.0',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures', 
    data: '',
  },
  {
    name: 'brain',
    display: 'Brain',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1379088218',
        value: 'Brain_v1.1',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures', 
    data: '',
  },
  {
    name: 'blood',
    display: 'Blood',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1315753355',
        value: 'Blood_v1.1',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'bone_marrow',
    display: 'Bone Marrow',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1845311048',
        value: 'Bone_Marrow_v1.1',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'heart',
    display: 'Heart',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '2133445058',
        value: 'Heart_v1.1',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures', 
    data: '',
  },
  {
    name: 'lymph_node',
    display: 'Lymph Node',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1440276882',
        value: 'Lymph_Node_v1.1',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures', 
    data: '',
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
        gid: '2137043090',
        value: 'Kidney_v1.1',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'large_intestine',
    display: 'Large Intestine',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '512613979',
        value: 'Large_Intestine_v1.1',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'lung',
    display: 'Lung',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1824552484',
        value: 'Lung_v1.1',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures', 
    data: '',
  },
  {
    name: 'skin',
    display: 'Skin',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1158675184',
        value: 'Skin_v1.1',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures',
    data: '',
  },
  {
    name: 'spleen',
    display: 'Spleen',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '984946629',
        value: 'Spleen_v1.1',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures', 
    data: '',
  },
  {
    name: 'thymus',
    display: 'Thymus',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '1823527529',
        value: 'Thymus_v1.1',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures', 
    data: '',
  },
  {
    name: 'blood_vasculature',
    display: 'Blood Vasculature',
    config: {
      bimodal_distance_x: 250,
      bimodal_distance_y: 60,
      width: 700,
      height: 2250,
    },
    version: [
      {
        sheetId: SHEET_ID,
        gid: '361657182',
        value: 'Blood_Vasculature_v1.1',
        viewValue: 'v1.0',
      }
    ],
    title: 'Anatomical Structures', 
    data: '',
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
    display: 'Large Intestine',
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
    title: 'Large Intestine',
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
  


  {
    sheet: 'eye',
    title: 'Eye',
    
    version: [
      {
        value: 'Eye-v1.0',
        viewValue: 'v1.0',
      }
    ],

  },
  {
    sheet: 'fallopian_tube',
    title: 'Fallopian Tube',
    
    version: [
      {
        value: 'Fallopian_Tube_v1.0',
        viewValue: 'v1.0',
      }
    ],

  },
  {
    sheet: 'knee',
    title: 'Knee',
    
    version: [
      {
        value: 'Knee_v1.0',
        viewValue: 'v1.0',
      }
    ],

  },
  {
    sheet: 'liver',
    title: 'Liver',
    
    version: [
      {
        value: 'Liver_v1.0',
        viewValue: 'v1.0',
      }
    ],

  },
  {
    sheet: 'lymph_vasculature',
    title: 'Lymph Vasculature',
    
    version: [
      {
        value: 'Lymph_Vasculature_v1.0',
        viewValue: 'v1.0',
      }
    ],

  },
  {
    sheet: 'pancreas',
    title: 'Pancreas',
    
    version: [
      {
        value: 'Pancreas_v1.0',
        viewValue: 'v1.0',
      }
    ],

  },
  {
    sheet: 'peripheral_nervous_system',
    title: 'Peripheral Nervous System',
    
    version: [
      {
        value: 'Peripheral_Nervous_System_v1.0',
        viewValue: 'v1.0',
      }
    ],

  },
  {
    sheet: 'prostate',
    title: 'Prostate',
    
    version: [
      {
        value: 'Prostate_v1.0',
        viewValue: 'v1.0',
      }
    ],

  },
  {
    sheet: 'ovary',
    title: 'Ovary',
    
    version: [
      {
        value: 'Ovary_v1.0',
        viewValue: 'v1.0',
      }
    ],

  },
  {
    sheet: 'small_intestine',
    title: 'Small Intestine',
    
    version: [
      {
        value: 'Small_Intestine_v1.0',
        viewValue: 'v1.0',
      }
    ],
  },
  {
    sheet: 'ureter',
    title: 'Ureter',
    
    version: [
      {
        value: 'Ureter_v1.0',
        viewValue: 'v1.0',
      }
    ],

  },
  {
    sheet: 'urinary_bladder',
    title: 'Urinary Bladder',
    
    version: [
      {
        value: 'Urinary_Bladder_v1.0',
        viewValue: 'v1.0',
      }
    ],

  },
  {
    sheet: 'uterus',
    title: 'Uterus',
    
    version: [
      {
        value: 'Uterus_v1.0',
        viewValue: 'v1.0',
      }
    ],

  },
  {
    sheet: 'blood',
    title: 'Blood',
    
    version: [
      {
        value: 'Blood_v1.1',
        viewValue: 'v1.0',
      }
    ],

  },
  {
    sheet: 'blood_vasculature',
    title: 'Blood Vasculature',
    
    version: [
      {
        value: 'Blood_Vasculature_v1.1',
        viewValue: 'v1.0',
      }
    ],

  }


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
