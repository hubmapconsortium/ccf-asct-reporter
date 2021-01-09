import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Sheet } from '../../models/sheet.model';
import { AST } from '@angular/compiler';
import { Report } from '../../models/report.model';
import { makeAS, makeCellTypes, makeBioMarkers } from '../../modules/tree/tree.functions';
import { convertMetaToOutput } from '@angular/compiler/src/render3/util';
import { AS } from '../../models/tree.model';


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportData = new Subject<any>();
  reportData$ = this.reportData.asObservable();

  constructor() { }

  async makeReportData( currentSheet: Sheet, data: any) {
    let output: Report = {
      anatomicalStructures: [],
      cellTypes: [],
      biomarkers: [],
      ASWithNoLink: [],
      CTWithNoLink: [],
      BWithNoLink: []
    }

    try {
      output.anatomicalStructures = makeAS(data);
      output.cellTypes = makeCellTypes(data);
      output.biomarkers = makeBioMarkers(data);

    
      let organName: AS = {
        structure: currentSheet.name,
        uberon: 'NONE'
      }

      output.anatomicalStructures.unshift(organName);

      output.ASWithNoLink = this.getASWithNoLink(output.anatomicalStructures);
      output.CTWithNoLink = this.getCTWithNoLink(output.cellTypes);
      output.BWithNoLink = this.getBMWithNoLink(output.biomarkers);

      this.reportData.next({
        data: output,
        sheet: currentSheet
      })


      // if (this.compareData.length) {
      //   this.makeCompareData();
      // }

      // this.isVisible = true;

    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  
  getASWithNoLink(AS) {
    const noLinks = [];
    AS.forEach((ele) => {
      if (!ele.uberon.includes('UBERON')) {
        noLinks.push(ele);
      }
    });
    return noLinks;
  }

  getCTWithNoLink(CT) {
    const noLinks = [];
    CT.forEach((ele) => {
      if (!ele.link.includes('CL')) {
        noLinks.push(ele);
      }
    });
    return noLinks;
  }
  getBMWithNoLink(B) {
    const noLinks = [];
    B.forEach((ele) => {
      if (!ele.link.includes('HGNC')) {
        noLinks.push(ele);
      }
    });
    return noLinks;
  }

}
