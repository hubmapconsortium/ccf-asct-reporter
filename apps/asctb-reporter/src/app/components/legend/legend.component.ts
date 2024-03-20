import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BimodalData } from '../../models/bimodal.model';
import { Legend } from '../../models/legend.model';
import { Error } from '../../models/response.model';
import { CompareData } from '../../models/sheet.model';
import { TNode } from '../../models/tree.model';
import { LegendService } from './legend.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
})
export class LegendComponent implements OnInit, OnChanges {
  legends: Legend[] = [];

  @Input() treeData: TNode[] = [];
  @Input() bimodalData!: BimodalData;
  @Input() compareData: CompareData[] = [];
  @Input() error!: Error;

  constructor(public ls: LegendService) {}

  ngOnInit(): void {
    this.ls.legendData$.pipe(delay(0)).subscribe((data) => {
      if (data.length) {
        this.legends = data;
      }
    });
  }

  ngOnChanges() {
    if (this.treeData && this.bimodalData) {
      if (this.treeData.length && this.bimodalData.nodes.length) {
        this.ls.makeLegendData(
          this.treeData,
          this.bimodalData.nodes,
          this.compareData
        );
      }
    }
  }
}
