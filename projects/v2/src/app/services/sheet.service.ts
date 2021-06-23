import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { URL, getAssetsURL, buildUberonOrCellTypeUrl, PLAYGROUND, buildHNGCUrl as buildHGNCUrl } from './../static/url';
import { EMPTY, Observable, of } from 'rxjs';


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
   * by passing the UBERON, CL, or HNGC id
   * @param id ontologyid
   */

  testCallback(data: JSON) {
    console.log(data);
    return data;
  }

  fetchBottomSheetData(id: string):  Observable<Object> {
    console.log("RAW ID: " + id);
    if (id.startsWith("UBERON:") || id.startsWith("CL:")) {
      console.log("id: " + id);
      return this.http.get(buildUberonOrCellTypeUrl(id),
        {
          headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*'
          })
        });
    } else if (id.startsWith("HGNC:")) {
      return this.http.get(
        // uri
        buildHGNCUrl(id),
        // options
        {
          headers: new HttpHeaders({
            'Content-Type':  'application/json'
          })
        }
      );
    } else {
      console.log("INVALID ID");
      return of({

      });
    }
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
}
