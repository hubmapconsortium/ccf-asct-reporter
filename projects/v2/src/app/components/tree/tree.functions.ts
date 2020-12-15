
export interface AS {
  structure: string;
  uberon: string;
}

export interface ASCTBConfig {
  report_cols?: Array<number>;
  cell_col?: number;
  marker_col?: number;
  uberon_col?: number;
}

export interface CT {
  structure: string;
  link: string;
  nodeSize: number;
  isNew: boolean;
  color: string;
}

export interface B {
  structure: string;
  link: string;
  isNew: boolean;
  color: string;
}

export class Cell {
  structure: string;
  parents: Array<string>;
  link: string;
  isNew: boolean;
  color: string;

  constructor(structure: string, link = 'NONE') {
    this.structure = structure;
    this.parents = [];
    this.link = link;
    this.isNew = false;
    this.color = '#ccc';
  }
}

export class Marker {
  structure: string;
  parents: Array<string>;
  count: number;
  isNew: boolean;
  color: string;

  constructor(structure, count) {
    this.structure = structure;
    this.parents = [];
    this.count = count;
    this.isNew = false;
    this.color = '#ccc';
  }
}


export class Organ {
  body: string;
  organ: string;
  cellType: string;
  markers: string;
  organRow: Array<Organ>;
}


export async function makeMarkerDegree(data: any, currentSheet: any) {
  const markerDegrees = [];

  data.forEach((row) => {
    const markers = row[currentSheet.marker_col].split(',');
    const cells = row[currentSheet.cell_col]
      .split(',')
      .map((str) => str.trim())
      .filter((c) => c !== '');

    for (const i in markers) {
      if (markers[i] !== '' && !markers[i].startsWith('//')) {
        const foundMarker = markerDegrees.findIndex(
          (r) =>
            r.structure.toLowerCase().trim() ===
            markers[i].toLowerCase().trim()
        );
        if (foundMarker === -1) {
          const nm = new Marker(markers[i].trim(), cells.length);
          nm.parents.push(...cells.map((cell) => cell.toLowerCase()));
          nm.isNew = row[row.length - 2];
          nm.color = row[row.length - 1];
          markerDegrees.push(nm);
        } else {
          const m = markerDegrees[foundMarker];
          for (const c in cells) {
            if (cells[c] !== '' && !cells[c].startsWith('//')) {
              if (!m.parents.includes(cells[c].toLowerCase())) {
                m.count += 1;
                m.parents.push(cells[c].toLowerCase());
              }
            }
          }
        }
      }
    }
  });

  markerDegrees.sort((a, b) => b.parents.length - a.parents.length);
  return markerDegrees;
}

/**
 * Returns the array of cell types that are sorted have their degrees calculated.
 * @param data - Sheet data
 * @param treeData - Data from the tree visualization.
 * @param degree - Degree configuration. Can be Degree, Indegree and Outdegree
 */
export async function makeCellDegree(
  data,
  treeData,
  degree,
  currentSheet: any
): Promise<Array<Cell>> {
  return new Promise((res, rej) => {
    const cellDegrees: Array<Cell> = [];

    // calculating in degree (AS -> CT)
    if (degree === 'Degree' || degree === 'Indegree') {
      treeData.forEach((td) => {
        if (td.children === 0) {
          const leaf = td.name;

          data.forEach((row) => {
            let parent;
            for (const i in row) {
              if (typeof row[i] === 'string' && row[i] !== '') {
                if (row[i].toLowerCase() === leaf.toLowerCase()) {
                  parent = i;
                }
              }
            }

            if (parent) {
              const cells = row[currentSheet.cell_col].split(',');
              for (const i in cells) {
                if (cells[i] !== '' && !cells[i].startsWith('//')) {
                  const foundCell = cellDegrees.findIndex(
                    (c) =>
                      c.structure.toLowerCase().trim() ===
                      cells[i].toLowerCase().trim()
                  );
                  if (foundCell === -1) {
                    const nc = new Cell(
                      cells[i].trim(),
                      row[currentSheet.cell_col + currentSheet.uberon_col]
                    );
                    nc.isNew = row[row.length - 2];
                    nc.color = row[row.length - 1];
                    nc.parents.push(parent.toLowerCase());
                    cellDegrees.push(nc);
                  } else {
                    const c = cellDegrees[foundCell];
                    if (!c.parents.includes(parent.toLowerCase())) {
                      c.parents.push(parent.toLowerCase());
                    }
                  }
                }
              }
            }
          });
        }
      });
    }

    // calculating out degree (CT -> B)
    if (degree === 'Degree' || degree === 'Outdegree') {
      data.forEach((row) => {
        const markers = row[currentSheet.marker_col]
          .split(',')
          .map((str) => str.trim().toLowerCase())
          .filter((c) => c !== '');
        const cells = row[currentSheet.cell_col]
          .split(',')
          .map((str) => str.trim())
          .filter((c) => c !== '');

        for (const c in cells) {
          if (cells[c] !== '' && !cells[c].startsWith('//')) {
            const cd = cellDegrees.findIndex(
              (i) => i.structure.toLowerCase() === cells[c].toLowerCase()
            );
            if (cd !== -1) {
              for (const m in markers) {
                if (
                  !cellDegrees[cd].parents.includes(markers[m].toLowerCase())
                ) {
                  cellDegrees[cd].parents.push(markers[m]);
                }
              }
            } else {
              const nc = new Cell(
                cells[c].trim(),
                row[currentSheet.cell_col + currentSheet.uberon_col]
              );
              nc.isNew = row[row.length - 2];
              nc.color = row[row.length - 1];
              nc.parents.push(...markers);
              cellDegrees.push(nc);
            }
          }
        }
      });
    }
    cellDegrees.sort((a, b) => b.parents.length - a.parents.length);
    res(cellDegrees);
  });
}

  /**
   * Function to compute the Anatomical Structures from the given Data Table.
   *
   * @param data - Sheet data
   * @param config - Configurations that consist of the following params,
   *   1. report_cols - The cols that are to be considered to form the data. This includes AS, and CT col numbers.
   *   2. cell_col - The column number in which the cell types are present.
   *   3. marker_col - The column number in which the biomarkers are present.
   *   4. uberon_col - The number of columns after which the uberon column can be found.
   *
   * @returns - Array of anatomical structures
   *
   */
