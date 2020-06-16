import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { parse } from 'papaparse'
import { ReportService } from './report.service';

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
    this.nodes = []
    this.id = id
  }

  public append(node) {
    this.nodes.push(node)
  }

  public search(name) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].name == name) {
        return this.nodes[i]
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
    for (var i = 0 ; i < this.children.length; i++) {
      if (this.children[i].name == name) {
        return this.children[i]
      } 
    }
    return {};
  }
}

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  constructor(private http: HttpClient, public report: ReportService) { }

  public getSheetData() {
    const sheetId = '1iUBrmiI_dB67_zCj3FBK9expLTmpBjwS'
    const gid = '567133323'
    return this.http.get(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`, { responseType: 'text' }).toPromise().then(data => {
      return parse(data)
    })
  }

  public makeTreeData(data) {
    let cols = [0, 3, 6, 9, 12, 15]
    let id = 1;
    let parent;
    let tree = new Tree(id);

    let root = new TNode(id, 'body', 0, 0);
    delete root.parent; delete root.uberon_id;
    tree.append(root)

    data.forEach(row => {
      parent = root;
      for (var col = 0; col < cols.length; col++) {

        if (row[cols[col]] == '') {
          continue
        }

        let searchedNode = tree.search(row[cols[col]])

        if (Object.keys(searchedNode).length !== 0) {
          parent = searchedNode;
        } else {
          tree.id += 1;
          let newNode = new TNode(tree.id, row[cols[col]], parent.id, row[cols[col]+2]);
          if (!(row[cols[col]+2].includes('UBERON')) && !(row[cols[col]+2].includes('CL'))) {
            this.report.reportLog(`Uberon: ${row[cols[col]]} - ${row[cols[col]+2]}`, 'warning')
          }
          tree.append(newNode)
          parent = newNode;
        }
      }
    })
    
    if (tree.nodes.length < 0) {
      this.report.reportLog(`Tree cata failed to fetch.`, 'error')
      return []
    }
    this.report.reportLog(`Tree data succesfully fetched.`, 'success')
    return tree.nodes;

  }

  public makeIndentData(data) {
    let cols = [0, 3, 6, 9, 12, 15]
    let root = new Node('body', [], '');
    delete root.uberon;

    let parent;

    data.forEach(row => {
      parent = root;
      for (var col = 0; col < cols.length; col++) {
        if (row[cols[col]] == '') {
          continue
        }

        let searchedNode = parent.search(row[cols[col]]);

        if (Object.keys(searchedNode).length !== 0) {
          parent = searchedNode;
        } else {
          let newNode = new Node(row[cols[col]], [], row[cols[col]+2]);
          if (!(row[cols[col]+2].includes('UBERON')) && !(row[cols[col]+2].includes('CL'))) {
            this.report.reportLog(`${row[cols[col]]} - ${row[cols[col]+2]}`, 'warning')
          }
          parent.children.push(newNode)
          parent = newNode;
        }
      }
    })

    if (root.children.length < 0) {
      this.report.reportLog(`Indent data failed to fetch.`, 'error')
    } else {
      this.report.reportLog(`Indent Tree data succesfully fetched.`, 'success')
    }
    return root;
  }
}
