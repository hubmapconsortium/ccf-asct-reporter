import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SconfigService {

  SHEET_CONFIG = [
    {
      name: 'ao',
      display: 'All Organs',
      header_count: 1,
      cell_row: 2,
      marker_row: 3,
      uberon_row: 0,
      report_cols: [1, 2],
      tree_cols: [1],
      indent_cols: [1, 2],
      body: 'Body',
      config: {
        bimodal_distance: 600,
        width: 400,
        height_offset: 4500
      },
      title: 'Organs'
    },
    {
      name: 'spleen',
      display: 'Spleen',
      sheetId:'158lQftWOn7QmjiYXhJ_GMkvpmoZus4HA',
      gid: '2113964255',
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
        width: 1200,
        height_offset: 200
      },
      title: 'Anatomical Structures'
    },
    {
      name: 'kidney',
      display: 'Kidney',
      sheetId:'158lQftWOn7QmjiYXhJ_GMkvpmoZus4HA',
      gid: '391854815',
      header_count: 1,
      cell_row: 4,
      marker_row: 6,
      uberon_row: 0,
      report_cols: [0, 1, 2, 4],
      tree_cols: [0, 1],
      indent_cols: [0, 1, 2],
      body: 'Kidney',
      config: {
        bimodal_distance: 350,
        width: 700,
        height_offset: 200
      },
      title: 'Anatomical Structures'
    },
    {
      name: 'liver',
      display: 'Liver',
      sheetId:'158lQftWOn7QmjiYXhJ_GMkvpmoZus4HA',
      gid: '978191084',
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
        width: 800,
        height_offset: 200
      },
      title: 'Anatomical Structures'
    },
    {
      name: 'lymph',
      display: 'Lymph Nodes',
      sheetId:'158lQftWOn7QmjiYXhJ_GMkvpmoZus4HA',
      gid: '1118039538',
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
        width: 1200,
        height_offset: 200
      },
      title: 'Anatomical Structures'
    },
    {
      name: 'heart',
      display: 'Heart',
      sheetId:'158lQftWOn7QmjiYXhJ_GMkvpmoZus4HA',
      gid: '1821578486',
      header_count: 2,
      cell_row: 6,
      marker_row: 9,
      uberon_row: 2,
      report_cols: [0, 3, 6, 9],
      tree_cols: [0, 3],
      indent_cols: [0, 3, 6],
      body: 'Heart',
      config: {
        bimodal_distance: 400,
        width: 800,
        height_offset: 200
      },
      title: 'Anatomical Structures'
    },
    {
      name: 'si',
      display: 'Small Intestine',
      sheetId:'158lQftWOn7QmjiYXhJ_GMkvpmoZus4HA',
      gid: '2042292356',
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
        width: 1200,
        height_offset: 200
      },
      title: 'Anatomical Structures'
    },
    {
      name: 'li',
      display: 'Large Intestine',
      sheetId:'158lQftWOn7QmjiYXhJ_GMkvpmoZus4HA',
      gid: '1273403700',
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
        width: 1200,
        height_offset: 200
      },
      title: 'Anatomical Structures'
    },
    {
      name: 'skin',
      display: 'Skin',
      sheetId:'158lQftWOn7QmjiYXhJ_GMkvpmoZus4HA',
      gid: '1372528345',
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
        width: 800,
        height_offset: 200
      },
      title: 'Anatomical Structures'
    },
  ];


  constructor() { }
}
