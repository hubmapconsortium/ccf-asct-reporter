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

export interface ASConfig {
  report_cols: Array<number>,
  cell_col: number,
  marker_col: number,
  uberon_col: number
}
export interface CT {
  structure: string;
  link: string;
  nodeSize: number;
}

export interface B {
  structure: string;
  link: string;
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
  sheet: any;
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
  organSheetData: any;
  rowsToSkip: Array<number> = [];

  constructor(private http: HttpClient, public sc: SconfigService, public report: ReportService) { }
  /**
   * Retruns the parsed data from the google sheet.
   *
   * @param url - The constructed Google Sheet URL
   * @param status - Status to show whether it is getting data from the cache or the google sheets.
   * @param msg - Error message if present.
   * @param header_count - Count of headers to discard while parsing the data.
   *
   */
  public async getDataFromURL(url, status = 200, msg = 'Ok', header_count = this.sheet.header_count): Promise<any> {
    return new Promise(async (res, rej) => {
      try {
        const data = await this.http.get(url, { responseType: 'text' }).toPromise();
        const parsedData = parse(data);
        parsedData.data.splice(0, header_count);

        res({
          data: parsedData.data,
          status,
          msg
        });
      } catch (e) {
        rej(e);
      }
    });
  }

  /**
   * Returns the sheet data. Runs in 2 modes:
   * 1. Development: During development only the cached data is used to prevent the rate limit of google sheets.
   * 2. Production: During production, it extracts sheets from google docs. Incase that fails
   * the data is extracted from the cache.
   *
   */

  public async getSheetData(): Promise<any> {
    let constructedURL = '';
    if (this.sheet.display === 'All Organs') {
      return this.makeAOData();
    } else {
      if (!environment.production) {
        // in development mode
        constructedURL = `assets/data/${this.sheet.name}.csv`;
        const csvData = await this.getDataFromURL(constructedURL);
        this.organSheetData = new Promise(async (res, rej) => {
          res({
            data: csvData.data,
            status: 200,
            msg: 'Ok'
          });
        });

        return await this.getOrganSheetData();
      }

      const sheetId = this.sheet.sheetId;
      const gid = this.sheet.gid;
      constructedURL = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

      try {
        const csvData = await this.getDataFromURL(constructedURL);
        this.organSheetData = new Promise((res, rej) => {
          res({
            data: csvData.data,
            msg: 'Ok',
            status: 200
          });
        });

      } catch (err) {
        constructedURL = `assets/data/${this.sheet.name}.csv`;
        this.report.reportLog(`${this.sheet.display} data fetched from system cache`, 'warning', 'msg');
        const csvData = await this.getDataFromURL(constructedURL, err.status, err.msg);
        this.organSheetData = new Promise((res, rej) => {
          res({
            data: csvData.data,
            msg: 'Ok',
            status: 200
          });
        });
      }
      return await this.getOrganSheetData();
    }
  }

  /**
   * Function to create the All Organs data.
   *
   */

  public async makeAOData() {
    const allOrganData = [];
    let csvData;
    let organData;
    let constructedURL: string;

    for (const organ of this.organs) {
      const organSheet = this.sc.SHEET_CONFIG[this.sc.SHEET_CONFIG.findIndex(i => i.display === organ)];
      if (!environment.production) {
        constructedURL = `assets/data/${organSheet.name}.csv`;
      } else {
        const sheetId = organSheet.sheetId;
        const gid = organSheet.gid;
        constructedURL = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
      }

      try {
        csvData = await this.getDataFromURL(constructedURL);
        organData = csvData.data;
      } catch (err) {
        console.log(err);
        constructedURL = `assets/data/${organSheet.name}.csv`;
        this.report.reportLog(`${organSheet.display} data fetched from system cache`, 'warning', 'msg');
        csvData = await this.getDataFromURL(constructedURL);
        organData = csvData.data;
      }

      organData.forEach(row => {
        const od = ['Body', organ, organ, row[organSheet.cell_col], row[organSheet.cell_col + organSheet.uberon_col], row[organSheet.marker_col]];
        allOrganData.push(od);
      });
    }

    this.organSheetData = new Promise((res, rej) => {
      res({
        data: allOrganData,
        status: 200,
        msg: 'Ok'
      });
    });
    return await this.getOrganSheetData();
  }

  /**
   * Helper function to return the organ data once it has been computed.
   *
   */

  public async getOrganSheetData() {
    return await this.organSheetData;
  }

  /**
   * Returns the array of biomarkers that are sorted have their degrees calculated.
   * @param data - Sheet data
   */

