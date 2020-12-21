import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges,
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
import { Sheet } from '../../models/sheet.model';

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
  templateUrl: './indented-list.component.html',
  styleUrls: ['./indented-list.component.scss'],
})
export class IndentedListComponent implements OnInit, OnDestroy, AfterViewInit {
  

  indentData = [];
  activateNode;
  treeFlattener;
  dataSource;
  visible = false;
  // @Input() dataVersion=this.sc.VERSIONS[0].folder;
  @Input() dataVersion;
  @Input() currentSheet: Sheet;
  @Input() sheetData: any;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

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
  }

  constructor(
    public indentService: IndentedListService
  ) { 

  }

  ngOnInit(): void {

    this.indentService.indentData$.subscribe(data => {
      this.initializeTree(data.data);
    })

    this.indentService.makeIndentData(this.currentSheet, this.sheetData);
  }

  ngAfterViewInit(): void {
    this.indentTree.treeControl.expandAll()
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


  // async getData() {
  //   try {
  //     const data = await this.sheet.getSheetData(this.currentSheet, this.dataVersion);
  //     this.sheetData = data;
  //     this.dataSource.data = [this.indent.makeIndentData(this.sheetData.data)];
  //     this.indentTree.treeControl.expandAll();

  //     this.returnRefresh.emit({
  //         comp: 'Indented List',
  //         msg: this.sheetData.msg,
  //         status: this.sheetData.status,
  //         val: true,
  //       });
  //     this.report.reportLog(
  //         `Indented List for ${this.currentSheet.display} successfully rendered.`,
  //         'success',
  //         'msg'
  //       );

  //   } catch (err) {
  //     console.log(err);
  //     this.returnRefresh.emit({
  //       comp: 'Indented List',
  //       msg: 'Failed',
  //       status: '500',
  //       val: false,
  //     });
  //     this.report.reportLog(`Indented List failed to render`, 'error', 'msg');
  //   }
  // }
}
