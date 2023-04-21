import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { ReportService } from './report.service';
import { BiomarkersCounts, BiomarkersNamesInReport, CByOrgan, Report } from '../../models/report.model';
import { CompareData, Row, Sheet, SheetConfig } from '../../models/sheet.model';

import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { GaAction, GaCategory } from '../../models/ga.model';
import { TreeService } from '../../modules/tree/tree.service';
import { bmCtPairings, linksASCTBData } from '../../models/tree.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit, AfterViewInit {
  reportData: Report = {
    anatomicalStructures: [],
    cellTypes: [],
    biomarkers: [],
    ASWithNoLink: [],
    CTWithNoLink: [],
    BWithNoLink: [],
    ASWithNoCT: [],
    CTWithNoB: [],
  };
  resultDataByOrganName: Report = {
    anatomicalStructures: [],
    ASWithNoLink: [],
    CTWithNoLink: [],
    BWithNoLink: [],
    cellTypes: [],
    biomarkers: [],
    ASWithNoCT: [],
    CTWithNoB: [],
  };
  countsByOrgan: MatTableDataSource<CByOrgan[]> = new MatTableDataSource();
  displayedColumns: string[] = [
    'organName',
    'ASWithNoLink',
    'CTWithNoLink',
    'BWithNoLink',
    'ASWithNoCT',
    'CTWithNoB',
    'AS_AS',
    'AS_CT',
    'CT_BM',
    'anatomicalStructures',
    'cellTypes'
  ];
  biomarkersSeperateNames: BiomarkersNamesInReport[];
  compareReport: any;
  clickButton = false; // for mat expansion panel download button

  @ViewChild(MatSort) sort: MatSort;
  ontologyLinkGraphData = [];
  SheetConfig: SheetConfig;
  total_AS_AS: number;
  biomarkersCounts: BiomarkersCounts[] = [];

  @Input() compareSheets: CompareData[];
  @Input() sheetData: Row[];
  @Input() asFullData: Row[];
  @Input() fullDataByOrgan: Array<Row[]>;
  @Input() currentSheet: Sheet;
  @Input() linksData$: Observable<linksASCTBData>;
  @Input() inputReportData: Observable<Report>;
  @Input() currentSheetConfig: Observable<SheetConfig>;
  @Input() compareData: Observable<any>;
  @Input() bmType: string;
  @Input() hideReportCompareTab = false;
  @Output() closeReport: EventEmitter<any> = new EventEmitter<any>();
  @Output() computedReport: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteSheet: EventEmitter<any> = new EventEmitter<any>();
  total_AS_CT: number;
  total_CT_B: number;

  constructor(
    public reportService: ReportService,
    public ts: TreeService,
    public ga: GoogleAnalyticsService
  ) { }

  ngOnInit(): void {
    this.reportService.reportData$.subscribe((data) => {
      this.reportData = data.data;
      this.computedReport.emit(data.data);

      this.ontologyLinkGraphData = this.makeOntologyLinksGraphData(data.data, this.sheetData);

    });
    this.linksData$.subscribe((data) => {
      this.total_AS_AS = data.AS_AS;
      this.total_AS_CT = data.AS_CT;
      this.total_CT_B = data.CT_B;
    });

    this.reportService.compareData$.subscribe((data) => {
      this.compareReport = data.data;
    });

    this.currentSheetConfig.subscribe((data) => {
      this.SheetConfig = data;
    });

    this.compareData.subscribe((data) => {
      if (data.sheets.length && data.data.length) {
        this.reportService.makeCompareData(
          this.reportData,
          data.data,
          data.sheets
        );
      }
    });

    this.fullDataByOrgan.forEach((data) => {
      this.ts.makeTreeData(this.currentSheet, data, this.compareData, true);
    });

    this.reportService.makeReportData(
      this.currentSheet,
      this.sheetData,
      this.bmType,
      true
    );
  }

  ngAfterViewInit() { }

  makeOntologyLinksGraphData(reportData: Report, sheetData: Row[]) {
    const { result, biomarkersSeperateNames } =
      this.reportService.makeAllOrganReportDataByOrgan(sheetData, this.asFullData);

    const biomarkerCols = [];
    biomarkersSeperateNames.forEach((bm) => {
      if (this.displayedColumns.includes(bm.name) === false) {
        biomarkerCols.push(bm.name);
      }
      this.displayedColumns = [
        'organName',
        'anatomicalStructures',
        'cellTypes',
        'b_total',
        ...biomarkerCols,
        'ASWithNoLink',
        'CTWithNoLink',
        'BWithNoLink',
        'ASWithNoCT',
        'CTWithNoB',
        'AS_AS',
        'AS_CT',
        'CT_BM',
      ];
    });

    this.biomarkersSeperateNames = biomarkersSeperateNames;
    this.linksData$.subscribe((data) => {
      this.countsByOrgan =
        new MatTableDataSource(this.reportService.makeAllOrganReportDataCountsByOrgan(result, data).sort((a, b) => a.organName.localeCompare(b.organName)));
      this.biomarkersCounts = [];
      this.biomarkersSeperateNames.forEach((bm) => {
        this.biomarkersCounts.push({ name: bm.name, value: this.countsByOrgan.data[0][bm.name] });
      });
      this.countsByOrgan.sort = this.sort;
    });
    return [
      {
        results: [
          {
            name: 'with Uberon Links',
            value:
              reportData.anatomicalStructures.length -
              reportData.ASWithNoLink.length,
          },
          {
            name: 'without Uberon Links',
            value: reportData.ASWithNoLink.length,
          },
        ],
        label: 'Total Anatomical Structures',
      },
      {
        results: [
          {
            name: 'with CL Links',
            value: reportData.cellTypes.length - reportData.CTWithNoLink.length,
          },
          { name: 'without CL Links', value: reportData.CTWithNoLink.length },
        ],
        label: 'Total Cell Types',
      },
      {
        results: [
          {
            name: 'with HGNC Links',
            value: reportData.biomarkers.length - reportData.BWithNoLink.length,
          },
          { name: 'without HGNC Links', value: reportData.BWithNoLink.length },
        ],
        label: this.getBiomarkerLabel(this.bmType),
      },
    ];
  }

  getBiomarkerLabel(bmType) {
    return bmType === 'Gene'
      ? 'Total Gene Biomarkers'
      : bmType === 'Protein'
        ? 'Total Protein Biomarkers'
        : bmType === 'Lipids'
          ? 'Total Lipids Biomarkers'
          : bmType === 'Metabolites'
            ? 'Total Metabolites Biomarkers'
            : bmType === 'Proteoforms'
              ? 'Total Proteoforms Biomarkers'
              : 'Total Biomarkers';
  }

  customColors(v: string) {
    const mapper = {
      'with Uberon Links': '#E41A1C',
      'without Uberon Links': '#f5bcba',
      'with CL Links': '#377EB8',
      'without CL Links': '#abc9eb',
      'with HGNC Links': '#4DAF4A',
      'without HGNC Links': '#bce8be',
    };
    return mapper[v];
  }

  deleteCompareSheetReport(i) {
    this.clickButton = true;
    this.compareReport.splice(i, 1);
    this.deleteSheet.emit(i);

    this.ga.event(
      GaAction.CLICK,
      GaCategory.REPORT,
      'Delete a sheet comparison',
      i
    );
  }

  getTotals(data: CByOrgan[][], key: string) {
    return data.map(t => t[key] ? t[key] : 0).reduce((acc, value) => acc + value, 0);
  }

  downloadData() {
    const download = [];
    const totalRows = 6;
    for (
      let i = 0;
      i <
      Math.max(
        this.reportData.anatomicalStructures.length,
        this.reportData.cellTypes.length,
        this.reportData.biomarkers.length
      );
      i++
    ) {
      const row = {};
      if (i < this.reportData.anatomicalStructures.length) {
        row['Unique Anatomical Structures'] =
          this.reportData.anatomicalStructures[i].structure;
        if (
          !this.reportData.anatomicalStructures[i].uberon.includes('UBERON')
        ) {
          row['AS with no Uberon Link'] =
            this.reportData.anatomicalStructures[i].structure;
        }
      }
      if (i < this.reportData.cellTypes.length) {
        row['Unique Cell Types'] = this.reportData.cellTypes[i].structure;
        row['CT ID'] = this.reportData.cellTypes[i].link;
        if (!this.reportData.cellTypes[i].link.includes('CL')) {
          row['CL with no Link'] = this.reportData.cellTypes[i].structure;
        }
      }
      if (i < this.reportData.biomarkers.length) {
        row['Unique Biomarkers'] = this.reportData.biomarkers[i].structure;
        row['BM ID'] = this.reportData.biomarkers[i].link;

      }
      if (i < this.reportData.BWithNoLink.length) {
        row['Biomarkers with no links'] = this.reportData.BWithNoLink[i].structure;
      }
      download.push(row);
    }

    const sheetWS = XLSX.utils.json_to_sheet(download);
    sheetWS['!cols'] = [];
    for (let i = 0; i < totalRows; i++) {
      sheetWS['!cols'].push({ wch: 30 });
    }
    const dt = moment(new Date()).format('YYYY.MM.DD_hh.mm');
    const sn = this.currentSheet.display.toLowerCase().replace(' ', '_');

    return {
      sheet: sheetWS,
      sheetName: this.currentSheet.display,
      name: `ASCT+B-Reporter_${sn}_${dt}_Report.xlsx`,
    };
  }


  downloadReport(i = -1) {
    const wb = XLSX.utils.book_new();
    const allReport = [];

    /**
     * When all reports need to be downloaded
     */
    if (i === -1) {
      allReport.push(this.downloadData());
      this.ga.event(
        GaAction.CLICK,
        GaCategory.REPORT,
        'Download Full Report'
      );

      if (this.compareReport) {
        for (const [sheet, _unused] of this.compareReport.entries()) {
          allReport.push(this.downloadCompareSheetReport(sheet));
        }
      }
    } else {
      /**
       * When a single compare sheet report needs to be downloaded
       * Not firing a Google Analytics event in this case since the downloadCompareSheetReport() method already does so.
       */
      allReport.push(this.downloadCompareSheetReport(i));
    }

    for (const book of allReport) {
      XLSX.utils.book_append_sheet(wb, book.sheet, book.sheetName);
    }

    XLSX.writeFile(wb, allReport[0].name);
  }

  downloadReportByOrgan() {
    const sheetName = 'countByOrgan';
    const fileName = 'countsByOrgans';
    const targetTableElm = document.getElementById('countsByOrgans');
    const allReport = [];

    const organsList: string[] = [];


    const wb = XLSX.utils.table_to_book(targetTableElm, {
      sheet: sheetName
    } as XLSX.Table2SheetOpts);

    this.fullDataByOrgan.forEach((data) => {
      organsList.push(data[0].organName);
      this.reportService.makeReportData(
        this.currentSheet,
        data,
        this.bmType,
      );
      allReport.push(this.downloadData());
    });

    this.reportService.makeReportData(
      this.currentSheet,
      this.sheetData,
      this.bmType
    );

    let i = 0;
    for (const book of allReport) {
      XLSX.utils.book_append_sheet(wb, book.sheet, organsList[i]);
      i += 1;
    }

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  downloadCompareSheetReport(i: number) {
    this.clickButton = true;
    const totalRows = 6;
    const sheet = this.compareReport[i];
    const keyMapper = {
      identicalAS: 'Identical Anatomical Structures',
      newAS: 'New Anatomical Structres',
      identicalCT: 'Identical Cell Types',
      newCT: 'New Cell Types',
      identicalB: 'Identical Biomarkers',
      newB: 'New Biomarkers',
    };

    let download = [];
    const keys = Object.keys(this.compareReport[i]);

    for (const key of keys) {
      if (typeof sheet[key] === 'object' && key in keyMapper) {
        for (const [idx, value] of sheet[key].entries()) {
          const t = {};
          t[keyMapper[key]] = value;

          if (download[idx]) {
            download[idx] = { ...download[idx], ...t };
          } else {
            download.push(t);
          }
        }
      }
    }
    download = this.getBMCTAS(sheet.identicalBMCTPair, download);
    const sheetWS = XLSX.utils.json_to_sheet(download);

    sheetWS['!cols'] = [];
    for (let j = 0; j < totalRows; j++) {
      sheetWS['!cols'].push({ wch: 30 });
    }
    const dt = moment(new Date()).format('YYYY.MM.DD_hh.mm');
    const sn = sheet.title.toLowerCase().replace(' ', '_');

    this.ga.event(
      GaAction.CLICK,
      GaCategory.REPORT,
      'Compare sheet download',
      sn
    );

    return {
      sheet: sheetWS,
      sheetName: sheet.title,
      name: `ASCT+B-Reporter_Derived_${sn}_${dt}_Report.xlsx`,
    };
  }


  getBMCTAS(bmCtPairs: Set<bmCtPairings>, download: Record<string, string>[]) {
    const AS_CT_BM: Set<string> = new Set<string>();
    let index = 0;
    bmCtPairs.forEach(pair => {
      const newPair = `${pair.AS_NAME} (${pair.AS_ID}), ${pair.CT_NAME} (${pair.CT_ID}), ${pair.BM_NAME}(${pair.BM_ID})`;
      if (!AS_CT_BM.has(newPair)) {
        AS_CT_BM.add(newPair);
        const t = { '': '', 'AS': `${pair.AS_NAME} (${pair.AS_ID})`, 'CT': `${pair.CT_NAME} (${pair.CT_ID})`, 'BM': `${pair.BM_NAME} (${pair.BM_ID})` };

        if (download[index]) {
          download[index] = { ...download[index], ...t };
        } else {
          download.push(t);
        }
        index += 1;
      }
    });
    return download;
  }
}
