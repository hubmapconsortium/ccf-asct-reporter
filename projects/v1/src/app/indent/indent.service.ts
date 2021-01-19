import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { SheetService } from '../services/sheet.service';

// Used in the indented list vis
export class Node {
  name: string;
  uberon: string;
  children?: Node[];
  color: string;

  constructor(name, children, uberon, color = '#808080') {
    this.name = name;
    this.children = children;
    this.uberon = uberon;
    this.color = color;
  }

  public search(name) {
    for (const i in this.children) {
      if (this.children[i].name.toLowerCase() === name.toLowerCase()) {
        return this.children[i];
      }
    }
    return {};
  }
}

@Injectable({
  providedIn: 'root'
})
export class IndentService {

  constructor(public sheet: SheetService) { }
  currentSheet: any;
  public setCurrentSheet(sheet) {
    this.currentSheet = sheet;
  }
  public makeIndentData(data) {
    const cols = this.currentSheet.indent_cols;
    const root = new Node(this.currentSheet.body, [], '');
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
              const newNode = new Node(foundNodes[i], [], row[cols[col] + this.currentSheet.uberon_col]);
              parent.children.push(newNode);
              parent = newNode;
            }
          }
        }
      }
    });
    return root;
  }
}
