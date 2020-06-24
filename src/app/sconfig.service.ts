import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SconfigService {

  SHEET_CONFIG = [
    {
      name: 'Spleen_R2_EMQverify.xlsx',
      sheetId: '1iUBrmiI_dB67_zCj3FBK9expLTmpBjwS',
      gid: '567133323',
      header_count: 1,
      cell_row: 15,
      marker_row: 18,
      uberon_row: 2,
      report_cols: [0, 3, 6, 9, 12, 15, 18],
      tree_cols: [0, 3, 6, 9, 12],
      indent_cols: [0, 3, 6, 9, 12, 15]
    },
    {
      name: 'Liver-R1_EMQverify.xlsx',
      sheetId: '182y_T_K0r0Cq8-DP9mumyxhZdqBc2orF',
      gid: '1812139231',
      header_count: 1,
      cell_row: 3,
      marker_row: 4,
      uberon_row: 0,
      report_cols: [0, 1, 2, 3, 4],
      tree_cols: [0, 1, 2],
      indent_cols: [0, 1, 2, 3]
    },
    {
      name: 'KidneyR1EMQverify.xlsx',
      sheetId: '1Ja3PdoKZ7O2o3rlivM-6e6hWP5gbeoC8',
      gid: '605610169',
      header_count: 1,
      cell_row: 2,
      marker_row: 4,
      uberon_row: 0,
      report_cols: [0, 1, 2, 4],
      tree_cols: [0, 1, 2],
      indent_cols: [0, 1, 2]
    },
    {
      name: 'LymphNodes-R1_EMQverify.xlsx',
      sheetId: '1boY5g8b21_XzfM9tzKY-5b2lSQEsXbsT',
      gid: '1911325594',
      header_count: 1,
      cell_row: 1,
      marker_row: 5,
      uberon_row: 0,
      report_cols: [0, 1, 5],
      tree_cols: [0, 1],
      indent_cols: [0, 1]
    },
    {
      name: 'Heart-R1_EMQverify.xlsx',
      sheetId: '1opLDa7TzdQ4Y2cz2C-cl42AIvPUK3Iga',
      gid: '1780473586',
      header_count: 2,
      cell_row: 6,
      marker_row: 9,
      uberon_row: 2,
      report_cols: [0, 3, 6, 9],
      tree_cols: [0, 3, 6],
      indent_cols: [0, 3, 6]
    },
  ]
    

  constructor() { }
}
