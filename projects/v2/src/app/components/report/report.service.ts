import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Sheet, Row, CompareData, Structure, CompareReport, CompareReportData } from '../../models/sheet.model';
import { EnityWithNoOtherEntity, Report } from '../../models/report.model';
import {
  makeAS,
  makeCellTypes,
  makeBioMarkers,
} from '../../modules/tree/tree.functions';
import { B, bmCtPairings } from '../../models/tree.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private reportData = new Subject<any>();
  reportData$ = this.reportData.asObservable();
  private compareData = new Subject<CompareReportData>();
  compareData$ = this.compareData.asObservable();
  BM_TYPE =  {
    'gene' : 'BG',
    'protein' : 'BP',
    'lipids' : 'BL',
    'metabolites' : 'BM',
    'proteoforms' : 'BF',
  }
  constructor() {}

  async makeReportData(currentSheet: Sheet, data: Row[], biomarkerType?: string, isReportNotOrganWise = false) {
    const output: Report = {
      anatomicalStructures: [],
      cellTypes: [],
      biomarkers: [],
      ASWithNoLink: [],
      CTWithNoLink: [],
      BWithNoLink: [],
      ASWithNoCT: [],
      CTWithNoB: [],
    };

    try {
      output.anatomicalStructures = makeAS(data, true, isReportNotOrganWise);
      output.cellTypes = makeCellTypes(data, true, isReportNotOrganWise);
      output.biomarkers = makeBioMarkers(data, biomarkerType, true, isReportNotOrganWise);

      output.ASWithNoLink = this.getASWithNoLink(output.anatomicalStructures);
      output.CTWithNoLink = this.getCTWithNoLink(output.cellTypes);
      output.BWithNoLink = this.getBMWithNoLink(output.biomarkers);
      const {asWithNoCT, ctWithNoB} = this.getASWithNoCT(data);
      output.ASWithNoCT = asWithNoCT;
      output.CTWithNoB = ctWithNoB;

      this.reportData.next({
        data: output,
        sheet: currentSheet,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  countsGA(data) {
    const output = {
      AS : 0,
      CT : 0,
      B : 0,
    };
    output.AS = makeAS(data, true).length;
    output.CT = makeCellTypes(data, true).length;
    output.B = makeBioMarkers(data).length;
    return output;
  }

  countOrganWise(acc, curr, type) {
    let item = acc.find((x) => x.organName === curr.organName);
    if (!item) {
      item = { organName: curr.organName };
      item[type] = 0;
      acc.push(item);
    }
    item[type]++;
    return acc;
  }

  countSeperateBiomarkers(biomarkers) {
    return biomarkers.reduce((acc, curr) => {
      if (acc[curr.bType]) {
        acc[curr.bType].push(curr);
      }
      else {
        acc[curr.bType] = [];
        acc[curr.bType].push(curr);
      }
      return acc;
    }, {});
  }

  makeAllOrganReportDataByOrgan(sheetData: Row[], asFullData: Row[]) {
    const result = {
      anatomicalStructures: [],
      cellTypes: [],
      biomarkers: [],
      ASWithNoLink: [],
      CTWithNoLink: [],
      BWithNoLink: [],
      ASWithNoCT: [],
      CTWithNoB: [],
    };

    try {
      const as = makeAS(asFullData, true);
      const ct = makeCellTypes(sheetData, true, false);
      const b = makeBioMarkers(sheetData, 'All', true, false);
      result.anatomicalStructures = as.reduce(
        (acc, curr) => {
          return this.countOrganWise(acc, curr, 'anatomicalStructures');
        },
        []
      );
      result.ASWithNoLink = this.getASWithNoLink(as).reduce((acc, curr) => {
        return this.countOrganWise(acc, curr, 'ASWithNoLink');
      }, []);
      const {asWithNoCT, ctWithNoB} = this.getASWithNoCT(asFullData);
      result.ASWithNoCT = asWithNoCT.reduce((acc, curr) => {
        return this.countOrganWise(acc, curr, 'ASWithNoCT');
      }, []);

      result.CTWithNoB = ctWithNoB.reduce((acc, curr) => {
        return this.countOrganWise(acc, curr, 'CTWithNoB');
      }, []);

      const biomarkersSeperate = this.countSeperateBiomarkers(
        b
      );
      const biomarkersSeperateNames = [];
      Object.keys(biomarkersSeperate).forEach((bType) => {
        result[bType] = biomarkersSeperate[bType].reduce((acc, curr) => {
          return this.countOrganWise(acc, curr, bType);
        }, []);
        biomarkersSeperateNames.push({
          'type' : this.BM_TYPE[bType],
          'name' : bType, 
        });
      });
      result.biomarkers = b.reduce((acc, curr) => {
        return this.countOrganWise(acc, curr, 'biomarkers');
      }, []);
      result.cellTypes = ct.reduce((acc, curr) => {
        return this.countOrganWise(acc, curr, 'cellTypes');
      }, []);
      result.BWithNoLink = this.getCTWithNoLink(ct).reduce((acc, curr) => {
        return this.countOrganWise(acc, curr, 'BWithNoLink');
      }, []);
      result.CTWithNoLink = this.getBMWithNoLink(b).reduce((acc, curr) => {
        return this.countOrganWise(acc, curr, 'CTWithNoLink');
      }, []);
      return {result, biomarkersSeperateNames};
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  makeAllOrganReportDataCountsByOrgan(data, linksByOrgan) {
    let allData = [];
    Object.keys(data).forEach((type) => {
      allData = [...allData, ...data[type]];
    });
    allData =  allData.reduce((acc, curr) => {
      let item = acc.find((x) => x.organName === curr.organName);
      const index = acc.findIndex((x) => x.organName === curr.organName);
      if (!item) {
        item = curr;
        acc.push(item);
      } else {
        if (index > -1) {
          acc.splice(index, 1);
        }
        item = { ...item, ...curr };
        acc.push(item);
      }
      return acc;
    }, []);
    allData.forEach((countsByOrgan) => {
      countsByOrgan.AS_AS = linksByOrgan.AS_AS_organWise[countsByOrgan.organName];
      countsByOrgan.CT_BM = linksByOrgan.CT_B_organWise[countsByOrgan.organName];
      countsByOrgan.AS_CT = linksByOrgan.AS_CT_organWise[countsByOrgan.organName];
    });
    return allData;
  }

  async makeCompareData(
    reportdata: Report,
    compareData: Row[],
    compareSheets: CompareData[]
  ) {
    const compareDataStats = [];
    for (const sheet of compareSheets) {
      const newEntry: CompareReport = {
        identicalAS: [],
        newAS: [],
        identicalCT: [],
        newCT: [],
        identicalB: [],
        newB: [],
        color: '',
        title: '',
        description: '',
        identicalBMCTPair: []
      };

      const { identicalStructuresAS, newStructuresAS } = this.compareASData(
        reportdata,
        compareData
      );
      newEntry.identicalAS = identicalStructuresAS;
      newEntry.newAS = newStructuresAS;

      const { identicalStructuresCT, newStructuresCT } = this.compareCTData(
        reportdata,
        compareData
      );
      newEntry.identicalCT = identicalStructuresCT;
      newEntry.newCT = newStructuresCT;

      const { identicalStructuresB, newStructuresB, identicalBM } = this.compareBData(
        reportdata,
        compareData
      );
      newEntry.identicalBMCTPair = identicalBM;
      newEntry.identicalB = identicalStructuresB;
      newEntry.newB = newStructuresB;
      newEntry.color = sheet.color;
      newEntry.title = sheet.title;
      newEntry.description = sheet.description;

      compareDataStats.push(newEntry);
    }

    this.compareData.next({
      data: compareDataStats,
    });
  }

  compareASData(reportdata: Report, compareData: Row[]) {
    const identicalStructuresAS = [];
    const newStructuresAS = [];
    try {
      const compareAS = makeAS(compareData, true);
      const mainASData = reportdata.anatomicalStructures.filter(
        (i) => !i.isNew
      );
      const compareASData = compareAS.filter((i) => i.isNew);

      if (compareAS.length > 0) {
        for (const a of compareASData) {
          let found = false;
          for (const b of mainASData) {
            if (a.structure === b.structure && !b.isNew) {
              identicalStructuresAS.push(a.structure);
              found = true;
            }
          }

          if (!found) {
            newStructuresAS.push(a.structure);
          }
        }
      }
      return { identicalStructuresAS, newStructuresAS };
    } catch (err) {
      this.reportData.next({
        data: null,
      });
      return { identicalStructuresAS, newStructuresAS };
    }
  }

  compareCTData(reportdata: Report, compareData: Row[]) {
    const identicalStructuresCT = [];
    const newStructuresCT = [];
    try {
      const compareCT = makeCellTypes(compareData, true);
      const mainCTData = reportdata.cellTypes.filter((i) => !i.isNew);
      const compareCTData = compareCT.filter((i) => i.isNew);

      if (compareCT.length > 0) {
        for (const a of compareCTData) {
          let found = false;
          for (const b of mainCTData) {
            if (a.structure === b.structure && !b.isNew) {
              identicalStructuresCT.push(a.structure);
              found = true;
            }
          }

          if (!found) {
            newStructuresCT.push(a.structure);
          }
        }
      }
      return { identicalStructuresCT, newStructuresCT };
    } catch (err) {
      this.reportData.next({
        data: null,
      });
      return { identicalStructuresCT, newStructuresCT };
    }
  }

  compareBData(reportdata: Report, compareData: Row[]) {
    const identicalStructuresB = [];
    const newStructuresB = [];
    const identicalBM= [];
    try {
      const compareB = makeBioMarkers(compareData, '', true);
      const mainBData = reportdata.biomarkers.filter((i) => !i.isNew);
      const compareBData = compareB.filter((i) => i.isNew);

      if (compareB.length > 0) {
        for (const a of compareBData) {
          let found = false;
          for (const b of mainBData) {
            if (a.structure === b.structure && !b.isNew) {
              identicalStructuresB.push(a.structure);
              identicalBM.push(...this.findIdenticalBmCtLinks(a, mainBData, reportdata));
              found = true;
            }
          }

          if (!found) {
            newStructuresB.push(a.structure);
          }
        }
      }
      return { identicalStructuresB, newStructuresB, identicalBM };
    } catch (err) {
      this.reportData.next({
        data: null,
      });
      return { identicalStructuresB, newStructuresB, identicalBM };
    }
  }

  findIdenticalBmCtLinks(compareB: B, mainBData: B[], reportData: Report) {
    const mappings = new Set<bmCtPairings>();
    const bData = mainBData.filter(el => el.comparatorId === compareB.comparatorId);
    bData.forEach(b => {
      b.indegree.forEach(bin => {
        const ctData = reportData.cellTypes.find(ct => ct.comparatorId === bin.id);
        ctData.indegree.forEach(ctIn => {
          mappings.add({BM_NAME: b.comparatorName, BM_ID: b.comparatorId, CT_ID:bin.id, CT_NAME: bin.name, AS_ID: ctIn.id, AS_NAME: ctIn.name});
        });
      });
    });
    return mappings;
  }

  getASWithNoLink(anatomicalStructures) {
    const noLinks = [];
    anatomicalStructures.forEach((ele) => {
      if (
        !(
          ele.uberon.includes('UBERON') ||
          ele.uberon.includes('FMAID') ||
          ele.uberon.includes('fma')
        )
      ) {
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

  getASWithNoCT(data) {
    const asWithNoCT: EnityWithNoOtherEntity[] = [];
    const ctWithNoB: EnityWithNoOtherEntity[] = [];
    try {
      data.forEach((row: Row) => {
        if (row.cell_types.length === 0) {
          const asLeaf: Structure = row.anatomical_structures[row.anatomical_structures.length - 1];
          let foundIndex:number;
          if (asLeaf.id) {
            foundIndex = asWithNoCT.findIndex((i: EnityWithNoOtherEntity) => {
              return i.link === asLeaf.id && (i.organName === row.organName);
            });
          } else {
            foundIndex = asWithNoCT.findIndex((i: EnityWithNoOtherEntity) => {
              return i.structure === asLeaf.name && (i.organName === row.organName);
            });
          }
          if (foundIndex === -1) {
            asWithNoCT.push({
              structure: asLeaf.name,
              link: asLeaf.id,
              label: asLeaf.rdfs_label,
              organName: row.organName
            });
          }
        }
        if (row.biomarkers.length === 0) {
          row.cell_types.forEach((ct: Structure) => {
            let foundIndex:number;
            if (ct.id) {
              foundIndex = ctWithNoB.findIndex((i: EnityWithNoOtherEntity) => {
                return i.link === ct.id && (i.organName === row.organName);
              });
            } else {
              foundIndex = ctWithNoB.findIndex((i: EnityWithNoOtherEntity) => {
                return i.structure === ct.name && (i.organName === row.organName);
              });
            }
            if (foundIndex === -1) {
              ctWithNoB.push({
                structure: ct.name,
                link: ct.id,
                label: ct.rdfs_label,
                organName: row.organName
              });
            }
          });
        }
      });
  
      return { asWithNoCT, ctWithNoB };
    } catch (error) {
      throw new Error(`Could not process Sheet Data - ${error}`);
    }
  }

}
