import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { REGISTRY } from '../static/docs';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocsService {
  REGISTRY = REGISTRY;

  docsData = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) { }

  getData(id: number) {
    this.http.get(REGISTRY[id].path, {responseType: 'text'}).subscribe(
      data => {
        this.docsData.next(data);
      }
    );
  }
}
