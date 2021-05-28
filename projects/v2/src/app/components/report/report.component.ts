import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { ReportService } from './report.service';
import { CByOrgan, Report } from '../../models/report.model';
import { Sheet, SheetConfig } from '../../models/sheet.model';

import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { GaAction, GaCategory } from '../../models/ga.model';

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
  };
  resultDataByOrganName: Report = {
    anatomicalStructures: [],
    ASWithNoLink: [],
    CTWithNoLink: [],
    BWithNoLink: [],
    cellTypes: [],
    biomarkers: [],
  };
  countsByOrgan: CByOrgan[];
  displayedColumns: string[] = [
    'organName',
    'anatomicalStructures',
    'cellTypes',
    'biomarkers',
  ];
  compareReport: any;
  compareDataAndSheets: any;
  clickButton = false; // for mat expansion panel download button

  ontologyLinkGraphData = [];
  SheetConfig: SheetConfig;

  @Input() compareSheets: any;
  @Input() sheetData: any;
  @Input() currentSheet: Sheet;
  @Input() linksData: any;
  @Input() inputReportData: Observable<any>;
  @Input() currentSheetConfig: Observable<any>;
  @Input() compareData: Observable<any>;
  @Input() bmType: string;
  @Output() closeReport: EventEmitter<any> = new EventEmitter<any>();
  @Output() computedReport: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteSheet: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public reportService: ReportService,
    public ga: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.reportService.reportData$.subscribe((data) => {
      this.reportData = data.data;
      this.computedReport.emit(data.data);

      this.ontologyLinkGraphData = this.makeOntologyLinksGraphData(data.data);
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

    this.reportService.makeReportData(
      this.currentSheet,
      this.sheetData,
      this.bmType
    );
  }

  ngAfterViewInit() {}

  makeOntologyLinksGraphData(reportData: Report) {
    if (this.SheetConfig.show_all_AS && this.currentSheet.name === 'all') {
      this.resultDataByOrganName =
        this.reportService.makeAllOrganReportDataByOrgan(reportData);
      this.countsByOrgan =
        this.reportService.makeAllOrganReportDataCountsByOrgan(
          this.resultDataByOrganName
        );
    }
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
      : bmType === 'Metalloids'
      ? 'Total Metalloids Biomarkers'
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

    this.ga.eventEmitter(
      'report_compare_delete',
      GaCategory.REPORT,
      'Delete a sheet comparison',
      GaAction.CLICK,
      i
    );
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
        if (!this.reportData.cellTypes[i].link.includes('CL')) {
          row['CL with no Link'] = this.reportData.cellTypes[i].structure;
        }
      }
      if (i < this.reportData.biomarkers.length) {
        row['Unique Biomarkers'] = this.reportData.biomarkers[i].structure;
        row['Biomarkers with no links'] =
          this.reportData.biomarkers[i].structure;
      }
      download.push(row);
    }

    const sheetWS = XLSX.utils.json_to_sheet(download);
    sheetWS['!cols'] = [];
    for (let i = 0; i < totalRows; i++) {
      sheetWS['!cols'].push({ wch: 30 });
    }
    const wb = XLSX.utils.book_new();
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

      // Tracking the 'Download All' use case from the header button.
      this.ga.eventEmitter(
        'report_download_full',
        GaCategory.REPORT,
        'Download Full Report',
        GaAction.CLICK
      );

      if (this.compareReport) {
        for (const [sheet, ele] of this.compareReport.entries()) {
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
    const download = [];
    const keys = Object.keys(this.compareReport[i]);

    for (const key of keys) {
      if (typeof sheet[key] === 'object') {
        for (const [idx, value] of sheet[key].entries()) {
          const t = {};
          t[keyMapper[key]] = value;

          if (!!download[idx]) {
            download[idx] = { ...download[idx], ...t };
          } else {
            download.push(t);
          }
        }
      }
    }

    const sheetWS = XLSX.utils.json_to_sheet(download);

    sheetWS['!cols'] = [];
    for (let j = 0; j < totalRows; j++) {
      sheetWS['!cols'].push({ wch: 30 });
    }
    const wb = XLSX.utils.book_new();
    const dt = moment(new Date()).format('YYYY.MM.DD_hh.mm');
    const sn = sheet.title.toLowerCase().replace(' ', '_');

    this.ga.eventEmitter(
      'report_compare_download',
      GaCategory.REPORT,
      'Compare sheet download',
      GaAction.CLICK,
      sn
    );

    return {
      sheet: sheetWS,
      sheetName: sheet.title,
      name: `ASCT+B-Reporter_Derived_${sn}_${dt}_Report.xlsx`,
    };
  }
}
