import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SheetService } from '../services/sheet.service';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
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
  styleUrls: ['./indent.component.css'],
})
export class IndentComponent implements OnInit, OnChanges {
  constructor(
    public sheet: SheetService,
    public report: ReportService,
    public indent: IndentService
  ) {}

  sheetData;
  indentData = [];
  activateNode;
  treeFlattener;
  dataSource;

  @Input() public refreshData = false;
  @Output() returnRefresh = new EventEmitter();
  @Input() public shouldReloadData = false;
  @Input() currentSheet: any;

  @ViewChild('indentTree') indentTree;

  hasChild;

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  private transformer = (node: Node, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      uberon: node.uberon,
      level,
    };
  };

  ngOnInit(): void {
    this.indent.setCurrentSheet(this.currentSheet);
    this.initializeTree();
  }

  ngOnChanges() {
    if (this.refreshData) {
      this.indent.setCurrentSheet(this.currentSheet);
      this.getData();
    }

    if (this.shouldReloadData && !this.refreshData) {
      this.indent.setCurrentSheet(this.currentSheet);
      this.getData();
    }
  }

  public initializeTree() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      (node) => node.level,
      (node) => node.expandable,
      (node) => node.children
    );

    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
    this.hasChild = (_: number, node: FlatNode) => node.expandable;

  }

  
  async getData() {
    try {
      const data = await this.sheet.getSheetData(this.currentSheet);
      this.sheetData = data;
      this.dataSource.data = [this.indent.makeIndentData(this.sheetData.data)];
      this.indentTree.treeControl.expandAll();

        this.returnRefresh.emit({
          comp: 'Indented List',
          msg: this.sheetData.msg,
          status: this.sheetData.status,
          val: true,
        });
        this.report.reportLog(
          `Indented List for ${this.currentSheet.display} successfully rendered.`,
          'success',
          'msg'
        );
      
    } catch (err) {
      console.log(err);
      this.returnRefresh.emit({
        comp: 'Indented List',
        msg: 'Failed',
        status: '500',
        val: false,
      });
      this.report.reportLog(`Indented List failed to render`, 'error', 'msg');
    }
  }
}
