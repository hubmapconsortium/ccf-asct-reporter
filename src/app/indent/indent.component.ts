import { Component, OnInit, ViewChild } from '@angular/core';
import { NestedTreeControl, FlatTreeControl } from "@angular/cdk/tree";
import { SheetService } from '../sheet.service';
import { of as observableOf } from 'rxjs';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

interface Node {
  name: string;
  uberon: string;
  children?: Node[];
}

interface FlatNode {
  expandable: boolean,
  name: string,
  uberon: string,
  level: number
}

const GetChildren = (node: Node) => observableOf(node.children);
const TC = new NestedTreeControl(GetChildren);

@Component({
  selector: 'app-indent',
  templateUrl: './indent.component.html',
  styleUrls: ['./indent.component.css']
})
export class IndentComponent implements OnInit {
  tc = TC;

  sheetData;
  indentData = [];

  private _transformer = (node: Node, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      uberon: node.uberon,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  @ViewChild('indentTree') indentTree;

  constructor(public sheet: SheetService) {
    this.sheet.getSheetData().then(data => {
      this.sheetData = data.data;
      this.sheetData.shift() // removing headers
      this.dataSource.data = [this.sheet.makeIndentData(this.sheetData)];
      this.indentTree.treeControl.expandAll();
    })
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  ngOnInit(): void {
  }

}
