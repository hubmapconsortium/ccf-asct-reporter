import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { parse } from 'papaparse';
import { SconfigService } from './sconfig.service';
import { ReportService } from '../report/report.service';
import { environment } from './../../environments/environment';
import {Router} from '@angular/router';

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
  providedIn: 'root',
})
export class SheetService {
  // NAVBAR SHEET SELECTION
  sheet: any;
  organs = [
    'Brain',
    'Spleen',
    'Kidney',
    'Liver',
    'Lung',
    'Lymph Nodes',
    'Heart',
    'Small Intestine',
    'Large Intestine',
    'Skin',
  ];
  organSheetData: any;
  rowsToSkip: Array<number> = [];
  loadingStatus = new EventEmitter();
  changeDataVersion = new EventEmitter();

  constructor(
    private http: HttpClient,
    public sc: SconfigService,
    public report: ReportService,
    public router: Router
  ) { }

  /**
   * Returns the parsed data  by extracting it from google sheets.
   *
   * @param {string} url - The constructed Google Sheet URL
   * @param {string} status - Status to show whether it is getting data from the cache or the google sheets.
   * @param {number} msg - Error message if present.
   * @param {number} header_count - Count of headers to discard while parsing the data.
   *
   * @returns {Promise} - An object that has the data, status and return message
   */
  public async getDataFromURL(url: string, header_count = 11): Promise<any> {
    return new Promise(async (res, rej) => {
      try {
        const data = await this.http
          .get(url, { responseType: 'text' })
          .toPromise();
        const parsedData = parse(data);
        parsedData.data.splice(0, header_count);

        res({
          data: parsedData.data,
        });
      } catch (e) {
        // console.log('GFDU', e)
        rej({
          msg: e.statusText,
          status: e.status,
        });
      }
    });
  }

  /**
   * Returns the sheet data. Runs in 2 modes:
   * 1. Development: During development only the cached data is used to prevent the rate limit of google sheets.
   * 2. Production: During production, it extracts sheets from google docs. Incase that fails
   * the data is extracted from the cache.
   *
   * @returns {Promise} - An object that has - CSV data, status and return message
   */
  public async getSheetData(
    currentSheet: any,
    dataVersion?: string
  ): Promise<any> {
    let constructedURL = '';
    let responseStatus = 200;
    let csvData: any;
    
    this.loadingStatus.emit(currentSheet.display);

    if (currentSheet.display === 'All Organs') {
      const data = await this.makeAOData(dataVersion);
      if (data.status === 404) {
        return data
      }
      return data
    } else {
      if (!environment.production) {
        // in development mode
        if (dataVersion ===  '') {
          return {
            data: [], msg: 'Not Found', status: 404
          }
        }
        
        if (dataVersion === 'latest') {
          dataVersion = this.sc.VERSIONS[1].folder;
          this.changeDataVersion.emit(this.sc.VERSIONS[1]);
          this.report.reportLog(
            `<code>${this.sc.VERSIONS[1].display}</code> ${currentSheet.display} data fetched from system cache. [DEV]`,
            'warning',
            'msg'
          );
        }

        if (this.sc.VERSIONS.findIndex(i => i.folder === dataVersion) === -1) {return {data: [], msg: 'Not Found', status: 404}}
        constructedURL = `assets/data/${dataVersion}/${currentSheet.name}.csv`;
        const csvData = await this.getDataFromURL(constructedURL);

        this.organSheetData = {
          data: csvData.data,
          status: 200,
          msg: 'Data fetched from system cache. [DEV]',
        };

        return await this.getOrganSheetData();
      }

      if (dataVersion !== 'latest') {
        const v = this.sc.VERSIONS.findIndex(i => i.folder === dataVersion);
        if (v===-1) return {data: [], msg: 'Not Found', status: 404}

        constructedURL = `assets/data/${dataVersion}/${currentSheet.name}.csv`;

        await this.getDataFromSystemCache(constructedURL);
        this.changeDataVersion.emit(this.sc.VERSIONS[v]);
        this.report.reportLog(
          `<code>${this.sc.VERSIONS[1].display}</code> ${currentSheet.display} data fetched from system cache.`,
          'warning',
          'msg'
        );
        return await this.getOrganSheetData();
      }

      const sheetId = currentSheet.sheetId;
      const gid = currentSheet.gid;
      constructedURL = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

      try {
        csvData = await this.getDataFromURL(constructedURL);
        this.organSheetData = {
          data: csvData.data,
          msg: 'Data fetched from Google Sheets',
          status: 200,
        };
      } catch (err) {
        responseStatus = err.status;
        constructedURL = `${this.sc.SERVER_URL}/${sheetId}/${gid}`;

        try {
          await this.getDataFromNodeServer(constructedURL);
          this.report.reportLog(
            `<code>Latest</code> ${currentSheet.display} data fetched from Node server`,
            'warning',
            'msg'
          );
        } catch (nodeErr) {
          responseStatus = nodeErr;
        }
      } finally {
        if (responseStatus === 500) {
          if (dataVersion === 'latest') {
            dataVersion = this.sc.VERSIONS[1].folder;
            this.changeDataVersion.emit(this.sc.VERSIONS[1]);
          }
          this.changeDataVersion.emit(this.sc.VERSIONS[1]);

          constructedURL = `assets/data/${dataVersion}/${currentSheet.name}.csv`;
          this.report.reportLog(
            `<code>${this.sc.VERSIONS[1].display}</code> ${currentSheet.display} data fetched from system cache`,
            'warning',
            'msg'
          );
          try {
            await this.getDataFromSystemCache(constructedURL);
          } catch (err) {
            console.log(err);
          }
        }
      }
      return await this.getOrganSheetData();
    }
  }

