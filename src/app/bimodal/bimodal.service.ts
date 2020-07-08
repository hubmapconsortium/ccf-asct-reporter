import { Injectable } from '@angular/core';
import { SheetService } from '../services/sheet.service';
import { ReportService } from '../report/report.service';
import { config } from 'rxjs';

const CT_BLUE = '#377EB8';
const B_GREEN = '#4DAF4A';

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

  constructor(name, group, first, last, x, y, fontSize, color = '#E41A1C', nodeSize = 300) {
    this.name = name;
    this.group = group;
    this.first = first;
    this.last = last;
    this.fontSize = fontSize;
    this.x = x;
    this.y = y;
    this.color = color;
    this.nodeSize = nodeSize === 0 ? 50 : nodeSize;
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
    let ASCTGraphData = {};
    const links = [];
    const nodes = [];
    let treeX = 0;
    let treeY = 50;
    const distance = this.sheet.sheet.config.bimodal_distance;
    let id = 0;
    let biomarkers = [];

    // making anatomical structures (last layer of the tree)
    treeData.forEach(td => {
      if (td.children === 0) {
        const leaf = td.name;
        const newLeaf = new BMNode(leaf, 1, leaf, '', treeX, td.y, 14);
        newLeaf.id = id;
        nodes.push(newLeaf);
        id += 1;
      }
    });

    // adding x distance to build the next layer of bimodal
    treeX += distance;

    // making group 2: cell type
    let cellTypes = [];

    // sorting cells based on options
    if (bimodalConfig.CT.sort === 'Alphabetically') {
      cellTypes = await this.sheet.makeCellTypes(sheetData);
      cellTypes.sort((a, b) => {
        return (
          a.structure.toLowerCase() > b.structure.toLowerCase() ? 1 : (
            (b.structure.toLowerCase() > a.structure.toLowerCase()) ? -1 : 0)
        );
      });
    } else {
      cellTypes = await this.sheet.makeCellDegree(sheetData, treeData,  bimodalConfig.CT.size);
    }


    if (bimodalConfig.CT.size !== 'None') {
      // put sort size by degree function here
      const tempCellTypes = await this.sheet.makeCellDegree(sheetData, treeData, bimodalConfig.CT.size);
      cellTypes.forEach(c => {
        const idx = tempCellTypes.findIndex(i => i.structure.toLowerCase() === c.structure.toLowerCase());
        if (idx !== -1) {
          c.nodeSize = tempCellTypes[idx].parents.length * 75;
        } else {
          this.report.reportLog(`Parent not found for cell - ${c.structure}`, 'warning', 'msg');
        }
      });

    }

    cellTypes.forEach(cell => {
      const newNode = new BMNode(cell.structure, 2, '', cell.structure, treeX, treeY, 14, CT_BLUE, cell.nodeSize);
      newNode.id = id;
      nodes.push(newNode);
      treeY += 50;
      id += 1;
    });

    treeY = 50;
    treeX += distance;

    // based on select input, sorting markers

    if (bimodalConfig.BM.sort === 'Alphabetically') {
      biomarkers = await this.sheet.makeBioMarkers(sheetData);
      biomarkers.sort((a, b) => {
        return (
          a.structure.toLowerCase() > b.structure.toLowerCase() ? 1 : (
            (b.structure.toLowerCase() > a.structure.toLowerCase()) ? -1 : 0)
        );
      });
    } else {
      biomarkers = await this.sheet.makeMarkerDegree(sheetData);
    }

    if (bimodalConfig.BM.size === 'Degree') {
      const tempBiomarkers = await this.sheet.makeMarkerDegree(sheetData);
      biomarkers.forEach(b => {
        const idx = tempBiomarkers.findIndex(i => i.structure === b.structure);
        if (idx !== -1) {
          b.nodeSize = tempBiomarkers[idx].parents.length * 75;
        } else {
          this.report.reportLog(`Parent not found for biomarker - ${b.structure}`, 'warning', 'msg');
        }
      });
    }

    // making group 3: bio markers
    biomarkers.forEach((item, i) => {
      const newNode = new BMNode(biomarkers[i].structure,
        3,
        '',
        biomarkers[i].structure,
        treeX,
        treeY,
        14,
        B_GREEN,
        biomarkers[i].nodeSize
      );
      newNode.id = id;
      nodes.push(newNode);
      treeY += 40;
      id += 1;
    });



    // AS to CT
    let parent = 0;

    for (const i in treeData) {
      if (treeData[i].children === 0) {
        parent = nodes.findIndex(r => r.name.toLowerCase() === treeData[i].name.toLowerCase());

        sheetData.forEach(row => {
          for (const j in row) {
            if (row[j] === treeData[i].name) {
              const cells = row[this.sheet.sheet.cell_row].split(',');
              for (const c in cells) {
                if (cells[c] !== '') {
                  const found = nodes.findIndex(r => r.name.toLowerCase().trim() === cells[c].toLowerCase().trim());
                  if (found !== -1) {
                    links.push({
                      s: parent,
                      t: found
                    });
                  }
                }
              }
            }
          }
        });
      }
    }

    // CT to B
    sheetData.forEach(row => {
      const markers = row[this.sheet.sheet.marker_row].trim().split(',');
      const cells = row[this.sheet.sheet.cell_row].trim().split(',');

      for (const c in cells) {
        if (cells[c] !== '') {
          const cell = nodes.findIndex(r => r.name.toLowerCase().trim() === cells[c].toLowerCase().trim());

          if (cell !== -1) {
            for (const m in markers) {
              if (markers[m] !== '') {
                const marker = nodes.findIndex(r => r.name.toLowerCase().trim() === markers[m].toLowerCase().trim());
                if (!links.some(n => n.s === cell && n.t === marker)) {
                  links.push({
                    s: cell,
                    t: marker
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
      links
    };

    return ASCTGraphData;
  }

}
