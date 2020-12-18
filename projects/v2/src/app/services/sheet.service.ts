import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import URL from './../static/url';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

import { Response, Error } from '../models/response.model';

import * as papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  constructor(private http: HttpClient) { }

  fetchSheetData(sheetId: string, gid: string) {
    return this.http.get(`${URL.URL}/${sheetId}/${gid}`, { responseType: 'text' });
  }
}
