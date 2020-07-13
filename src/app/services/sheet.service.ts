import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { parse } from 'papaparse';
import { SconfigService } from './sconfig.service';
import { ReportService } from '../report/report.service';
import { environment } from './../../environments/environment';

export class Marker {
  structure: string;
  parents: Array<string>;
  count: number;

  constructor(structure, count) {
    this.structure = structure;
    this.parents = [];
    this.count = count;
  }
}

export class Cell {
  structure: string;
  parents: Array<string>;

  constructor(structure) {
    this.structure = structure;
    this.parents = [];
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

export class Organ {
  body: string;
  organ: string;
  cellType: string;
  markers: string;
  organRow: Array<Organ>;
}

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  // NAVBAR SHEET SELECTION
  sheet;
  organs = [
    'Spleen',
    'Kidney',
    'Liver',
    'Lymph Nodes',
    'Heart',
    'Small Intestine',
    'Large Intestine',
    'Skin'
  ];

  constructor(private http: HttpClient, public sc: SconfigService, public report: ReportService) { }

  public async getSheetData(): Promise<any> {

    // console.log(environment);

    if (this.sheet.display === 'All Organs') {
      return this.makeAOData();
    } else {
      let sheetId = this.sheet.sheetId;
      let gid = this.sheet.gid;
      let constructedURL = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`

      return this.http.get(constructedURL, { responseType: 'text' }).toPromise()
        .then(async (data) => {
          let parsedData = parse(data);
          parsedData.data.splice(0, this.sheet.header_count);
          return {
            data: parsedData.data,
            status: 200,
            msg: 'Ok'
          }
        })
        .catch(async (err) => {
          const constructedURL = `assets/data/${this.sheet.name}.csv`;
          let data = await this.http.get(constructedURL, { responseType: 'text' }).toPromise();
          let parsedData = parse(data);
          parsedData.data.splice(0, this.sheet.header_count);
          this.report.reportLog(`${this.sheet.display} data fetched from system cache`, 'warning', 'msg');

          return {
            data: parsedData.data,
            status: err.status,
            msg: err.message
          };
        })

    }
  }


  public async makeAOData() {
    const allOrganData = [];
    for (const organ of this.organs) {
      const organSheet = this.sc.SHEET_CONFIG[this.sc.SHEET_CONFIG.findIndex(i => i.display === organ)];
      const constructedURL = `assets/data/${organSheet.name}.csv`;
      const csvData = await this.http.get(constructedURL, { responseType: 'text' }).toPromise();
      const parsedData = parse(csvData);
      parsedData.data.splice(0, organSheet.header_count);
      const organData = parsedData.data;

      organData.forEach(row => {
        const od = ['Body', organ, row[organSheet.cell_row], row[organSheet.marker_row]];
        allOrganData.push(od);
      });
    }

    return {
      data: allOrganData,
      status: 200,
      msg: "Ok"
    };;
  }

  public async makeMarkerDegree(data) {
    const markerDegrees = [];

    data.forEach(row => {
      const markers = row[this.sheet.marker_row].split(',');
      const cells = row[this.sheet.cell_row].split(',').map(str => str.trim()).filter(c => c !== '');

      for (const i in markers) {
        if (markers[i] !== '') {
          const foundMarker = markerDegrees.findIndex(r => r.structure.toLowerCase().trim() === markers[i].toLowerCase().trim());
          if (foundMarker === -1) {
            const nm = new Marker(markers[i].trim(), cells.length);
            nm.parents.push(...cells.map(cell => cell.toLowerCase()));
            markerDegrees.push(nm);
          } else {
            const m = markerDegrees[foundMarker];
            for (const c in cells) {
              if (cells[c] !== '') {
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

    markerDegrees.sort((a, b) => (b.parents.length - a.parents.length));
    return markerDegrees;
  }

  public async makeCellDegree(data, treeData, degree): Promise<Array<Cell>> {
    return new Promise((res, rej) => {
      const cellDegrees: Array<Cell> = [];

      // calculating in degree (AS -> CT)
      if (degree === 'Degree' || degree === 'Indegree') {
        treeData.forEach(td => {
          if (td.children === 0) {
            const leaf = td.name;

            data.forEach(row => {
              let parent;
              parent = row.find(i => i.toLowerCase() === leaf.toLowerCase());

              if (parent) {
                const cells = row[this.sheet.cell_row].split(',');
                for (const i in cells) {
                  if (cells[i] !== '') {
                    const foundCell = cellDegrees.findIndex(c => c.structure.toLowerCase().trim() === cells[i].toLowerCase().trim());
                    if (foundCell === -1) {
                      const nc = new Cell(cells[i].trim().toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '));
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
        data.forEach(row => {
          const markers = row[this.sheet.marker_row].split(',').map(str => str.trim().toLowerCase()).filter(c => c !== '');
          const cells = row[this.sheet.cell_row].split(',').map(str => str.trim()).filter(c => c !== '');

          for (const c in cells) {
            if (cells[c] !== '') {
              const cd = cellDegrees.findIndex(i => i.structure.toLowerCase() === cells[c].toLowerCase());
              if (cd !== -1) {
                for (const m in markers) {
                  if (!cellDegrees[cd].parents.includes(markers[m].toLowerCase())) {
                    cellDegrees[cd].parents.push(markers[m]);
                  }
                }
              } else {
                const nc = new Cell(cells[c].trim().toLowerCase().split(' ')
                  .map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '));
                nc.parents.push(...markers);
                cellDegrees.push(nc);
              }
            }
          }
        });
      }

      cellDegrees.sort((a, b) => (b.parents.length - a.parents.length));
      res(cellDegrees);
    });
  }

  public makeAS(data): Promise<Array<AS>> {
    return new Promise((res, rej) => {
      const anatomicalStructures = [];
      const cols = this.sheet.report_cols;
      data.forEach(row => {
        for (const col in cols) {
          if (cols[col] !== this.sheet.cell_row && cols[col] !== this.sheet.marker_row) {
            const structure = row[cols[col]];
            if (structure.startsWith('//')) {
              continue;
            }

            if (structure !== '') {
              if (!anatomicalStructures.some(i => i.structure.toLowerCase() === structure.toLowerCase())) {
                anatomicalStructures.push({
                  structure: structure.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '),
                  uberon: row[cols[col] + this.sheet.uberon_row]
                });
              }
            }
          }
        }
      });

      if (anatomicalStructures.length > 0) { res(anatomicalStructures); }
      else { rej(['Could not process anatomical structures.']); }
    });
  }

  public makeCellTypes(data): Promise<Array<CT>> {
    const cellTypes = [];
    return new Promise((res, rej) => {
      data.forEach(row => {
        const cells = row[this.sheet.cell_row].trim().split(',');
        for (const i in cells) {
          if (cells[i] !== '') {
            if (!cellTypes.some(c => c.structure.trim().toLowerCase() === cells[i].trim().toLowerCase())) {
              cellTypes.push({
                structure: cells[i].toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ').trim(),
                link: row[this.sheet.cell_row + this.sheet.uberon_row]
              });
            }
          }
        }
      });
      if (cellTypes.length > 0) {
        res(cellTypes);
      }
      else { rej(['Could not process cell types']); }
    });
  }

  public makeBioMarkers(data): Promise<Array<B>> {
    return new Promise((res, rej) => {
      const bioMarkers = [];
      data.forEach(row => {
        const markers = row[this.sheet.marker_row].split(',');
        for (const i in markers) {
          if (markers[i] !== '') {
            if (!bioMarkers.some(b => b.structure.toLowerCase() === markers[i].trim().toLowerCase())) {
              bioMarkers.push({
                structure: markers[i].trim().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '),
              });
            }
          }
        }
      });

      if (bioMarkers.length > 0) {
        res(bioMarkers);
      }
      else {
        rej(['Could not process biomarkers']);
      }
    });
  }
}