  public async getDataFromNodeServer(url: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const csvData = await this.getDataFromURL(url);
        this.organSheetData = {
          data: csvData.data,
          msg: 'Data fetched from Node Server',
          status: 206,
        };
        resolve(true);
      } catch (nodeErr) {
        this.organSheetData = {
          data: [],
          msg: 'Failed to get data',
          status: 500,
        };
        reject(nodeErr.status);
      }
    });
  }

  public async getDataFromSystemCache(url: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const csvData = await this.getDataFromURL(url);

        this.organSheetData = {
          data: csvData.data,
          msg: 'Data fetched from system cache',
          status: 500,
        };
        resolve(true);
      } catch (err) {
        console.log(err);
        reject('Failed to get data.');
      }
    });
  }

  /**
   * Function to create the All Organs data.
   *
   * @returns {Promise} - An object that has - CSV data, status and return message
   */
  public async makeAOData(dataVersion: string) {
    const allOrganData = [];
    let csvData: any;
    let organData: any;
    let responseMsg = 'Ok';
    let responseStatus = 200;

    for (const organ of this.organs) {
      const idx = this.sc.SHEET_CONFIG.findIndex((i) => i.display === organ)
      let organSheet;
      try {
        if (idx === -1) throw new TypeError("Invalid data")
        organSheet = this.sc.SHEET_CONFIG[idx];
        csvData = await this.getSheetData(organSheet, dataVersion);
        organData = csvData.data;
        responseMsg = csvData.msg;
        responseStatus = csvData.status;
      } catch (err) {
        console.log(err);
        this.router.navigateByUrl('/error');
        return err
      }

      organData.forEach((row) => {
        const organRow = [
          'Body',
          organ,
          organ,
          row[organSheet.cell_col],
          row[organSheet.cell_col + organSheet.uberon_col],
          row[organSheet.marker_col],
        ];
        allOrganData.push(organRow);
      });
    }

    this.organSheetData = {
      data: allOrganData,
      status: responseStatus,
      msg: responseMsg,
    };
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
   * Function to compute the Anatomical Structures from the given Data Table.
   *
   * @param {Array<Array<string>>} data - Sheet data
   * @param {ASCTBConfig} config - Configurations that consist of the following params,
   *   1. report_cols - The cols that are to be considered to form the data. This includes AS, and CT col numbers.
   *   2. cell_col - The column number in which the cell types are present.
   *   3. marker_col - The column number in which the biomarkers are present.
   *   4. uberon_col - The number of columns after which the uberon column can be found.
   *
   * @returns {Promise} - Array of anatomical structures
   *
   */
  public makeAS(
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
   * @param {Array<Array<string>>} data - Sheet data
   * @param {ASCTBConfig} - Configurations that consist of the following params,
   *   1. cell_col - The column number in which the cell types are present.
   *   2. uberon_col - The number of columns after which the uberon column can be found.
   *
   * @returns {Promise} - Array of cell types
   */
  public makeCellTypes(
    data: Array<Array<string>>,
    config: ASCTBConfig
  ): Promise<Array<CT>> {
    const cellTypes = [];
    return new Promise((res, rej) => {
      data.forEach((row) => {
        const cells = row[config.cell_col].trim().split(',');
        for (const i in cells) {
          if (cells[i] !== '' && !cells[i].startsWith('//')) {
            if (
              !cellTypes.some(
                (c) =>
                  c.structure.trim().toLowerCase() ===
                  cells[i].trim().toLowerCase()
              )
            ) {
              cellTypes.push({
                structure: cells[i].trim(),
                link:
                  row[config.cell_col + config.uberon_col] !== cells[i].trim()
                    ? row[config.cell_col + config.uberon_col]
                    : 'NONE',
              });
            }
          }
        }
      });
      if (cellTypes.length > 0) {
        res(cellTypes);
      } else {
        rej(['Could not process cell types']);
      }
    });
  }

  /**
   * Function to compute the Cell Types from the given Data Table.
   *
   * @param {Array<Array<string>>} data - Sheet data
   * @param {ASCTBConfig} - Configurations that consist of the following params,
   *   1. marker_col - The column number in which the biomarkers are present.
   *
   * @returns {Promise} - Array of biomarkers
   */
  public makeBioMarkers(
    data: Array<Array<string>>,
    config: ASCTBConfig
  ): Promise<Array<B>> {
    return new Promise((res, rej) => {
      const bioMarkers = [];
      data.forEach((row) => {
        const markers = row[config.marker_col].split(',');
        for (const i in markers) {
          if (markers[i] !== '' && !markers[i].startsWith('//')) {
            if (
              !bioMarkers.some(
                (b) =>
                  b.structure.toLowerCase() === markers[i].trim().toLowerCase()
              )
            ) {
              bioMarkers.push({
                structure: markers[i].trim(),
                link: 'NONE',
              });
            }
          }
        }
      });

      if (bioMarkers.length > 0) {
        res(bioMarkers);
      } else {
        rej(['Could not process biomarkers']);
      }
    });
  }
}
