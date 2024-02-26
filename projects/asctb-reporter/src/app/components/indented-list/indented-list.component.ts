import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit

} from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
// import { ReportService } from '../report/report.service';
import { IndentedListService } from './indented-list.service';
import { Row, Sheet } from '../../models/sheet.model';

interface Node {
  name: string;
  ontologyId: string;
  children?: Node[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  ontologyId: string;
  level: number;
}

@Component({
  selector: 'app-indent',
  templateUrl: './indented-list.component.html',
  styleUrls: ['./indented-list.component.scss'],
})
export class IndentedListComponent implements OnInit, OnDestroy, AfterViewInit {


  indentData = [];
  activateNode;
  treeFlattener;
  dataSource;
  visible = false;
  @Input() dataVersion;
  @Input() currentSheet: Sheet;
  @Input() sheetData: Row[];
  @Output() closeIL: EventEmitter<any> = new EventEmitter<any>();
  @Output() openBottomSheet: EventEmitter<any> = new EventEmitter<any>();

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
      ontologyId: node.ontologyId,
      level,
    };
  };

  constructor(
    public indentService: IndentedListService
  ) {

  }

  ngOnInit(): void {

    this.indentService.indentData$.subscribe(
      (data) => {
        if (data.data) {
          this.initializeTree(data.data);
          this.visible = true;
        } else {
          this.visible = false;
        }
      }
    );

    this.indentService.makeIndentData(this.currentSheet, this.sheetData);
  }

  ngAfterViewInit(): void {
    if (this.indentTree) { this.indentTree.treeControl.expandAll(); }
  }

  ngOnDestroy() {
    this.visible = false;
  }

  public initializeTree(data) {
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
    this.dataSource.data = [data];
  }
}