export async function makeAS(
    data: Array<Array<string>>,
    config: ASCTBConfig = {
      report_cols: this.sheet.report_cols,
      cell_col: this.sheet.cell_col,
      marker_col: this.sheet.marker_col,
      uberon_col: this.sheet.uberon_col,
    }
  ): Promise<Array<AS>> {
    return new Promise((res, rej) => {
      const anatomicalStructures = [];
      const cols = config.report_cols;
      data.forEach((row) => {
        for (const col in cols) {
          if (
            cols[col] !== config.cell_col &&
            cols[col] !== config.marker_col
          ) {
            const structure = row[cols[col]];
            if (structure.startsWith('//')) {
              continue;
            }

            if (structure !== '') {
              if (
                !anatomicalStructures.some(
                  (i) => i.structure.toLowerCase() === structure.toLowerCase()
                )
              ) {
                anatomicalStructures.push({
                  structure,
                  uberon:
                    row[cols[col] + config.uberon_col].toLowerCase() !==
                      structure.toLowerCase()
                      ? row[cols[col] + config.uberon_col]
                      : '',
                });
              }
            }
          }
        }
      });

      if (anatomicalStructures.length > 0) {
        res(anatomicalStructures);
      } else {
        rej(['Could not process anatomical structures.']);
      }
    });
  }

  /**
   * Function to compute the Cell Types from the given Data Table.
   *
   * @param data - Sheet data
   * @param - Configurations that consist of the following params,
   *   1. cell_col - The column number in which the cell types are present.
   *   2. uberon_col - The number of columns after which the uberon column can be found.
   *
   * @returns - Array of cell types
   */
export async function makeCellTypes(
    data: Array<Array<string>>,
    config: ASCTBConfig
  ): Promise<Array<CT>> {
    const cellTypes = [];
    return new Promise((res, rej) => {
      data.forEach((row) => {
        const cells = row[config.cell_col].trim().split(',');
        for (const i in cells) {
          if (cells[i] !== '' && !cells[i].startsWith('//')) {
            if (!cellTypes.some((c) => c.structure.trim().toLowerCase() === cells[i].trim().toLowerCase())) {

              // console.log(`name: ${cells[i].trim()}, color: ${row[config.marker_col + 3]}, isNew: ${row[config.marker_col + 2]}`)
              cellTypes.push({
                structure: cells[i].trim(),
                link:
                  row[config.cell_col + config.uberon_col] !== cells[i].trim()
                    ? row[config.cell_col + config.uberon_col]
                    : 'NONE',
                isNew: row[row.length - 2],
                color: row[row.length - 1]
              });
            }
          }
        }
      });
      if (cellTypes.length > 0) {
        res(cellTypes);
      } else {
        rej('Could not process cell types');
      }
    });
  }

  /**
   * Function to compute the Cell Types from the given Data Table.
   *
   * @param data - Sheet data
   * @param - Configurations that consist of the following params,
   *   1. marker_col - The column number in which the biomarkers are present.
   *
   * @returns - Array of biomarkers
   */
export async function makeBioMarkers(
    data: Array<Array<string>>,
    config: ASCTBConfig
  ): Promise<Array<B>> {
    return new Promise((res, rej) => {
      const bioMarkers = [];
      data.forEach((row) => {
        const markers = row[config.marker_col].split(',');

        for (let i = 0 ; i < markers.length; i ++) {
          if (markers[i] !== '' && !markers[i].startsWith('//')) {
            if (!bioMarkers.some((b) => b.structure.toLowerCase() === markers[i].trim().toLowerCase())) {
              bioMarkers.push({
                structure: markers[i].trim(),
                link:  config.uberon_col !== 0
                ? row[config.marker_col + (config.uberon_col * (i + 1))] : 'NONE',
                isNew: row[row.length - 2],
                color: row[row.length - 1]
              });
            }
          }
        }
      });

      if (bioMarkers.length > 0) {
        res(bioMarkers);
      } else {
        rej('Could not process biomarkers');
      }
    });
  }