import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL, getAssetsURL, buildHGNCApiUrl, buildASCTApiUrl, buildHGNCLink } from './../static/url';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BottomSheetInfo } from '../models/bottom-sheet-info.model';
import { Error } from '../models/response.model';

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
  fetchBottomSheetData(id: string, name: string): Observable<BottomSheetInfo> {
    console.log("RAW ID: " + id);

    //  Use ebi.ac.uk API
    if (id.startsWith("UBERON:") || id.startsWith("CL:") || id.toLowerCase().startsWith("fma")) {
      console.log("id: " + id);

      // Normalize FMA ids. Takes care of the formats: fma12345, FMA:12456, FMAID:12345
      if (id.toLowerCase().startsWith("fma")) {
        id = id.substring(3);
        if (id.includes(":")) {
          id = id.split(":")[1];
        }
        id = "FMA:" + id;
      }

      return this.http.get(buildASCTApiUrl(id)).pipe(map((res: any) => {
          // Get first item in the response
          let firstRes = res._embedded.terms[0];
          return <BottomSheetInfo>{
            name: name,
            ontologyId: id,
            desc: firstRes.annotation.definition ? firstRes.annotation.definition[0] : 'No description found.',
            iri: firstRes.iri,
            label: firstRes.label,
            hasError: false,
            msg: '',
            status: 0
          };

        }));

    }
    // User HGNC API
    else if (id.startsWith("HGNC:")) {
      return this.http.get(
        // uri
        buildHGNCApiUrl(id),
        // options
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        }
      ).pipe(map((res: any) => {

        // Get first item in the response
        let firstRes = res.response.docs[0];
        return <BottomSheetInfo>{
          name: name,
          ontologyId: id,
          desc: firstRes.name,
          iri: buildHGNCLink(firstRes.hgnc_id),
          label: firstRes.symbol,
          hasError: false,
          msg: '',
          status: 0
        };
      }));

    } else {
      console.log("INVALID ID");
      return of({
        name: name,
        ontologyId: id,
        iri: '',
        label: '',
        desc: 'null',
        hasError: true,
        msg: "Invalid ID format or type.",
        status: 500
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