  public async makeMarkerDegree(data) {
    const markerDegrees = [];

    data.forEach(row => {
      const markers = row[this.sheet.marker_col].split(',');
      const cells = row[this.sheet.cell_col].split(',').map(str => str.trim()).filter(c => c !== '');

      for (const i in markers) {
        if (markers[i] !== '' && !markers[i].startsWith('//')) {
          const foundMarker = markerDegrees.findIndex(r => r.structure.toLowerCase().trim() === markers[i].toLowerCase().trim());
          if (foundMarker === -1) {
            const nm = new Marker(markers[i].trim(), cells.length);
            nm.parents.push(...cells.map(cell => cell.toLowerCase()));
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

    markerDegrees.sort((a, b) => (b.parents.length - a.parents.length));
    return markerDegrees;
  }

  /**
   * Returns the array of cell types that are sorted have their degrees calculated.
   * @param data - Sheet data
   * @param treeData - Data from the tree visualization.
   * @param degree - Degree configuration. Can be Degree, Indegree and Outdegree
   */

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
                const cells = row[this.sheet.cell_col].split(',');
                for (const i in cells) {
                  if (cells[i] !== '' && !cells[i].startsWith('//')) {
                    const foundCell = cellDegrees.findIndex(c => c.structure.toLowerCase().trim() === cells[i].toLowerCase().trim());
                    if (foundCell === -1) {
                      const nc = new Cell(cells[i].trim().toLowerCase()
                        .split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '));
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
          const markers = row[this.sheet.marker_col].split(',').map(str => str.trim().toLowerCase()).filter(c => c !== '');
          const cells = row[this.sheet.cell_col].split(',').map(str => str.trim()).filter(c => c !== '');

          for (const c in cells) {
            if (cells[c] !== '' && !cells[c].startsWith('//')) {
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

  /**
   * Returns an array of objects of anatomical structures.
   *
   * @param {Array<Array<string>>} data - Sheet data
   * @param {ASConfig} config - Configurations that consist of the following params,
   *   1. report_cols - The cols that are to be considered to form the data. This includes AS, and CT col numbers.
   *   2. cell_col - The column number in which the cell types are present.
   *   3. marker_col - The column number in which the biomarkers are present.
   *   4. uberon_col - The number of columns after which the uberon column can be found.
   *
   */

  public makeAS(
    data: Array<Array<string>>,
    config:ASConfig = {
      report_cols: this.sheet.report_cols,
      cell_col: this.sheet.cell_col,
      marker_col: this.sheet.marker_col,
      uberon_col: this.sheet.uberon_col
    }
  ): Promise<Array<AS>> {
    return new Promise((res, rej) => {
      const anatomicalStructures = [];
      const cols = config.report_cols;
      data.forEach(row => {
        for (const col in cols) {
          if (cols[col] !== config.cell_col && cols[col] !== config.marker_col) {
            const structure = row[cols[col]];
            if (structure.startsWith('//')) {
              continue;
            }

            if (structure !== '') {
              if (!anatomicalStructures.some(i => i.structure.toLowerCase() === structure.toLowerCase())) {
                anatomicalStructures.push({
                  structure,
                  uberon: row[cols[col] + config.uberon_col].toLowerCase() !== structure.toLowerCase() ? row[cols[col] + config.uberon_col] : ''
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

  /**
   * Returns an array of objects of cell types.
   *
   * @param data - Sheet data
   * @param cell_col - The column number in which the cell types are present.
   * @param uberon_col - The number of columns after which the uberon column can be found.
   *
   */

  public makeCellTypes(
    data,
    cell_col: number = this.sheet.cell_col,
    uberon_col = this.sheet.uberon_col): Promise<Array<CT>> {
    const cellTypes = [];
    return new Promise((res, rej) => {
      data.forEach(row => {
        const cells = row[cell_col].trim().split(',');
        for (const i in cells) {
          if (cells[i] !== '' && !cells[i].startsWith('//')) {
            if (!cellTypes.some(c => c.structure.trim().toLowerCase() === cells[i].trim().toLowerCase())) {
              cellTypes.push({
                structure: cells[i].trim(),
                link: row[cell_col + uberon_col] !== cells[i].trim() ? row[cell_col + uberon_col] : 'NONE'
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

  /**
   * Returns an array of objects of cell types.
   *
   * @param data - Sheet data
   * @param marker_col - The column number in which the biomarkers are present.
   *
   */

  public makeBioMarkers(data, marker_col = this.sheet.marker_col, ): Promise<Array<B>> {
    return new Promise((res, rej) => {
      const bioMarkers = [];
      data.forEach(row => {
        const markers = row[marker_col].split(',');
        for (const i in markers) {
          if (markers[i] !== '' && !markers[i].startsWith('//')) {
            if (!bioMarkers.some(b => b.structure.toLowerCase() === markers[i].trim().toLowerCase())) {
              bioMarkers.push({
                structure: markers[i].trim(),
                link: 'NONE'
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
