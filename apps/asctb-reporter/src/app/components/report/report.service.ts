import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  CByOrgan,
  EntityWithNoOtherEntity,
  Report,
} from '../../models/report.model';
import {
  CompareData,
  CompareReport,
  CompareReportData,
  Row,
  Sheet,
  Structure,
} from '../../models/sheet.model';
import {
  AS,
  B,
  BmCtPairings,
  CT,
  LinksASCTBData,
} from '../../models/tree.model';
import {
  makeAS,
  makeBioMarkers,
  makeCellTypes,
} from '../../modules/tree/tree.functions';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private reportData = new Subject<{ data: Report | null; sheet?: Sheet }>();
  reportData$ = this.reportData.asObservable();
  private compareData = new Subject<CompareReportData>();
  compareData$ = this.compareData.asObservable();
  BM_TYPE = {
    gene: 'BG',
    protein: 'BP',
    lipids: 'BL',
    metabolites: 'BM',
    proteoforms: 'BF',
  };

  async makeReportData(
    currentSheet: Sheet,
    data: Row[],
    biomarkerType?: string,
    isReportNotOrganWise = false
  ) {
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
      output.biomarkers = makeBioMarkers(
        data,
        biomarkerType,
        true,
        isReportNotOrganWise
      );

      output.ASWithNoLink = this.getASWithNoLink(output.anatomicalStructures);
      output.CTWithNoLink = this.getCTWithNoLink(output.cellTypes);
      output.BWithNoLink = this.getBMWithNoLink(output.biomarkers);
      const { asWithNoCT, ctWithNoB } = this.getASWithNoCT(data);
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

  countsGA(data: Row[]) {
    const output = {
      AS: 0,
      CT: 0,
      B: 0,
    };
    output.AS = makeAS(data, true).length;
    output.CT = makeCellTypes(data, true).length;
    output.B = makeBioMarkers(data).length;
    return output;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  countOrganWise(acc: any[], curr: any, type: string): any[] {
    let item = acc.find((x) => x.organName === curr.organName);
    if (!item) {
      item = { organName: curr.organName };
      item[type] = 0;
      acc.push(item);
    }
    item[type]++;
    return acc;
  }

  countSeperateBiomarkers(biomarkers: B[]) {
    return biomarkers.reduce((acc, curr) => {
      if (curr.bType !== undefined) {
        if (acc[curr.bType]) {
          acc[curr.bType].push(curr);
        } else {
          acc[curr.bType] = [];
          acc[curr.bType].push(curr);
        }
      }
      return acc;
    }, {} as Record<string, B[]>);
  }

  makeAllOrganReportDataByOrgan(sheetData: Row[], asFullData: Row[]) {
    const result: Report = {
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
      result.anatomicalStructures = as.reduce<AS[]>((acc, curr) => {
        return this.countOrganWise(acc, curr, 'anatomicalStructures');
      }, []);
      result.ASWithNoLink = this.getASWithNoLink(as).reduce<AS[]>(
        (acc, curr) => {
          return this.countOrganWise(acc, curr, 'ASWithNoLink');
        },
        []
      );
      const { asWithNoCT, ctWithNoB } = this.getASWithNoCT(asFullData);
      result.ASWithNoCT = asWithNoCT.reduce<EntityWithNoOtherEntity[]>(
        (acc, curr) => {
          return this.countOrganWise(acc, curr, 'ASWithNoCT');
        },
        []
      );

      result.CTWithNoB = ctWithNoB.reduce<EntityWithNoOtherEntity[]>(
        (acc, curr) => {
          return this.countOrganWise(acc, curr, 'CTWithNoB');
        },
        []
      );

      const biomarkersSeperate = this.countSeperateBiomarkers(b);
      const biomarkersSeperateNames: { type: string; name: string }[] = [];
      Object.keys(biomarkersSeperate).forEach((bType) => {
        result[bType as keyof typeof result] = biomarkersSeperate[bType].reduce(
          (acc, curr) => {
            return this.countOrganWise(acc, curr, bType);
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [] as any[]
        ) as unknown as never[];
        biomarkersSeperateNames.push({
          type: this.BM_TYPE[bType as keyof typeof this.BM_TYPE],
          name: bType,
        });
      });
      result.biomarkers = b.reduce<B[]>((acc, curr) => {
        return this.countOrganWise(acc, curr, 'biomarkers');
      }, []);
      result.cellTypes = ct.reduce<CT[]>((acc, curr) => {
        return this.countOrganWise(acc, curr, 'cellTypes');
      }, []);
      result.BWithNoLink = this.getCTWithNoLink(ct).reduce<B[]>((acc, curr) => {
        return this.countOrganWise(acc, curr, 'BWithNoLink');
      }, []);
      result.CTWithNoLink = this.getBMWithNoLink(b).reduce<B[]>((acc, curr) => {
        return this.countOrganWise(acc, curr, 'CTWithNoLink');
      }, []);
      return { result, biomarkersSeperateNames };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  makeAllOrganReportDataCountsByOrgan(
    data: Report,
    linksByOrgan: LinksASCTBData,
    tableVersion: Map<string, string>
  ) {
    let allData: (AS | CT | B | EntityWithNoOtherEntity)[] = [];
    Object.keys(data).forEach((type) => {
      allData = [...allData, ...data[type as keyof Report]];
    });
    allData = allData.reduce<(AS | CT | B | EntityWithNoOtherEntity)[]>(
      (acc, curr) => {
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
      },
      []
    );
    for (let index = 0; index < allData.length; index++) {
      const organData = allData[index];
      allData[index] = {
        ...organData,
        tableVersion: tableVersion.get(organData.organName ?? ''),
      } as never;
    }
    allData.forEach((item) => {
      const organName = item.organName ?? '';
      const countsByOrgan = item as unknown as Record<string, number>;
      countsByOrgan['AS_AS'] = linksByOrgan.AS_AS_organWise[organName];
      countsByOrgan['CT_BM'] = linksByOrgan.CT_B_organWise[organName];
      countsByOrgan['AS_CT'] = linksByOrgan.AS_CT_organWise[organName];
    });
    return allData as CByOrgan[];
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
        identicalBMCTPair: [],
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

      const { identicalStructuresB, newStructuresB, identicalBM } =
        this.compareBData(reportdata, compareData);
      newEntry.identicalBMCTPair = identicalBM as unknown as Row[];
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
    } catch {
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
    } catch {
      this.reportData.next({
        data: null,
      });
      return { identicalStructuresCT, newStructuresCT };
    }
  }

  compareBData(reportdata: Report, compareData: Row[]) {
    const identicalStructuresB = [];
    const newStructuresB = [];
    const identicalBM = [];
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
              identicalBM.push(
                ...this.findIdenticalBmCtLinks(a, mainBData, reportdata)
              );
              found = true;
            }
          }

          if (!found) {
            newStructuresB.push(a.structure);
          }
        }
      }
      return { identicalStructuresB, newStructuresB, identicalBM };
    } catch {
      this.reportData.next({
        data: null,
      });
      return { identicalStructuresB, newStructuresB, identicalBM };
    }
  }

  findIdenticalBmCtLinks(compareB: B, mainBData: B[], reportData: Report) {
    const mappings = new Set<BmCtPairings>();
    const bData = mainBData.filter(
      (el) => el.comparatorId === compareB.comparatorId
    );
    bData.forEach((b) => {
      b.indegree?.forEach((bin) => {
        const ctData = reportData.cellTypes.find(
          (ct) => ct.comparatorId === bin.id
        );
        ctData?.indegree?.forEach((ctIn) => {
          mappings.add({
            BM_NAME: b.comparatorName ?? '',
            BM_ID: b.comparatorId ?? '',
            CT_ID: bin.id,
            CT_NAME: bin.name,
            AS_ID: ctIn.id,
            AS_NAME: ctIn.name,
          });
        });
      });
    });
    return mappings;
  }

  getASWithNoLink(anatomicalStructures: AS[]) {
    const noLinks: AS[] = [];
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

  getCTWithNoLink(cellTypes: CT[]) {
    const noLinks: CT[] = [];
    cellTypes.forEach((ele) => {
      if (!ele.link.includes('CL')) {
        noLinks.push(ele);
      }
    });
    return noLinks;
  }
  getBMWithNoLink(biomarkers: B[]) {
    const noLinks: B[] = [];
    biomarkers.forEach((ele) => {
      if (!ele.link.includes('HGNC')) {
        noLinks.push(ele);
      }
    });
    return noLinks;
  }

  getASWithNoCT(data: Row[]) {
    const asWithNoCT: EntityWithNoOtherEntity[] = [];
    const ctWithNoB: EntityWithNoOtherEntity[] = [];
    try {
      data.forEach((row: Row) => {
        if (row.cell_types.length === 0) {
          const asLeaf: Structure =
            row.anatomical_structures[row.anatomical_structures.length - 1];
          let foundIndex: number;
          if (asLeaf.id) {
            foundIndex = asWithNoCT.findIndex((i: EntityWithNoOtherEntity) => {
              return i.link === asLeaf.id && i.organName === row.organName;
            });
          } else {
            foundIndex = asWithNoCT.findIndex((i: EntityWithNoOtherEntity) => {
              return (
                i.structure === asLeaf.name && i.organName === row.organName
              );
            });
          }
          if (foundIndex === -1) {
            asWithNoCT.push({
              structure: asLeaf.name ?? '',
              link: asLeaf.id ?? '',
              label: asLeaf.rdfs_label ?? '',
              organName: row.organName,
            });
          }
        }
        if (row.biomarkers.length === 0) {
          row.cell_types.forEach((ct: Structure) => {
            let foundIndex: number;
            if (ct.id) {
              foundIndex = ctWithNoB.findIndex((i: EntityWithNoOtherEntity) => {
                return i.link === ct.id && i.organName === row.organName;
              });
            } else {
              foundIndex = ctWithNoB.findIndex((i: EntityWithNoOtherEntity) => {
                return i.structure === ct.name && i.organName === row.organName;
              });
            }
            if (foundIndex === -1) {
              ctWithNoB.push({
                structure: ct.name ?? '',
                link: ct.id ?? '',
                label: ct.rdfs_label ?? '',
                organName: row.organName,
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
