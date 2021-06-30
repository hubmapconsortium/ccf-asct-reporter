import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL, getAssetsURL, getInformation, PLAYGROUND } from './../static/url';
import { Structure } from '../models/sheet.model';


@Injectable({
  providedIn: 'root'
})
export class SheetService {

  constructor(private http: HttpClient) { }

  /**
   * Service to fetch the data for a sheet from CSV file or Google sheet using the api
   * @param sheetId id of the sheet
   * @param gid gid of the sheet
   * @param csvFileUrl is the opitional parameter that contains the value to the csv file url of the sheet
   */
  fetchSheetData(sheetId: string, gid: string, csvFileUrl: string  = '') {
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

  /**
   * Service to get the data about an entity for an exteral API
   * by passing the uberon id
   * @param id ontologyid
   */
  fetchBottomSheetData(id: string) {
    return this.http.get(getInformation(id));
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
