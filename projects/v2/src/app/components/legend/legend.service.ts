import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Legend } from '../../models/legend.model';
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

    const legends: Array<Legend> = [];
    let addedBMBG = false;
    let addedBMBP = false;
    let addedBMBL = false;
    let addedBMBM = false;
    let addedBMBF = false;
    let addedCT = false;
    for (const i of treeData) {
      if (legends.findIndex(l => l.name === 'Anatomical Structures') === -1) {
        legends.push({
          name: 'Anatomical Structures',
          color: '#E41A1C', style: ''
        });
      }
      if (i.isNew) {
        if (legends.findIndex(l => l.color === i.color) === -1) {
          if (compareData.length) {
            legends.push({
              name: compareData.find(c => c.color === i.color).title,
              color: i.color,
              style: ''
            });

            legends.push({
              name: compareData.find(c => c.color === i.color).title + ' - New Nodes',
              color: i.color,
              style: 'stroke'
            });
          }

        }
      }

    }

    for (const i of bimodalData) {
      if (i.isNew) {
        if (legends.findIndex(l => l.color === i.color) === -1) {
          if (compareData.length) {
            legends.push({
              name: compareData.find(c => c.color === i.color).title,
              color: i.color,
              style: ''
            });

            legends.push({
              name: compareData.find(c => c.color === i.color).title + ' - New Nodes',
              color: i.color,
              style: 'stroke'
            });
          }
        }
      }
      if (i.type === 'BM') {
        if (!addedBMBG && i.bType === 'gene'){
          legends.push({
            name: 'Gene Biomarkers',
            color: '#4DAF4A', style: '', bmType: 'biomarker'
          });
          addedBMBG = true;
        }
        if (!addedBMBP && i.bType === 'protein'){
          legends.push({
            name: 'Protein Biomarkers',
            color: '#4DAF4A', style: '', bmType: 'biomarker'
          });
          addedBMBP = true;
        }
        if (!addedBMBL && i.bType === 'lipids'){
          legends.push({
            name: 'Lipids Biomarkers',
            color: '#4DAF4A', style: '', bmType: 'biomarker'
          });
          addedBMBL = true;
        }
        if (!addedBMBM && i.bType === 'metalloids'){
          legends.push({
            name: 'Metalloids Biomarkers',
            color: '#4DAF4A', style: '', bmType: 'biomarker'
          });
          addedBMBM = true;
        }
        if (!addedBMBF && i.bType === 'proteoforms'){
          legends.push({
            name: 'Proteoforms Biomarkers',
            color: '#4DAF4A', style: '', bmType: 'biomarker'
          });
          addedBMBF = true;
        }
      }
      if (!addedCT && i.type === 'BM') {
        legends.push({
          name: 'Cell Types',
          color: '#377EB8', style: ''
        });
        addedCT = true;
      }
    }

    for (const i in compareData) {
      if (legends.findIndex(l => l.color === compareData[i].color) === -1) {
        legends.push({
          name: compareData[i].title,
          color: compareData[i].color,
          style: ''
        });
      }
    }
    this.legendData.next(legends);
    return legends;
  }
}
