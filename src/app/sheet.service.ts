import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { parse } from 'papaparse';
import { async } from '@angular/core/testing';

export class TNode {
  id: any;
  name: String;
  parent: String;
  uberon_id: String;
  cc;

  constructor(id, name, parent, u_id) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.uberon_id = u_id;
    this.cc = []
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
      if (this.children[i].name.toLowerCase() == name.toLowerCase()) {
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

export class BMNode {
  name: string;
  group: number;
  first: string;
  last: string;
  fontSize: number;
  x: number;
  y: number;
  id: number;

  constructor(name, group, first, last, x, y, fontSize) {
    this.name = name;
    this.group = group;
    this.first = first;
    this.last = last;
    this.fontSize = fontSize;
    this.x = x;
    this.y = y;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  anatomicalStructures = [];
  cellTypes = [];
  bioMarkers = [];
  reportHasData = false;
  bimodalData = {};
  forcedData = []

  constructor(private http: HttpClient) { }

  public getSheetData() {
    const sheetId = '1iUBrmiI_dB67_zCj3FBK9expLTmpBjwS';
    const gid = '567133323';
    return this.http.get(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`, { responseType: 'text' }).toPromise().then(data => {
      let parsedData = parse(data);
      return parsedData;
    });
  }

  async makeBimodalData(sheetData, treeData) {
    return new Promise((resolve, reject) => {
      let links = [];
      let nodes = [];
      let treeX = 0;
      let treeY = 20;
      let i = 0;

      for (; i < this.cellTypes.length; i++) {
        treeData.forEach(ele => {
          treeX = ele.x
          if (ele.name == this.cellTypes[i].structure) {
            let newNode = new BMNode(this.cellTypes[i].structure, 1, this.cellTypes[i].structure, '', ele.x, ele.y, 16)
            newNode.id = i;
            nodes.push(newNode)
          }
        })
      }

      for (; i < this.bioMarkers.length; i++) {
        let newNode = new BMNode(this.bioMarkers[i].structure, 2, '', this.bioMarkers[i].structure, treeX + 500, treeY, 16)
        newNode.id = i;
        nodes.push(newNode)
        treeY += 60;
      }

      sheetData.forEach(row => {
        let cell = row[15]
        let markers = row[18].split(',')

        let cellId = 0;

        for (var i = 0; i < nodes.length; i++) {
          if (cell == nodes[i].name) {
            cellId = i;
            break;
          }
        }

        markers.forEach(m => {
          for (var i = 0; i < nodes.length; i++) {
            if (m == nodes[i].name) {
              links.push({
                s: cellId,
                t: i,
              })
            }
          }
        })
      })

      this.bimodalData = {
        nodes: nodes, links: links
      }
      
      resolve(this.bimodalData)
    })

  }

  public makeReportData(data) {
    const cols = [0, 3, 6, 9, 12, 15, 18];
    data.forEach(row => {
      for (let col = 0; col < cols.length; col++) {
        if (!this.reportHasData) {
          if (cols[col] != 15 && cols[col] != 18) {
            if (!this.doesElementExist(this.anatomicalStructures, row[cols[col]])) {
              this.anatomicalStructures.push({
                structure: row[cols[col]],
                uberon: row[cols[col] + 2]
              })
            }

          } else if (cols[col] == 15) {
            if (!this.doesElementExist(this.cellTypes, row[cols[col]])) {
              this.cellTypes.push({
                structure: row[cols[col]],
                link: row[cols[col] + 2]
              })
            }
          } else {
            let markers = row[cols[col]].split(',')
            for (let i = 0; i < markers.length; i++) {
              if (!this.doesElementExist(this.bioMarkers, markers[i])) {
                this.bioMarkers.push({
                  structure: markers[i]
                })
              }
            }
          }
        }
      }
    })

    this.reportHasData = true;
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

          tree.append(newNode);
          parent = newNode;

          if (cols[col] == 15) {
            let markers = row[18].split(',')
            for (var i = 0; i < markers.length; i++) {
              parent.cc.push({
                name: markers[i]
              })
            }
          }
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
    return tableData;
  }

  doesElementExist(obj, item) {
    for (let i = 0; i < obj.length; i++) {
      if (obj[i].structure.toUpperCase() == item.toUpperCase()) {
        return true
      }
    }
    return false
  }
}
