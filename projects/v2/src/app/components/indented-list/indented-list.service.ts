import { Injectable, Output, EventEmitter } from '@angular/core';
import { ILNode } from '../../models/indent.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndentedListService {

  constructor() { }
  private indentData = new Subject<any>();
  indentData$ = this.indentData.asObservable();


  public makeIndentData(currentSheet, data) {
    const cols = currentSheet.indent_cols;
    const root = new ILNode(currentSheet.body, [], '');
    delete root.uberon;

    let parent;

    data.forEach(row => {
      parent = root;
      for (const col in cols) {
        if (row[cols[col]] === '') {
          continue;
        }

        const foundNodes = row[cols[col]].trim().split(',');

        for (const i in foundNodes) {
          if (foundNodes[i] !== '') {
            const searchedNode = parent.search(foundNodes[i]);

            if (Object.keys(searchedNode).length !== 0) {
              parent = searchedNode;
            } else {
              const newNode = new ILNode(foundNodes[i], [], row[cols[col] + currentSheet.uberon_col]);
              parent.children.push(newNode);
              parent = newNode;
            }
          }
        }
      }
    });

    this.indentData.next({
      data: root,
      sheet: currentSheet.display
    });
    // return root;
  }
}
