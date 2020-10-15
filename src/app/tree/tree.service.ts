import { Injectable } from '@angular/core';
import { SheetService } from '../services/sheet.service';
import { ReportService } from '../report/report.service';

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
  parents: Array<number>;

  constructor(id, name, parent, uId, color = '#808080') {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.uberonId = uId;
    this.color = color;
    this.problem = false;
    this.groupName = 'Multi-parent Nodes';
    this.isNew = false;
    this.pathColor = '#ccc';
    this.parents = [];
  }
}

export class TreeAndMultiParent {
  tree: Array<TNode>;
  multiParentLinks: any;

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
          if (!this.nodes[i].parents.includes(this.nodes[parent].id) && this.nodes[parent].id !== 1) {
            this.nodes[i].parents.push(this.nodes[parent].id);
          }

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
  public makeTreeData(data, compareData?: any): Promise<TreeAndMultiParent> {

    return new Promise(async (res, rej) => {

      for (const sheet of compareData) {
        for (const row of sheet.data) {
          data.push(row);
        }
      }

      const linkData = [];
      const cols = this.currentSheet.tree_cols;
      const id = 1;
      let parent;
      const tree = new Tree(id);
      const uberon_col = this.currentSheet.uberon_col;

      const root = new TNode(id, this.currentSheet.body, 0, 0, AS_RED);
      delete root.parent; delete root.uberonId;
      tree.append(root);
  
      try {
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
                searchedNode.pathColor = row[row.length - 1];
  
                if (searchedNode.found) {
                  if (searchedNode.problem) {
                    if (this.currentSheet.name !== 'ao') {
                      if (!searchedNode.parents.includes(searchedNode.id)) {
                        this.report.reportLog(`Nodes with multiple in-links`, 'warning', 'multi', searchedNode.name);
                      }
                    }
                  }
                  parent = searchedNode;
                } else {
                  tree.id += 1;
                  const uberon =  row[cols[col] + uberon_col] !== foundNodes[i] ? row[cols[col] + uberon_col] : 'NONE';
                  const newNode = new TNode(tree.id, foundNodes[i], parent.id, uberon, AS_RED);
                  newNode.isNew = row[row.length - 2];
                  if (newNode.isNew) {
                    newNode.color = row[row.length - 1];
                    newNode.pathColor = row[row.length - 1];
                  }
                  tree.append(newNode);
                  parent = newNode;
                }
              }
            }
          }
        });
      } catch (err) {
        rej(['Could not process tree data']);
      }

      if (tree.nodes.length < 0) {
        rej(['Could not process tree data']);
      }

      for (const node of tree.nodes) {
        if (node.problem) {
          for (const p of node.parents) {
            if (p === node.id) {
              this.report.reportLog(`Nodes with self-links`, 'warning', 'multi', node.name);
            }
            linkData.push({
              s: p,
              t: node.id
            });
          }
        }
      }


      res({
        tree: tree.nodes,
        multiParentLinks: linkData
      });
    });
  }

}
