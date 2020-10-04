import { Injectable } from '@angular/core';
import { SheetService } from '../services/sheet.service';
import { ReportService } from '../report/report.service';

const CT_BLUE = '#377EB8';
const B_GREEN = '#4DAF4A';
const groupNameMapper = {
  1: 'Anatomical Structures',
  2: 'Cell Types',
  3: 'Biomarkers',
};

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

export class BMNode {
  name: string;
  group: number;
  groupName: string;
  fontSize: number;
  x: number;
  y: number;
  id: number;
  color: string;
  nodeSize: number;
  targets: Array<number>;
  sources: Array<number>;
  uberonId: string;
  problem: boolean;
  pathColor: string;
  isNew: boolean;

  constructor(
    name,
    group,
    x,
    y,
    fontSize,
    uberonId = '',
    color = '#E41A1C',
    nodeSize = 300
  ) {
    this.name = name;
    this.group = group;
    this.fontSize = fontSize;
    this.x = x;
    this.y = y;
    this.color = color;
    this.nodeSize = nodeSize === 0 ? 50 : nodeSize;
    this.targets = [];
    this.sources = [];
    this.groupName = groupNameMapper[group];
    this.uberonId = uberonId;
    this.pathColor = '#ccc';
    this.isNew = false;
  }
}

export interface Link {
  s: number;
  t: number;
}

export interface DD {
  name: string;
}
export interface ASCTD {
  nodes: Array<BMNode>;
  links: Array<Link>;
  compareDD?: Array<DD>;
  searchIds?: Array<number>;
}

@Injectable({
  providedIn: 'root',
})
export class BimodalService {
  asctData: any;
  constructor(public sheet: SheetService, public report: ReportService) {}

