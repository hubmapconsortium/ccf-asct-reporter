import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SconfigService {

  SHEET_CONFIG = [
    {
      name: 'Spleen_R2_EMQverify.csv',
      sheetId: '1IXOyqzXEdckdDDLwZheFQzieutd8waK3',
      gid: '1909860780',
      header_count: 1,
      cell_row: 15,
      marker_row: 18,
      uberon_row: 2,
      report_cols: [0, 3, 6, 9, 12, 15, 18],
      tree_cols: [0, 3, 6, 9, 12],
      indent_cols: [0, 3, 6, 9, 12, 15],
      body: 'Spleen',
      config: {
        width_offset: 900,
        bimodal_distance: 350
      }
    },
    {
      name: 'Kidney_updated_R1_EMQverify6_21_2020.csv',
      sheetId: '1R0uLiUVBCPPbYCncZIc2t1BkBHsgjyUQ',
      gid: '1516392899',
      header_count: 1,
      cell_row: 2,
      marker_row: 4,
      uberon_row: 0,
      report_cols: [0, 1, 2, 4],
      tree_cols: [0, 1],
      indent_cols: [0, 1, 2],
      body: 'Kidney',
      config: {
        width_offset: 1100,
        bimodal_distance: 420
      }
    },
    {
      name: 'Liver-R1_EMQverify.csv',
      sheetId: '182y_T_K0r0Cq8-DP9mumyxhZdqBc2orF',
      gid: '1812139231',
      header_count: 1,
      cell_row: 3,
      marker_row: 4,
      uberon_row: 0,
      report_cols: [0, 1, 2, 3, 4],
      tree_cols: [0, 1, 2],
      indent_cols: [0, 1, 2, 3],
      body: 'Liver',
      config: {
        width_offset: 1300,
        bimodal_distance: 360
      }
    },
    {
      name: 'LymphNodes-R1_EMQverify.csv',
      sheetId: '1boY5g8b21_XzfM9tzKY-5b2lSQEsXbsT',
      gid: '1911325594',
      header_count: 1,
      cell_row: 1,
      marker_row: 5,
      uberon_row: 0,
      report_cols: [0, 1, 5],
      tree_cols: [0],
      indent_cols: [0, 1],
      body: 'Lymph Nodes',
      config: {
        width_offset: 1600,
        bimodal_distance: 400
      }
    },
    {
      name: 'Heart-R1_EMQverify.csv',
      sheetId: '1opLDa7TzdQ4Y2cz2C-cl42AIvPUK3Iga',
      gid: '1780473586',
      header_count: 2,
      cell_row: 6,
      marker_row: 9,
      uberon_row: 2,
      report_cols: [0, 3, 6, 9],
      tree_cols: [0, 3],
      indent_cols: [0, 3, 6],
      body: 'Heart',
      config: {
        width_offset: 1600,
        bimodal_distance: 360
      }
    },
    {
      name: 'Small intestine-R1_EMQverify06212020.csv',
      sheetId: '1_sK5-aVtI6gG1Dj3Bh3I4kVRveF_Bkgt',
      gid: '550996293',
      header_count: 1,
      cell_row: 4,
      marker_row: 6,
      uberon_row: 0,
      report_cols: [0, 1, 2, 3, 4, 6],
      tree_cols: [0, 1, 2, 3],
      indent_cols: [0, 1, 2, 3, 4],
      body: 'Small Intestine',
      config: {
        width_offset: 600,
        bimodal_distance: 360
      }
    },
    {
      name: 'Large Intestine_R1_EMQVerify06212020.csv',
      sheetId: '1W4JjgX71NMTngr3BMnV2RV1TakQiffnj',
      gid: '772211301',
      header_count: 1,
      cell_row: 4,
      marker_row: 5,
      uberon_row: 0,
      report_cols: [0, 1, 2, 3, 4, 5],
      tree_cols: [0, 1, 2, 3],
      indent_cols: [0, 1, 2, 3, 4],
      body: 'Large Intestine',
      config: {
        width_offset: 800,
        bimodal_distance: 360
      }
    },
  ]


  constructor() { }
}
