import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Sheet, Row, CompareData } from '../../models/sheet.model';
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
  private compareData = new Subject<any>();
  compareData$ = this.compareData.asObservable();

  constructor() { }

  async makeReportData(currentSheet: Sheet, data: any) {
    const output: Report = {
      anatomicalStructures: [],
      cellTypes: [],
      biomarkers: [],
      ASWithNoLink: [],
      CTWithNoLink: [],
      BWithNoLink: []
    };

    try {
      output.anatomicalStructures = makeAS(data);
      output.cellTypes = makeCellTypes(data);
      output.biomarkers = makeBioMarkers(data);

      output.ASWithNoLink = this.getASWithNoLink(output.anatomicalStructures);
      output.CTWithNoLink = this.getCTWithNoLink(output.cellTypes);
      output.BWithNoLink = this.getBMWithNoLink(output.biomarkers);

      this.reportData.next({
        data: output,
        sheet: currentSheet
      });

    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async makeCompareData(reportdata: Report, compareData: Row[], compareSheets: CompareData[]) {

    const compareDataStats = [];
    for (const sheet of compareSheets) {
      const newEntry: any = {};
      let compareAS;
      let compareCT;
      let compareB;
      let identicalStructures = [];
      let newStructures = [];

      try {
        compareAS = await makeAS(compareData);

        if (compareAS.length > 0 ) {
          for (const a of compareAS) {
            const findObj = reportdata.anatomicalStructures.findIndex(i => i.structure === a.structure);
            if (findObj !== -1) { identicalStructures.push(a.structure); }
            else { newStructures.push(a.structure); }
          }
        }
      } catch (err) {
        this.reportData.next({
          data: null,
        });
      }

      newEntry.identicalAS = identicalStructures;
      newEntry.newAS = newStructures;
      identicalStructures = [];
      newStructures = [];

      try {
        compareCT = await makeCellTypes(compareData);

        if (compareCT.length > 0 ) {
          for (const a of compareCT) {
            const findObj = reportdata.cellTypes.findIndex(i => i.structure === a.structure);
            if (findObj !== -1) { identicalStructures.push(a.structure); }
            else { newStructures.push(a.structure); }
          }
        }
      } catch (err) {
        this.reportData.next({
          data: null,
        });
      }

      newEntry.identicalCT = identicalStructures;
      newEntry.newCT = newStructures;
      identicalStructures = [];
      newStructures = [];

      try {
        compareB = makeBioMarkers(compareData);

        if (compareB.length > 0 ) {
          for (const a of compareB) {
            const findObj = reportdata.biomarkers.findIndex(i => i.structure === a.structure);
            if (findObj !== -1) { identicalStructures.push(a.structure); }
            else { newStructures.push(a.structure); }
          }
        }
      } catch (err) {
        this.reportData.next({
          data: null,
        });
      }

      newEntry.identicalB = identicalStructures;
      newEntry.newB = newStructures;
      newEntry.color = sheet.color;
      newEntry.title = sheet.title;
      newEntry.description = sheet.description;

      compareDataStats.push(newEntry);
    }

    this.compareData.next({
      data: compareDataStats
    });
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
