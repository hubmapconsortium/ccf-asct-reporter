import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { parse } from 'papaparse';

export class TNode {
  id: any;
  name: String;
  parent: String;
  uberon_id: String;

  constructor(id, name, parent, u_id) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.uberon_id = u_id;
  }
}

export class Tree {
  nodes: Array<Node>;
  id: any;

  constructor(id) {
    this.nodes = [];
    this.id = id;
  }

  public append(node) {
    this.nodes.push(node);
  }

  public search(name) {
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].name == name) {
        return this.nodes[i];
      }
    }
    return {};
  }

}

export class Node {
  name: string;
  uberon: string;
  children?: Node[];

  constructor(name, children, uberon) {
    this.name = name;
    this.children = children;
    this.uberon = uberon;
  }

  public search(name) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].name == name) {
        return this.children[i];
      }
    }
    return {};
  }
}

export class ASCT {
  structure: string;
  uberon: string;
  substructure: string;
  sub_uberon: string;
  sub_2x: string;
  sub_2x_uberon: string;
  sub_3x: string;
  sub_3x_uberon: string;
  sub_4x: string;
  sub_4x_uberon: string;
  cell_types: string;
  cl_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  anatomicalStructures = [];
  cellTypes = [];
  markers = [];

  constructor(private http: HttpClient) { }

  public getSheetData() {
    const sheetId = '1iUBrmiI_dB67_zCj3FBK9expLTmpBjwS';
    const gid = '567133323';
    return this.http.get(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`, { responseType: 'text' }).toPromise().then(data => {
      let parsedData = parse(data);
      return parsedData;
    });
  }

  public makeTreeData(data) {
    const cols = [0, 3, 6, 9, 12, 15];
    const id = 1;
    let parent;
    const tree = new Tree(id);

    const root = new TNode(id, 'body', 0, 0);
    delete root.parent; delete root.uberon_id;
    tree.append(root);

    data.forEach(row => {
      parent = root;
      for (let col = 0; col < cols.length; col++) {

        if (row[cols[col]] == '') {
          continue;
        }

        const searchedNode = tree.search(row[cols[col]]);

        if (Object.keys(searchedNode).length !== 0) {
          parent = searchedNode;
        } else {
          tree.id += 1;
          const newNode = new TNode(tree.id, row[cols[col]], parent.id, row[cols[col] + 2]);
          if (cols[col] != 15) {
            this.anatomicalStructures.push({
              structure: row[cols[col]],
              uberon: row[cols[col] + 2]
            })

          } else {
            this.cellTypes.push({
              structure: row[cols[col]],
              link: row[cols[col] + 2]
            })
          }

          tree.append(newNode);
          parent = newNode;
        }
      }
    });

    if (tree.nodes.length < 0) {
      return [];
    }
    return tree.nodes;
  }

  public makeIndentData(data) {
    const cols = [0, 3, 6, 9, 12, 15];
    const root = new Node('body', [], '');
    delete root.uberon;

    let parent;

    data.forEach(row => {
      parent = root;
      for (let col = 0; col < cols.length; col++) {
        if (row[cols[col]] == '') {
          continue;
        }

        const searchedNode = parent.search(row[cols[col]]);

        if (Object.keys(searchedNode).length !== 0) {
          parent = searchedNode;
        } else {
          const newNode = new Node(row[cols[col]], [], row[cols[col] + 2]);
          parent.children.push(newNode);
          parent = newNode;
        }
      }
    });

    return root;
  }

  public makeTableData(data) {
    let tableData = [];

    data.forEach(ele => {
      let entry = new ASCT();
      entry.structure = ele[0]
      entry.uberon = ele[2]
      entry.substructure = ele[3]
      entry.sub_uberon = ele[5]
      entry.sub_2x = ele[6]
      entry.sub_2x_uberon = ele[8]
      entry.sub_3x = ele[9]
      entry.sub_3x_uberon = ele[10]
      entry.sub_4x = ele[12]
      entry.sub_4x_uberon = ele[14]
      entry.cell_types = ele[15]
      entry.cl_id = ele[17]

      tableData.push(entry)
    })
    console.log(tableData)
    return tableData;
  }
}
