import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { LegendService } from './legend.service';
import { Legend } from '../../models/legend.model';
import { TNode } from '../../models/tree.model';
import { CompareData } from '../../models/sheet.model';
import { Error } from '../../models/response.model';
import { BimodalData } from '../../models/bimodal.model';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class LegendComponent implements OnInit, OnChanges {

  legends: Legend[];

  @Input() treeData: TNode[];
  @Input() bimodalData: BimodalData;
  @Input() compareData: CompareData[];
  @Input() error: Error;

  constructor(public ls: LegendService) { }

  ngOnInit(): void {
    this.ls.legendData$.subscribe(data => {
      if (data.length) {
        this.legends = data;
      }
    });
  }

  ngOnChanges() {
    if (this.treeData && this.bimodalData) {
      if (this.treeData.length && this.bimodalData.nodes.length) {
        this.ls.makeLegendData(this.treeData, this.bimodalData.nodes, this.compareData);
      }
    }
  }



}
