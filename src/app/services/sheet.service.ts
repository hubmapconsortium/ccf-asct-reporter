import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { parse } from 'papaparse';
import { SconfigService } from './sconfig.service';
import { ReportService } from './report.service';
import { Observable } from 'rxjs';

// colors for vis
const AS_RED = "#E41A1C"
const CT_BLUE = "#377EB8"
const B_GREEN = "#4DAF4A"

// Used in the tree visualization
export class TNode {
  id: any;
  name: String;
  parent: String;
  uberon_id: String;
  color: string;
  problem: boolean;

  constructor(id, name, parent, u_id, color = "#808080") {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.uberon_id = u_id;
    this.color = color;
    this.problem = false;
  }
}

// Used in the tree visualization
export class Tree {
  nodes: Array<TNode>;
  id: any;

  constructor(id) {
    this.nodes = [];
    this.id = id;
  }

  public append(node) {
    this.nodes.push(node);
  }

  public search(name, nodeParent) {
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].name == name) {
        let parent = this.nodes.findIndex(i => i.name == nodeParent.name)
        if (this.nodes[parent].id != this.nodes[i].parent) {
          this.nodes[i].problem = true;
        }
        return this.nodes[i];
      }
    }
    return {};
  }

}

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

export class BMNode {
  name: string;
  group: number;
  first: string;
  last: string;
  fontSize: number;
  x: number;
  y: number;
  id: number;
  color: string;
  nodeSize: number;

  constructor(name, group, first, last, x, y, fontSize, color = "#808080", nodeSize = 300) {
    this.name = name;
    this.group = group;
    this.first = first;
    this.last = last;
    this.fontSize = fontSize;
    this.x = x;
    this.y = y;
    this.color = color;
    this.nodeSize = nodeSize;
  }
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

export interface AS {
  structure: string;
  uberon: string;
}

export interface CT {
  structure: string;
  link: string;
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
  shouldSortAlphabetically = true;
  shouldSortBySize = false;

  constructor(private http: HttpClient, public sc: SconfigService, public report: ReportService) { }

  public getSheetData(): Promise<any> {
    // let sheetId = this.sheet.sheetId;
    // let gid = this.sheet.gid;    
    // let constructedURL = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`

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
      let cells = row[this.sheet.cell_row].split(',').map(str => str.trim())

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

  public makeAS(data): Promise<Array<AS>> {
    return new Promise((res, rej) => {
      let anatomicalStructures = []
      const cols = this.sheet.report_cols;
      data.forEach(row => {
        for (let col = 0; col < cols.length; col++) {
          if (cols[col] != this.sheet.cell_row && cols[col] != this.sheet.marker_row) {
            let structure = row[cols[col]]
            if (structure != "") {
              if(!anatomicalStructures.some(i=> i.structure.toLowerCase() == structure.toLowerCase())) {
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
            if(!cellTypes.some(c => c.structure.toLowerCase() == cells[i].toLowerCase())) {
              cellTypes.push({
                structure: cells[i].toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '),
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
