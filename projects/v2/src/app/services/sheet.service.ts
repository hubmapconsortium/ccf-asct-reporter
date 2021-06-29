import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL, getAssetsURL, getInformation, PLAYGROUND } from './../static/url';


@Injectable({
  providedIn: 'root'
})
export class SheetService {

  constructor(private http: HttpClient) { }

  /**
   * Service to fetch the data for a sheet form the miner
   * @param sheetId id of the sheet
   * @param gid gid of the sheet
   */
  fetchSheetData(sheetId: string, gid: string) {
    return this.http.get(`${URL}/v2/${sheetId}/${gid}`);
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
   * Service to fetch the data for a sheet from CSV file using the api
   * @param url is the link to the csv file of the sheet
   */
   fetchDataFromCSV(url: string) {
    return this.http.post(`${URL}/v2/getDataFromCSV`, { csvUrl: url });
  }
}
