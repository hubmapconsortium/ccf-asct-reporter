import { FlatTreeControl } from '@angular/cdk/tree';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  MatTree,
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { ILNode } from '../../models/indent.model';
import { Row, Sheet } from '../../models/sheet.model';
import { IndentedListService } from './indented-list.service';

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
  activateNode?: unknown;
  visible = false;

  @Input() dataVersion?: unknown;
  @Input() currentSheet!: Sheet;
  @Input() sheetData: Row[] = [];
  @Output() closeIL = new EventEmitter<void>();
  @Output() openBottomSheet = new EventEmitter<{
    name: string;
    ontologyId: string;
  }>();

  @ViewChild('indentTree') indentTree!: MatTree<unknown>;

  hasChild = (_: number, node: FlatNode) => node.expandable;

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

  treeFlattener = new MatTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(public indentService: IndentedListService) {}

  ngOnInit(): void {
    this.indentService.indentData$.subscribe((data) => {
      if (data.data) {
        this.initializeTree(data.data);
        this.visible = true;
      } else {
        this.visible = false;
      }
    });

    this.indentService.makeIndentData(this.currentSheet, this.sheetData);
  }

  ngAfterViewInit(): void {
    if (this.indentTree) {
      this.indentTree.treeControl.expandAll();
    }
  }

  ngOnDestroy() {
    this.visible = false;
  }

  public initializeTree(data: ILNode) {
    this.dataSource.data = [data];
  }
}
