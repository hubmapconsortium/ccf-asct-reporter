import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Legend } from "../../models/legend.model";
import { TNode } from '../../models/tree.model';
import { BMNode } from '../../models/bimodal.model';
import { CompareData } from '../../models/sheet.model';

@Injectable({
  providedIn: 'root'
})
export class LegendService {

  private legendData = new Subject<any>();
  legendData$ = this.legendData.asObservable();
  constructor() { }

  makeLegendData(treeData: TNode[], bimodalData: BMNode[], compareData?: CompareData[]): Array<Legend> {

    let legends: Array<Legend> = [];
    let addedBM: boolean = false;
    let addedCT: boolean = false;
    for (const i in treeData) {
      if (legends.findIndex(l => l.name === 'Anatomical Structures') === -1)
        legends.push({
          name: 'Anatomical Structures',
          color: '#E41A1C', style: ''
        });
      if(treeData[i].isNew) {
        if(legends.findIndex(l => l.color === treeData[i].color) === -1) {
          if(compareData.length) {
            legends.push({
              name: compareData.find(c => c.color === treeData[i].color).title,
              color: treeData[i].color,
              style: ''
            })
  
            legends.push({
              name: compareData.find(c => c.color === treeData[i].color).title + ' - New Nodes',
              color: treeData[i].color,
              style: 'stroke'
            })
          }
          
        }
      }

    }
    for (const i in bimodalData) {
      if (bimodalData[i].isNew) {
        if(legends.findIndex(l => l.color === bimodalData[i].color) === -1) {
          if (compareData.length) {
            legends.push({
              name: compareData.find(c => c.color === bimodalData[i].color).title,
              color: bimodalData[i].color,
              style: ''
            })
  
            legends.push({
              name: compareData.find(c => c.color === bimodalData[i].color).title + ' - New Nodes',
              color: bimodalData[i].color,
              style: 'stroke'
            })
          }
        }
      }
      if (!addedBM && bimodalData[i].type == 'BM') {
        legends.push({
          name: 'Biomarkers',
          color: '#4DAF4A', style: ''
        });
        addedBM = true;
      }
      if (!addedCT && bimodalData[i].type == 'BM') {
        legends.push({
          name: 'Cell Types',
          color: '#377EB8', style: ''
        });
        addedCT = true;
      }
    }

    for (const i in compareData) {
      if(legends.findIndex(l => l.color === compareData[i].color) === -1) {
        legends.push({
          name: compareData[i].title,
          color: compareData[i].color,
          style: ''
        })
      }
    }
    this.legendData.next(legends)
    return legends;
  }
}
