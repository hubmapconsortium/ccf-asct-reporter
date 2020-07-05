import { Injectable } from '@angular/core';
import { SheetService } from '../services/sheet.service';
import { ReportService } from '../report/report.service';
import { config } from 'rxjs';

const CT_BLUE = "#377EB8"
const B_GREEN = "#4DAF4A"

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
    this.nodeSize = nodeSize == 0 ? 50 : nodeSize;
  }
}

@Injectable({
  providedIn: 'root'
})
export class BimodalService {

  sheetData;
  updatedTreeData;

  constructor(public sheet: SheetService, public report: ReportService) { }

  async makeASCTData(sheetData, treeData, bimodalConfig) {
    let ASCTGraphData = {}
    let links = [];
    let nodes = [];
    let treeX = 0;
    let treeY = 50;
    let distance = this.sheet.sheet.config.bimodal_distance;
    let id = 0;
    let biomarkers = [];

    // making anatomical structures (last layer of the tree)
    treeData.forEach(td => {
      if (td.children == 0) {
        let leaf = td.name;
        let newLeaf = new BMNode(leaf, 1, leaf, '', treeX, td.y, 14)
        newLeaf.id = id;
        nodes.push(newLeaf)
        id += 1;
      }
    })

    // adding x distance to build the next layer of bimodal
    treeX += distance

    // making group 2: cell type
    let cellTypes = []

    // sorting cells based on options
    if (bimodalConfig.CT.sort == 'Alphabetically') {
      cellTypes = await this.sheet.makeCellTypes(sheetData)
      cellTypes.sort((a, b) => {
        return a.structure.toLowerCase() > b.structure.toLowerCase() ? 1 : ((b.structure.toLowerCase() > a.structure.toLowerCase()) ? -1 : 0)
      })
    } else {
      cellTypes = await this.sheet.makeCellDegree(sheetData, treeData)
    }


    if (bimodalConfig.CT.size == 'Degree') {
      // put sort size by degree function here
      let tempCellTypes = await this.sheet.makeCellDegree(sheetData, treeData)
      cellTypes.forEach(c => {
        let idx = tempCellTypes.findIndex(i => i.structure.toLowerCase() == c.structure.toLowerCase())
        if (idx != -1) {
          c.nodeSize = tempCellTypes[idx].count * 75
        } else {
          this.report.reportLog(`Parent not found for cell - ${c.structure}`, 'warning', 'msg')
        }
      })

    }

    cellTypes.forEach(cell => {
      let newNode = new BMNode(cell.structure, 2, '', cell.structure, treeX, treeY, 14, CT_BLUE, cell.nodeSize)
      newNode.id = id;
      nodes.push(newNode)
      treeY += 50;
      id += 1;
    })

    treeY = 50;
    treeX += distance

    // based on select input, sorting markers

    if (bimodalConfig.BM.sort == 'Alphabetically') {
      biomarkers = await this.sheet.makeBioMarkers(sheetData)
      biomarkers.sort((a, b) => {
        return a.structure.toLowerCase() > b.structure.toLowerCase() ? 1 : ((b.structure.toLowerCase() > a.structure.toLowerCase()) ? -1 : 0)
      })
    } else {
      biomarkers = await this.sheet.makeMarkerDegree(sheetData)
    }

    if (bimodalConfig.BM.size == 'Degree') {
      let tempBiomarkers = await this.sheet.makeMarkerDegree(sheetData)
      biomarkers.forEach(b => {
        let idx = tempBiomarkers.findIndex(i => i.structure == b.structure)
        if (idx != -1) {
          b.nodeSize = tempBiomarkers[idx].count * 75
        } else {
          this.report.reportLog(`Parent not found for biomarker - ${b.structure}`, 'warning', 'msg')
        }
      })
    }

    // making group 3: bio markers
    for (let i = 0; i < biomarkers.length; i++) {
      let newNode = new BMNode(biomarkers[i].structure, 3, '', biomarkers[i].structure, treeX, treeY, 14, B_GREEN, biomarkers[i].nodeSize)
      newNode.id = id;
      nodes.push(newNode)
      treeY += 40;
      id += 1
    }


    // AS to CT
    let parent = 0;

    for (var i = 0; i < treeData.length; i++) {
      if (treeData[i].children == 0) {
        parent = nodes.findIndex(r => r.name.toLowerCase() == treeData[i].name.toLowerCase())

        sheetData.forEach(row => {
          for (var j = 0; j < row.length; j++) {
            if (row[j] == treeData[i].name) {
              let cells = row[this.sheet.sheet.cell_row].split(',')
              for (var c = 0; c < cells.length; c++) {
                if (cells[c] != '') {
                  let found = nodes.findIndex(r => r.name.toLowerCase().trim() == cells[c].toLowerCase().trim())
                  if (found != -1) {
                    links.push({
                      s: parent,
                      t: found
                    })
                  }
                }
              }
            }
          }
        })
      }
    }

    // CT to B
    sheetData.forEach(row => {
      let markers = row[this.sheet.sheet.marker_row].trim().split(',')
      let cells = row[this.sheet.sheet.cell_row].trim().split(',')

      for (var c = 0; c < cells.length; c++) {
        if (cells[c] != '') {
          let cell = nodes.findIndex(r => r.name.toLowerCase().trim() == cells[c].toLowerCase().trim())

          if (cell != -1) {
            for (var m = 0; m < markers.length; m++) {
              if (markers[m] != '') {
                let marker = nodes.findIndex(r => r.name.toLowerCase().trim() == markers[m].toLowerCase().trim())
                if (!links.some(n => n.s === cell && n.t === marker))
                  links.push({
                    s: cell,
                    t: marker
                  })
              }
            }
          }
        }
      }
    })

    ASCTGraphData = {
      nodes: nodes,
      links: links
    }

    return ASCTGraphData
  }

}
