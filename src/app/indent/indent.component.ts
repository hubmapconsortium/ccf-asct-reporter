import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SheetService } from '../services/sheet.service';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ReportService } from '../report/report.service';
import { IndentService } from './indent.service';

interface Node {
  name: string;
  uberon: string;
  children?: Node[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  uberon: string;
  level: number;
}

@Component({
  selector: 'app-indent',
  templateUrl: './indent.component.html',
  styleUrls: ['./indent.component.css']
})
export class IndentComponent implements OnInit, OnChanges {

  constructor(public sheet: SheetService, public report: ReportService, public indent: IndentService) {
    this.getData();
  }

  sheetData;
  indentData = [];
  activateNode;
  treeFlattener;
  dataSource;

  @Input() public refreshData = false;
  @Output() returnRefresh = new EventEmitter();
  @Input() public shouldReloadData = false;

  @ViewChild('indentTree') indentTree;

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  private transformer = (node: Node, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      uberon: node.uberon,
      level,
    };
  }

  ngOnInit(): void {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer, node => node.level, node => node.expandable, node => node.children);

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnChanges() {
    if (this.refreshData) {
      this.getData();
    }

    if (this.shouldReloadData && !this.refreshData) {
      this.getData();
    }
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  async getData() {
    const data = await this.sheet.getSheetData();
    try {
      this.sheetData = data;
      this.dataSource.data = [this.indent.makeIndentData(this.sheetData.data)];
      this.indentTree.treeControl.expandAll();

      this.returnRefresh.emit({
        comp: 'Indented List',
        msg: this.sheetData.msg,
        status: this.sheetData.status,
        val: true
      });
    } catch (err) {
      this.returnRefresh.emit({
        comp: 'Indented List',
        msg: this.sheetData.msg,
        status: this.sheetData.status,
        val: false
      });
      this.report.reportLog(`Indented List failed to render`, 'error', 'msg');

    }
  }
}
