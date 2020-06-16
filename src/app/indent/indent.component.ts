import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges} from '@angular/core';
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

@Component({
  selector: 'app-indent',
  templateUrl: './indent.component.html',
  styleUrls: ['./indent.component.css']
})
export class IndentComponent implements OnInit, OnChanges {

  sheetData;
  indentData = [];

  @Input() public refreshData = false;
  @Output() retrunRefresh = new EventEmitter();

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
    this.getData();
  }

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.refreshData) 
      this.getData()
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  getData() {
    this.sheet.getSheetData().then(data => {
      this.sheetData = data.data;
      this.sheetData.shift() // removing headers
      this.dataSource.data = [this.sheet.makeIndentData(this.sheetData)];
      this.indentTree.treeControl.expandAll();
      this.retrunRefresh.emit('Indent')
    })
  }
}
