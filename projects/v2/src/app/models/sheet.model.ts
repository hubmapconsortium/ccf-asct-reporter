export interface Data {

}

export interface Sheet {
  name: string;
  sheetId: string;
  gid: string;
  display: string;
  header_count: number;
  cell_col: number;
  marker_col: number;
  uberon_col: number;
  report_cols: Array<number>;
  tree_cols: Array<number>;
  indent_cols: Array<number>;
  body: string;
  config: {
    bimodal_distance: number,
    width: number,
    width_offset: number,
    height_offset: number,
  };
  title: string;
}
