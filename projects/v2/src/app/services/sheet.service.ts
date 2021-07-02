import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL, getAssetsURL } from './../static/url';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { SheetInfo, Structure } from '../models/sheet.model';

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  constructor(private http: HttpClient) { }

  /**
   * Service to fetch the data for a sheet from CSV file or Google sheet using the api
   * @param sheetId id of the sheet
   * @param gid gid of the sheet
   * @param csvFileUrl is the optional parameter that contains the value to the csv file url of the sheet
   */
  fetchSheetData(sheetId: string, gid: string, csvFileUrl?: string) {
    if (csvFileUrl) {
      return this.http.post(`${URL}/v2/csv`, { csvUrl: csvFileUrl });
    }
    else {
      return this.http.get(`${URL}/v2/${sheetId}/${gid}`);
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
    return this.http.get(getAssetsURL(dataVersion, currentSheet), { responseType: 'text' });
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

    const ontologyCode = id.split(':')[0];
    const termId = id.split(':')[1];

    if (ontologyCode == null || termId == null) {
      return throwError('Invalid ID format');
    }

    return this.http.get(`${URL}/lookup/${ontologyCode}/${termId}`).pipe(map((res: any) => {
      return {
        name,
        ontologyId: id,
        ontologyCode,
        desc: res.description,
        iri: res.link,
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
    return this.http.post(`${URL}/v2/playground`, {data});
  }


  /**
   * Service to add body for each AS to the data
   * @param data is the parsed ASCTB data from the csv file of the sheet
   */
   getDataWithBody(data: any) {
    const organ: Structure = { name: 'Body', id: '' };
    data.forEach((row) => {
      row.anatomical_structures.unshift(organ);
    });
    return data;
  }
}
