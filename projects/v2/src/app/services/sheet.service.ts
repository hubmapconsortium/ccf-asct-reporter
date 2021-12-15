import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL, getAssetsURL } from './../static/url';
import { Observable, throwError } from 'rxjs';
import {  map } from 'rxjs/operators';
import { SheetInfo, Structure } from '../models/sheet.model';

@Injectable({
  providedIn: 'root'
})
export class SheetService {
  constructor(private http: HttpClient) {}

  /**
   * Service to fetch the data for a sheet from CSV file or Google sheet using the api
   * @param sheetId id of the sheet
   * @param gid gid of the sheet
   * @param csvFileUrl is the optional parameter that contains the value to the csv file url of the sheet
   */
  fetchSheetData(
    sheetId: string,
    gid: string,
    csvFileUrl?: string,
    formData?: FormData,
    output?: string,
    cache = false
  ) {
    if (csvFileUrl) {
      return this.http.get(`${URL}/v2/csv`, {
        responseType: output === 'owl' ? 'text' : undefined,
        params: {
          csvUrl: csvFileUrl,
          output: output ? output : 'json'
        },
      });
    } else if (formData) {
      return this.http.post(`${URL}/v2/csv`, formData);
    } else {
      if (output === 'graph') {
        return this.http.get(`${URL}/v2/${sheetId}/${gid}/graph`);
      } 
      else if (output === 'jsonld') {
        return this.http.get(`${URL}/v2/csv`, {
          params: {
            csvUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`,
            output: output ? output : 'jsonld'
          },
        });
      }
      return this.http.get(`${URL}/v2/${sheetId}/${gid}`, {
        params: {
          cache
        }
      });
    }
  }

  /**
   * Service to get data of a particular version
   *
   * Note: Currently depricated
   * @param dataVersion version of the data
   * @param currentSheet current sheet
   */
  fetchDataFromAssets(dataVersion: string, currentSheet: any) {
    return this.http.get(getAssetsURL(dataVersion, currentSheet), {
      responseType: 'text'
    });
  }

  testCallback(data: JSON) {
    console.log(data);
    return data;
  }

  /**
   * Service to get the data about an entity for an exteral API
   * by passing the UBERON, CL, or HNGC id. It determins which API to call and maps the
   * response to a normalized BottomSheetInfo format.
   * @param id ontologyid
   * @param name: structure name
   */
  fetchBottomSheetData(id: string, name: string): Observable<SheetInfo> {
    // Normalize FMA ids. Takes care of the formats: fma12345, FMA:12456, FMAID:12345
    if (id.toLowerCase().startsWith('fma')) {
      id = id.substring(3);
      if (id.includes(':')) {
        id = id.split(':')[1];
      }
      id = 'FMA:' + id;
    }

    const ontologyCode = id.split(':')[0] ?? '';
    const termId = id.split(':')[1] ?? '';

    if (ontologyCode === '' || termId === '') {
      return throwError('Invalid ID format');
    }

    return this.http.get(`${URL}/lookup/${ontologyCode}/${termId}`).pipe(map((res: any) => {
      return {
        name,
        ontologyId: id,
        ontologyCode,
        desc: res.description,
        iri: res.link,
        extraLinks:res.extraLinks,
        label: res.label,
        hasError: false,
        msg: '',
        status: 0
      } as SheetInfo;
    }));

  }

  /**
   * Fetching initial playground data
   */
  fetchPlaygroundData(data?: string) {
    return this.http.get(`${URL}/v2/playground`);
  }

  /**
   * Send updated data to render on the playground
   * after editing on the table
   *
   * @param data updated tabular data
   */
  updatePlaygroundData(data: string[][]) {
    return this.http.post(`${URL}/v2/playground`, { data });
  }

  /**
   * Service to add body for each AS to the data
   * @param data is the parsed ASCTB data from the csv file of the sheet
   */
  getDataWithBody(data: any, organName: string) {
    const organ: Structure = {
      name: 'Body',
      id: 'UBERON:0013702',
      rdfs_label: 'body proper'
    };
    data.forEach((row) => {
      row.anatomical_structures.unshift(organ);
      row.organName = organName;
    });
    return data;
  }

  /**
   * Translate the sheet ID and GID to the google sheet URL
   *
   * @param sheetID id of the sheet
   * @param gID of the sheet
   */
  formURL(sheetID: string, gID: string) {
    return `https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv&gid=${gID}`;
  }
}
