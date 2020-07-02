import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { parse } from 'papaparse';
import { SconfigService } from './sconfig.service';
import { ReportService } from '../report/report.service';
import { environment } from './../../environments/environment';

// Used in the table vis
export class ASCT {
  structure: string;
  uberon: string;
  substructure: string;
  sub_uberon: string;
  sub_2x: string;
  sub_2x_uberon: string;
  sub_3x: string;
  sub_3x_uberon: string;
  sub_4x: string;
  sub_4x_uberon: string;
  cell_types: string;
  cl_id: string;
}


export class Marker {
  structure: string;
  parents: Array<string>;
  count: number;

  constructor(structure, count) {
    this.structure = structure
    this.parents = []
    this.count = count
  }
}

export class Cell {
  structure: string;
  parents: Array<string>;
  count: number;

  constructor(structure, count) {
    this.structure = structure
    this.parents = []
    this.count = count
  }
}

export interface AS {
  structure: string;
  uberon: string;
}

export interface CT {
  structure: string;
  link: string;
  nodeSize: number;
}

export interface B {
  structure: string;
}

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  // NAVBAR SHEET SELECTION
  sheet;

  ASCTGraphData = {};

  // BIOMODAL DATA
  sheetData;
  updatedTreeData;

  constructor(private http: HttpClient, public sc: SconfigService, public report: ReportService) { }

  public getSheetData(): Promise<any> {
    // let sheetId = this.sheet.sheetId;
    // let gid = this.sheet.gid;
    // let constructedURL = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
    console.log(environment)

    let constructedURL = `assets/data/${this.sheet.name}.csv`
    return this.http.get(constructedURL, { responseType: 'text' }).toPromise().then(data => {
      let parsedData = parse(data);
      parsedData.data.splice(0, this.sheet.header_count)
      return parsedData.data
    });
  }

  public async makeMarkerDegree(data) {
    let markerDegrees = []

    data.forEach(row => {
      let markers = row[this.sheet.marker_row].split(',')
      let cells = row[this.sheet.cell_row].split(',').map(str => str.trim()).filter(c => c!= '')

      for (var i = 0; i < markers.length; i++) {
        if (markers[i] != '') {
          let foundMarker = markerDegrees.findIndex(r => r.structure.toLowerCase().trim() == markers[i].toLowerCase().trim())
          if (foundMarker == -1) {
            let nm = new Marker(markers[i].trim(), cells.length)
            nm.parents.push(...cells)
            markerDegrees.push(nm)
          } else {
            let m = markerDegrees[foundMarker]
            for (var c = 0; c < cells.length; c++) {
              if (cells[c] != '') {
                if (!m.parents.includes(cells[c].toLowerCase())) {
                  m.count += 1
                  m.parents.push(cells[c].toLowerCase())
                }
              }
            }
          }
        }
      }
    })

    markerDegrees.sort((a, b) => (b.count - a.count));
    return markerDegrees
  }

  public async makeCellDegree(data, treeData): Promise<Array<Cell>> {
    return new Promise((res, rej) => {
      let cellDegrees = []

      treeData.forEach(td => {
        if (td.children == 0) {
          let leaf = td.name;

          data.forEach(row => {
            let parent;
              parent = row.find(i => i.toLowerCase() == leaf.toLowerCase())

            if (parent) {
              let cells = row[this.sheet.cell_row].split(',')
              for (var i = 0; i < cells.length; i++) {
                if (cells[i] != '') {
                  let foundCell = cellDegrees.findIndex(c => c.structure.toLowerCase().trim() == cells[i].toLowerCase().trim())
                  if (foundCell == -1) {
                    let nc = new Cell(cells[i].trim(), 1)
                    nc.parents.push(parent.toLowerCase())
                    cellDegrees.push(nc)
                  } else {
                    let c = cellDegrees[foundCell]
                    if (!c.parents.includes(parent.toLowerCase())) {
                      c.count += 1
                      c.parents.push(parent.toLowerCase())
                    }
                  }
                }
              }

            }
          })
        }
      })

      cellDegrees.sort((a, b) => (b.count - a.count));
      res(cellDegrees)
    })
  }

  public makeAS(data): Promise<Array<AS>> {
    return new Promise((res, rej) => {
      let anatomicalStructures = []
      const cols = this.sheet.report_cols;
      data.forEach(row => {
        for (let col = 0; col < cols.length; col++) {
          if (cols[col] != this.sheet.cell_row && cols[col] != this.sheet.marker_row) {
            let structure = row[cols[col]]
            if (structure != "") {
              if (!anatomicalStructures.some(i => i.structure.toLowerCase() == structure.toLowerCase())) {
                anatomicalStructures.push({
                  structure: structure.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '),
                  uberon: row[cols[col] + this.sheet.uberon_row]
                })
              }
            }
          }
        }
      })

      if (anatomicalStructures.length > 0) res(anatomicalStructures)
      else rej(["Could not process anatomical structures."])
    })
  }

  public makeCellTypes(data): Promise<Array<CT>> {
    let cellTypes = []
    return new Promise((res, rej) => {
      data.forEach(row => {
        let cells = row[this.sheet.cell_row].trim().split(',')
        for (let i = 0; i < cells.length; i++) {
          if (cells[i] != "") {
            if (!cellTypes.some(c => c.structure.trim().toLowerCase() == cells[i].trim().toLowerCase())) {
              cellTypes.push({
                structure: cells[i].toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ').trim(),
                link: row[this.sheet.cell_row + this.sheet.uberon_row]
              })
            }
          }
        }
      })
      if (cellTypes.length > 0)
        res(cellTypes)
      else rej(["Could not process cell types"])
    })
  }

  public makeBioMarkers(data): Promise<Array<B>> {
    return new Promise((res, rej) => {
      let bioMarkers = []
      data.forEach(row => {
        let markers = row[this.sheet.marker_row].split(',')
        for (let i = 0; i < markers.length; i++) {
          if (markers[i] !== "") {
            if (!bioMarkers.some(b => b.structure.toLowerCase() == markers[i].trim().toLowerCase())) {
              bioMarkers.push({
                structure: markers[i].trim().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '),
              })
            }
          }
        }
      })

      if (bioMarkers.length > 0)
        res(bioMarkers)
      else
        rej(["Could not process biomarkers"])
    })
  }

  /**
    * Generate data from the Google Sheet to be represented in the table vis.
    * @param  {[Array]} data Google Sheet data
    * @returns {[Array]}     Objects to build the table
    */
  public makeTableData(data) {
    let tableData = [];

    data.forEach(ele => {
      let entry = new ASCT();
      entry.structure = ele[0]
      entry.uberon = ele[2]
      entry.substructure = ele[3]
      entry.sub_uberon = ele[5]
      entry.sub_2x = ele[6]
      entry.sub_2x_uberon = ele[8]
      entry.sub_3x = ele[9]
      entry.sub_3x_uberon = ele[10]
      entry.sub_4x = ele[12]
      entry.sub_4x_uberon = ele[14]
      entry.cell_types = ele[15]
      entry.cl_id = ele[17]

      tableData.push(entry)
    })
    return tableData;
  }

}
