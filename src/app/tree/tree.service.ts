import { Injectable } from '@angular/core';
import { SheetService } from '../services/sheet.service';
import { ReportService } from '../report/report.service';
import { compare } from 'vega';

// Used in the tree visualization
export class TNode {
  id: any;
  name: string;
  parent: string;
  uberonId: string;
  color: string;
  problem: boolean;
  found: boolean;
  groupName: string;
  isNew: boolean;
  pathColor: string;

  constructor(id, name, parent, uId, color = '#808080') {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.uberonId = uId;
    this.color = color;
    this.problem = false;
    this.groupName = 'See Debug Log';
    this.isNew = false;
    this.pathColor = '#ccc'
  }
}

// Used in the tree visualization
export class Tree {
  nodes: Array<TNode>;
  id: any;

  constructor(id) {
    this.nodes = [];
    this.id = id;
  }

  public append(node) {
    this.nodes.push(node);
  }

  public search(name, nodeParent) {
    for (const i in this.nodes) {
      if (this.nodes[i].name === name) {
        const parent = this.nodes.findIndex(n => n.name === nodeParent.name);
        if (this.nodes[parent].id !== this.nodes[i].parent) {
          this.nodes[i].problem = true;
        }
        this.nodes[i].found = true;
        return this.nodes[i];
      }
    }
    const emptyNode = new TNode(0, '', 0, '');
    emptyNode.found = false;
    return emptyNode;
  }

}

const AS_RED = '#E41A1C';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  constructor(public sheet: SheetService, public report: ReportService) { }

  currentSheet: any;
  public setCurrentSheet(sheet: any) {
    this.currentSheet = sheet;
  }
  /**
   * Creates the structure from the sheet data that is accepted by the vis.
   *
   * @param data - Sheet data
   */
  public makeTreeData(data, compareData?: any): Promise<Array<TNode>> {
    
    return new Promise(async (res, rej) => {

      for(let sheet of compareData) {
        for (let row of sheet) {
          data.push(row)
        }
      }

      
      const cols = this.currentSheet.tree_cols;
      const id = 1;
      let parent;
      let tree = new Tree(id);
      const uberon_col = this.currentSheet.uberon_col;

      const root = new TNode(id, this.currentSheet.body, 0, 0, AS_RED);
      delete root.parent; delete root.uberonId;
      tree.append(root);

      data.forEach(row => {
        parent = root;
        for (const col in cols) {

          if (row[cols[col]] === '') {
            continue;
          }

          if (row[cols[col]].startsWith('//')) {
            continue;
          }

          const foundNodes = row[cols[col]].trim().split();
          for (const i in foundNodes) {
            if (foundNodes[i] !== '') {
              const searchedNode = tree.search(foundNodes[i], parent);
              searchedNode.pathColor = row[this.currentSheet.marker_col + 3];

              if (searchedNode.found) {
                if (searchedNode.problem) {
                  if (this.currentSheet.name !== 'ao') {
                    this.report.reportLog(`Nodes with multiple in-links`, 'warning', 'multi', searchedNode.name);
                  }
                }
                parent = searchedNode;
              } else {
                tree.id += 1;
                const uberon =  row[cols[col] + uberon_col] !== foundNodes[i] ? row[cols[col] + uberon_col] : 'NONE';
                const newNode = new TNode(tree.id, foundNodes[i], parent.id, uberon, AS_RED);
                newNode.isNew = row[this.currentSheet.marker_col + 2]
                if (newNode.isNew) {
                  newNode.color = row[this.currentSheet.marker_col + 3]
                  newNode.pathColor = row[this.currentSheet.marker_col + 3]
                }
                tree.append(newNode);
                parent = newNode;
              }
            }
          }
        }
      });

      if (tree.nodes.length < 0) {
        rej(['Could not process tree data']);
      }

      res(tree.nodes);
    });
  }

}
