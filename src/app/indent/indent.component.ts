import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SheetService } from '../sheet.service';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ReportService } from '../report.service';

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

  constructor(public sheet: SheetService, public report: ReportService) {
    this.getData();
  }

  sheetData;
  indentData = [];
  activateNode;

  @Input() public refreshData = false;
  @Output() returnRefresh = new EventEmitter();
  @Input() public shouldReloadData = false;

  @ViewChild('indentTree') indentTree;

  private _transformer = (node: Node, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      uberon: node.uberon,
      level,
    };
  }

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.refreshData) {
      this.getData();
    }
    
    if (this.shouldReloadData && !this.refreshData) {
      this.getData();
    }
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  getData() {
    this.sheet.getSheetData().then(data => {
      this.sheetData = data.data;
      this.sheetData.shift(); // removing headers
      this.dataSource.data = [this.sheet.makeIndentData(this.sheetData)];
      this.indentTree.treeControl.expandAll();
      this.returnRefresh.emit({
        comp: 'Indented List',
        val: true
      });
    }).catch(err => {
      if (err) {
        console.log(err);
        this.returnRefresh.emit({
          comp: 'Indented List',
          val: false
        });
        this.report.reportLog(`Indented List failed to render`, 'error', 'msg')
      }
    });
  }
}