  async makeASCTData(
    sheetData,
    treeData,
    bimodalConfig,
    currentSheet,
    compareData?
  ) {
    let ASCTGraphData: ASCTD;
    const links = [];
    const nodes = [];
    let treeX = 0;
    let treeY = 50;
    const distance = currentSheet.config.bimodal_distance;
    let id = 0;
    let biomarkers = [];

    for (const sheet of compareData) {
      for (const row of sheet.data) {
        sheetData.push(row);
      }
    }

    // making anatomical structures (last layer of the tree)
    treeData.forEach((td) => {
      if (td.children === 0) {
        const leaf = td.name;
        const newLeaf = new BMNode(leaf, 1, td.x, td.y - 5, 14, td.uberonId);
        newLeaf.id = id;
        newLeaf.problem = td.problem;
        newLeaf.pathColor = td.pathColor;
        newLeaf.isNew = td.isNew;
        newLeaf.color = td.color;
        nodes.push(newLeaf);
        id += 1;
        treeX = td.x;
      }
    });

    // adding x distance to build the next layer of bimodal
    treeX += distance;

    // making group 2: cell type
    let cellTypes = [];

    // sorting cells based on options
    if (bimodalConfig.CT.sort === 'Alphabetically') {
      cellTypes = await this.sheet.makeCellTypes(sheetData, {
        report_cols: currentSheet.report_cols,
        cell_col: currentSheet.cell_col,
        uberon_col: currentSheet.uberon_col,
        marker_col: currentSheet.marker_col,
      });
      cellTypes.sort((a, b) => {
        return a.structure.toLowerCase() > b.structure.toLowerCase()
          ? 1
          : b.structure.toLowerCase() > a.structure.toLowerCase()
          ? -1
          : 0;
      });
    } else {
      if (bimodalConfig.CT.size === 'None') {
        cellTypes = await this.makeCellDegree(
          sheetData,
          treeData,
          'Degree',
          currentSheet
        );
      } else {
        cellTypes = await this.makeCellDegree(
          sheetData,
          treeData,
          bimodalConfig.CT.size,
          currentSheet
        );
      }
    }

    if (bimodalConfig.CT.size !== 'None') {
      // put sort size by degree function here
      const tempCellTypes = await this.makeCellDegree(
        sheetData,
        treeData,
        bimodalConfig.CT.size,
        currentSheet
      );
      cellTypes.forEach((c) => {
        const idx = tempCellTypes.findIndex(
          (i) => i.structure.toLowerCase() === c.structure.toLowerCase()
        );
        if (idx !== -1) {
          c.nodeSize = tempCellTypes[idx].parents.length * 75;
        } else {
          this.report.reportLog(
            `Parent not found for cell - ${c.structure}`,
            'warning',
            'msg'
          );
        }
      });
    }

    cellTypes.forEach((cell) => {
      const newNode = new BMNode(
        cell.structure,
        2,
        treeX,
        treeY,
        14,
        cell.link,
        CT_BLUE,
        cell.nodeSize
      );
      newNode.id = id;
      newNode.isNew = cell.isNew;
      newNode.pathColor = cell.color;

      if (newNode.isNew) {
        newNode.color = cell.color;
      }
      nodes.push(newNode);
      treeY += 50;
      id += 1;
    });

    treeY = 50;
    treeX += distance;

    // based on select input, sorting markers
    if (bimodalConfig.BM.sort === 'Alphabetically') {
      biomarkers = await this.sheet.makeBioMarkers(sheetData, {
        marker_col: currentSheet.marker_col,
        uberon_col: currentSheet.uberon_col
      });
      biomarkers.sort((a, b) => {
        return a.structure.toLowerCase() > b.structure.toLowerCase()
          ? 1
          : b.structure.toLowerCase() > a.structure.toLowerCase()
          ? -1
          : 0;
      });
    } else {
      biomarkers = await this.makeMarkerDegree(sheetData, currentSheet);
    }

    if (bimodalConfig.BM.size === 'Degree') {
      const tempBiomarkers = await this.makeMarkerDegree(
        sheetData,
        currentSheet
      );
      biomarkers.forEach((b) => {
        const idx = tempBiomarkers.findIndex(
          (i) => i.structure === b.structure
        );
        if (idx !== -1) {
          b.nodeSize = tempBiomarkers[idx].parents.length * 75;
        } else {
          this.report.reportLog(
            `Parent not found for biomarker - ${b.structure}`,
            'warning',
            'msg'
          );
        }
      });
    }

    // making group 3: bio markers
    biomarkers.forEach((marker, i) => {
      const newNode = new BMNode(
        biomarkers[i].structure,
        3,
        treeX,
        treeY,
        14,
        biomarkers[i].link,
        B_GREEN,
        biomarkers[i].nodeSize
      );
      newNode.id = id;
      newNode.isNew = marker.isNew;
      newNode.pathColor = marker.color;

      if (newNode.isNew) {
        newNode.color = marker.color;
      }
      nodes.push(newNode);
      treeY += 40;
      id += 1;
    });

    // AS to CT
    let parent = 0;

    for (const i in treeData) {
      if (treeData[i].children === 0) {
        parent = nodes.findIndex(
          (r) => r.name.toLowerCase() === treeData[i].name.toLowerCase()
        );

        sheetData.forEach((row) => {
          for (const j in row) {
            if (row[j] === treeData[i].name) {
              const cells = row[currentSheet.cell_col].split(',');
              for (const c in cells) {
                if (cells[c] !== '') {
                  const found = nodes.findIndex(
                    (r) =>
                      r.name.toLowerCase().trim() ===
                      cells[c].toLowerCase().trim()
                  );
                  if (found !== -1) {
                    if (nodes[parent].targets.indexOf(found) === -1) {
                      nodes[parent].targets.push(found);
                    }
                    if (nodes[found].sources.indexOf(parent) === -1) {
                      nodes[found].sources.push(parent);
                    }

                    nodes[found].pathColor = nodes[parent].pathColor;
                    // nodes[found].isNew = nodes[parent].isNew;

                    if (!links.some((n) => n.s === parent && n.t === found)) {
                      links.push({
                        s: parent,
                        t: found,
                      });
                    }
                  }
                }
              }
            }
          }
        });
      }
    }

    // CT to B
    sheetData.forEach((row) => {
      const markers = row[currentSheet.marker_col].trim().split(',');
      const cells = row[currentSheet.cell_col].trim().split(',');

      for (const c in cells) {
        if (cells[c] !== '') {
          const cell = nodes.findIndex(
            (r) => r.name.toLowerCase().trim() === cells[c].toLowerCase().trim()
          );

          if (cell !== -1) {
            for (const m in markers) {
              if (markers[m] !== '') {
                const marker = nodes.findIndex(
                  (r) =>
                    r.name.toLowerCase().trim() ===
                    markers[m].toLowerCase().trim()
                );
                if (!links.some((n) => n.s === cell && n.t === marker)) {
                  if (nodes[cell].targets.indexOf(marker) === -1) {
                    nodes[cell].targets.push(marker);
                  }
                  // nodes[cell].sources.indexOf(marker) === -1 && nodes[cell].sources.push(marker);
                  if (nodes[marker].sources.indexOf(cell) === -1) {
                    nodes[marker].sources.push(cell);
                  }
                  nodes[marker].pathColor = nodes[cell].pathColor;

                  links.push({
                    s: cell,
                    t: marker,
                  });
                }
              }
            }
          }
        }
      }
    });

    ASCTGraphData = {
      nodes,
      links,
    };

    this.asctData = ASCTGraphData;

    this.report.checkLinks(ASCTGraphData.nodes); // check for missing links to submit to the Log

    return ASCTGraphData;
  }

  public async getASCTData() {
    return this.asctData;
  }

  /**
   * Returns the array of biomarkers that are sorted have their degrees calculated.
   * @param data - Sheet data
   */
  public async makeMarkerDegree(data: any, currentSheet: any) {
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
  public async makeCellDegree(
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
}
