import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SconfigService {

  SHEET_CONFIG = [
    {
      name: 'spleen',
      display: 'Spleen',
      header_count: 1,
      cell_row: 15,
      marker_row: 18,
      uberon_row: 2,
      report_cols: [0, 3, 6, 9, 12, 15, 18],
      tree_cols: [0, 3, 6, 9, 12],
      indent_cols: [0, 3, 6, 9, 12, 15],
      body: 'Spleen',
      config: {
        bimodal_distance: 350,
        width: 1200
      }
    },
    {
      name: 'kidney',
      display: 'Kidney',
      header_count: 1,
      cell_row: 2,
      marker_row: 4,
      uberon_row: 0,
      report_cols: [0, 1, 2, 4],
      tree_cols: [0, 1],
      indent_cols: [0, 1, 2],
      body: 'Kidney',
      config: {
        bimodal_distance: 350, 
        width: 700
      }
    },
    {
      name: 'liver',
      display: 'Liver',
      header_count: 1,
      cell_row: 3,
      marker_row: 4,
      uberon_row: 0,
      report_cols: [0, 1, 2, 3, 4],
      tree_cols: [0, 1, 2],
      indent_cols: [0, 1, 2, 3],
      body: 'Liver',
      config: {
        bimodal_distance: 360,
        width: 800
      }
    },
    {
      name: 'lymph',
      display: 'Lymph Nodes',
      header_count: 1,
      cell_row: 4,
      marker_row: 5,
      uberon_row: 0,
      report_cols: [0, 1, 2, 3, 4, 5],
      tree_cols: [0, 1, 2, 3],
      indent_cols: [0, 1, 2, 3, 4],
      body: 'Lymph Nodes',
      config: {
        bimodal_distance: 350,
        width: 1200
      }
    },
    {
      name: 'heart',
      display: 'Heart',
      header_count: 2,
      cell_row: 6,
      marker_row: 9,
      uberon_row: 2,
      report_cols: [0, 3, 6, 9],
      tree_cols: [0, 3],
      indent_cols: [0, 3, 6],
      body: 'Heart',
      config: {
        bimodal_distance: 360,
        width: 800
      }
    },
    {
      name: 'si',
      display: 'Small Intestine',
      header_count: 1,
      cell_row: 4,
      marker_row: 6,
      uberon_row: 0,
      report_cols: [0, 1, 2, 3, 4, 6],
      tree_cols: [0, 1, 2, 3],
      indent_cols: [0, 1, 2, 3, 4],
      body: 'Small Intestine',
      config: {
        bimodal_distance: 360,
        width: 1200
      }
    },
    {
      name: 'li',
      display: 'Large Intestine',
      header_count: 1,
      cell_row: 4,
      marker_row: 5,
      uberon_row: 0,
      report_cols: [0, 1, 2, 3, 4, 5],
      tree_cols: [0, 1, 2, 3],
      indent_cols: [0, 1, 2, 3, 4],
      body: 'Large Intestine',
      config: {
        bimodal_distance: 360,
        width: 1200
      }
    },
    {
      name: 'skin',
      display: 'Skin',
      header_count: 1,
      cell_row: 3,
      marker_row: 4,
      uberon_row: 0,
      report_cols: [0, 1, 2, 3],
      tree_cols: [0, 1, 2],
      indent_cols: [0, 1, 2, 3],
      body: 'Skin',
      config: {
        bimodal_distance: 350,
        width: 800
      }
    },
  ];


  constructor() { }
}
