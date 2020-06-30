import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { SheetService } from '../services/sheet.service';

// Used in the indented list vis
export class Node {
    name: string;
    uberon: string;
    children?: Node[];
    color: string;
  
    constructor(name, children, uberon, color = "#808080") {
      this.name = name;
      this.children = children;
      this.uberon = uberon;
      this.color = color;
    }
  
    public search(name) {
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].name.toLowerCase() == name.toLowerCase()) {
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
  /**
    * Generate data from the Google Sheet to be represented in the indented list vis.
    * @param  {[Array]} data Google Sheet data
    * @returns {[Array]}     Objects to build the indented list
    */
   public makeIndentData(data) {
    const cols = this.sheet.sheet.indent_cols;
    const root = new Node(this.sheet.sheet.body, [], '');
    delete root.uberon;

    let parent;

    data.forEach(row => {
      parent = root;
      for (let col = 0; col < cols.length; col++) {
        if (row[cols[col]] == '') {
          continue;
        }

        let foundNodes = row[cols[col]].trim().split(',')

        for (var i = 0; i < foundNodes.length; i++) {
          if (foundNodes[i] != '') {
            let searchedNode = parent.search(foundNodes[i]);

            if (Object.keys(searchedNode).length !== 0) {
              parent = searchedNode;
            } else {
              const newNode = new Node(foundNodes[i], [], row[cols[col] + this.sheet.sheet.uberon_row]);
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
