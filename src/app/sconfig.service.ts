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
      tree_cols: [0, 3, 6, 9, 12]
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
      tree_cols: [0, 1, 2]
    }
  ]
    

  constructor() { }
}
