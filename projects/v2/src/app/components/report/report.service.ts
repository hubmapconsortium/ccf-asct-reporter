import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Sheet, Row, CompareData } from '../../models/sheet.model';
import { AST } from '@angular/compiler';
import { Report } from '../../models/report.model';
import {
  makeAS,
  makeCellTypes,
  makeBioMarkers,
} from '../../modules/tree/tree.functions';
import { convertMetaToOutput } from '@angular/compiler/src/render3/util';
import { AS, B } from '../../models/tree.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private reportData = new Subject<any>();
  reportData$ = this.reportData.asObservable();
  private compareData = new Subject<any>();
  compareData$ = this.compareData.asObservable();

  constructor() {}

  async makeReportData(currentSheet: Sheet, data: any, biomarkerType?: string) {
    const output: Report = {
      anatomicalStructures: [],
      cellTypes: [],
      biomarkers: [],
      ASWithNoLink: [],
      CTWithNoLink: [],
      BWithNoLink: [],
    };

    try {
      output.anatomicalStructures = makeAS(data);
      output.cellTypes = makeCellTypes(data);
      output.biomarkers = makeBioMarkers(data, biomarkerType);

      output.ASWithNoLink = this.getASWithNoLink(output.anatomicalStructures);
      output.CTWithNoLink = this.getCTWithNoLink(output.cellTypes);
      output.BWithNoLink = this.getBMWithNoLink(output.biomarkers);

      this.reportData.next({
        data: output,
        sheet: currentSheet,
      });
    } catch (err) {
      throw err;
    }
  }

  makeAllOrganReportDataByOrgan(reportData: any) {
    const result = {
      anatomicalStructures: [],
      cellTypes: [],
      biomarkers: [],
      ASWithNoLink: [],
      CTWithNoLink: [],
      BWithNoLink: [],
    };

    try {
      result.anatomicalStructures = reportData.anatomicalStructures.reduce(
        (acc, curr) => {
          let item = acc.find((x) => x.organName === curr.organName);
          if (!item) {
            item = { organName: curr.organName, count: 0 };
            acc.push(item);
          }
          item.count++;
          return acc;
        },
        []
      );
      result.ASWithNoLink = reportData.ASWithNoLink.reduce((acc, curr) => {
        let item = acc.find((x) => x.organName === curr.organName);
        if (!item) {
          item = { organName: curr.organName, count: 0 };
          acc.push(item);
        }
        item.count++;
        return acc;
      }, []);
      result.BWithNoLink = reportData.BWithNoLink.reduce((acc, curr) => {
        let item = acc.find((x) => x.organName === curr.organName);
        if (!item) {
          item = { organName: curr.organName, count: 0 };
          acc.push(item);
        }
        item.count++;
        return acc;
      }, []);
      result.CTWithNoLink = reportData.CTWithNoLink.reduce((acc, curr) => {
        let item = acc.find((x) => x.organName === curr.organName);
        if (!item) {
          item = { organName: curr.organName, count: 0 };
          acc.push(item);
        }
        item.count++;
        return acc;
      }, []);
      result.biomarkers = reportData.biomarkers.reduce((acc, curr) => {
        let item = acc.find((x) => x.organName === curr.organName);
        if (!item) {
          item = { organName: curr.organName, count: 0 };
          acc.push(item);
        }
        item.count++;
        return acc;
      }, []);
      result.cellTypes = reportData.cellTypes.reduce((acc, curr) => {
        let item = acc.find((x) => x.organName === curr.organName);
        if (!item) {
          item = { organName: curr.organName, count: 0 };
          acc.push(item);
        }
        item.count++;
        return acc;
      }, []);
      result.ASWithNoLink = reportData.ASWithNoLink.reduce((acc, curr) => {
        let item = acc.find((x) => x.organName === curr.organName);
        if (!item) {
          item = { organName: curr.organName, count: 0 };
          acc.push(item);
        }
        item.count++;
        return acc;
      }, []);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  makeAllOrganReportDataCountsByOrgan(data) {
    return data.anatomicalStructures.map((e: any, i) => {
      return {
        organName: e.organName,
        biomarkers: data.biomarkers[i].count,
        cellTypes: data.cellTypes[i].count,
        anatomicalStructures: e.count,
      };
    });
  }

  async makeCompareData(
    reportdata: Report,
    compareData: Row[],
    compareSheets: CompareData[]
  ) {
    const compareDataStats = [];
    for (const sheet of compareSheets) {
      const newEntry: any = {};
      let compareCT;
      let compareB;
      let identicalStructures = [];
      let newStructures = [];

      try {
        const compareAS = makeAS(compareData);
        const mainASData = reportdata.anatomicalStructures.filter(
          (i) => !i.isNew
        );
        const compareASData = compareAS.filter((i) => i.isNew);

        if (compareAS.length > 0) {
          for (const a of compareASData) {
            let found = false;
            for (const b of mainASData) {
              if (a.structure === b.structure && !b.isNew) {
                identicalStructures.push(a.structure);
                found = true;
              }
            }

            if (!found) {
              newStructures.push(a.structure);
            }
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
        compareCT = makeCellTypes(compareData);
        const mainCTData = reportdata.cellTypes.filter((i) => !i.isNew);
        const compareCTData = compareCT.filter((i) => i.isNew);

        if (compareCT.length > 0) {
          for (const a of compareCTData) {
            let found = false;
            for (const b of mainCTData) {
              if (a.structure === b.structure && !b.isNew) {
                identicalStructures.push(a.structure);
                found = true;
              }
            }

            if (!found) {
              newStructures.push(a.structure);
            }
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
        const mainBData = reportdata.biomarkers.filter((i) => !i.isNew);
        const compareBData = compareB.filter((i) => i.isNew);

        if (compareB.length > 0) {
          for (const a of compareBData) {
            let found = false;
            for (const b of mainBData) {
              if (a.structure === b.structure && !b.isNew) {
                identicalStructures.push(a.structure);
                found = true;
              }
            }

            if (!found) {
              newStructures.push(a.structure);
            }
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
      data: compareDataStats,
    });
  }

  getASWithNoLink(anatomicalStructures) {
    const noLinks = [];
    anatomicalStructures.forEach((ele) => {
      if (!ele.uberon.includes('UBERON')) {
        noLinks.push(ele);
      }
    });
    return noLinks;
  }

  getCTWithNoLink(cellTypes) {
    const noLinks = [];
    cellTypes.forEach((ele) => {
      if (!ele.link.includes('CL')) {
        noLinks.push(ele);
      }
    });
    return noLinks;
  }
  getBMWithNoLink(biomarkers) {
    const noLinks = [];
    biomarkers.forEach((ele) => {
      if (!ele.link.includes('HGNC')) {
        noLinks.push(ele);
      }
    });
    return noLinks;
  }
}
