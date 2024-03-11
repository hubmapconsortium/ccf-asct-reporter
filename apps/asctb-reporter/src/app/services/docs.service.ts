import { Injectable } from '@angular/core';
import { REGISTRY } from '../static/docs';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocsService {
  /**
   * List of all the docs pages
   */
  REGISTRY = REGISTRY;

  /**
   * Behavior subject to return the markdown
   */
  docsData = new BehaviorSubject<string>('');
  constructor(private readonly http: HttpClient) {}

  getData(title: string) {
    const index = REGISTRY.map((e) => e.urlTitle).indexOf(title);
    this.http
      .get(REGISTRY[index].path, { responseType: 'text' })
      .subscribe((data) => {
        this.docsData.next(data);
      });
  }

  getID(title: string) {
    return REGISTRY.map((e) => e.urlTitle).indexOf(title);
  }

  getTitle(id: number) {
    return REGISTRY[id].urlTitle;
  }
}
