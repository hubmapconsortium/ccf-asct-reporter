import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from '@angular/core';
import { ReportService } from '../report/report.service';
import { SheetService } from '../services/sheet.service';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import {GoogleAnalyticsService} from './../google-analytics.service';

export class AS {
  structure: string;
  uberon: string;
}

export interface Entry {
  identicalAS: Array<string>;
  identicalCT: Array<string>;
  identicalB: Array<string>;
  newAS: Array<string>;
  newCT: Array<string>;
  newB: Array<string>;
  color: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit, OnChanges {
  sheetData;
  anatomicalStructures = [];
  cellTypes = [];
  bioMarkers = [];
  similarAS = [];
  similarCT = [];
  similarB = [];
  warningCount = 0;
  compareDataStats = [];
  clickButton = false; // for mat expansion panel download button
  isVisible = false;  // for report on load, befor count populated
  @Output() closeComponent = new EventEmitter();
  @Output() openCompareDialog = new EventEmitter();
  @Output() deleteSheet = new EventEmitter();
  @Input() refreshData;
  @Input() dataVersion;
  @Input() public compareData = [];
  @Input() public shouldReloadData;
  @Input() currentSheet: any;

  sheetName = 'Spleen_R2';

  constructor(public report: ReportService, public sheet: SheetService, public googleAnalyticsService: GoogleAnalyticsService) {
  }

  async ngOnChanges() {

  }

  async makeCompareData() {
    for (const sheet of this.compareData) {
      const newEntry: any = {};
      let compareAS;
      let compareCT;
      let compareB;
      let identicalStructures = [];
      let newStructures = [];

      try {
        compareAS = await this.sheet.makeAS(sheet.data, {
          report_cols: this.currentSheet.report_cols,
          cell_col: this.currentSheet.cell_col,
          marker_col: this.currentSheet.marker_col,
          uberon_col: this.currentSheet.uberon_col,
        });

        if (compareAS.length > 0 ) {
          for (const a of compareAS) {
            const findObj = this.anatomicalStructures.findIndex(i => i.structure === a.structure);
            if (findObj !== -1) { identicalStructures.push(a.structure); }
            else { newStructures.push(a.structure); }
          }
        }
      } catch (err) {
        console.log(err);
      }

      newEntry.identicalAS = identicalStructures;
      newEntry.newAS = newStructures;
      identicalStructures = [];
      newStructures = [];

      try {
        compareCT = await this.sheet.makeCellTypes(sheet.data, {
          report_cols: this.currentSheet.report_cols,
          cell_col: this.currentSheet.cell_col,
          marker_col: this.currentSheet.marker_col,
          uberon_col: this.currentSheet.uberon_col,
        });

        if (compareCT.length > 0 ) {
          for (const a of compareCT) {
            const findObj = this.cellTypes.findIndex(i => i.structure === a.structure);
            if (findObj !== -1) { identicalStructures.push(a.structure); }
            else { newStructures.push(a.structure); }
          }
        }
      } catch (err) {
        console.log(err);
      }

      newEntry.identicalCT = identicalStructures;
      newEntry.newCT = newStructures;
      identicalStructures = [];
      newStructures = [];

      try {
        compareB = await this.sheet.makeBioMarkers(sheet.data, {
          report_cols: this.currentSheet.report_cols,
          cell_col: this.currentSheet.cell_col,
          marker_col: this.currentSheet.marker_col,
          uberon_col: this.currentSheet.uberon_col,
        });

        if (compareB.length > 0 ) {
          for (const a of compareB) {
            const findObj = this.bioMarkers.findIndex(i => i.structure === a.structure);
            if (findObj !== -1) { identicalStructures.push(a.structure); }
            else { newStructures.push(a.structure); }
          }
        }
      } catch (err) {
        console.log(err);
      }

      newEntry.identicalB = identicalStructures;
      newEntry.newB = newStructures;
      newEntry.color = sheet.color;
      newEntry.title = sheet.title;
      newEntry.description = sheet.description;

      this.compareDataStats.push(newEntry);
    }
  }

  ngOnInit(): void {
    this.getData(this.currentSheet);
  }

  public async getData(currentSheet) {
    this.sheetData = await this.sheet.getSheetData(this.currentSheet, this.dataVersion);
    try {
      this.anatomicalStructures = await this.sheet.makeAS(this.sheetData.data, {
        report_cols: currentSheet.report_cols,
        cell_col: currentSheet.cell_col,
        marker_col: currentSheet.marker_col,
        uberon_col: currentSheet.uberon_col,
      });
      this.cellTypes = await this.sheet.makeCellTypes(this.sheetData.data, {
        report_cols: currentSheet.report_cols,
        cell_col: currentSheet.cell_col,
        uberon_col: currentSheet.uberon_col,
        marker_col: currentSheet.marker_col
      });
      this.bioMarkers = await this.sheet.makeBioMarkers(this.sheetData.data, {
        marker_col: currentSheet.marker_col,
        uberon_col: currentSheet.uberon_col
      });

      if (this.compareData.length) {
        this.makeCompareData();
      }

      this.isVisible = true;
    } catch (err) {
      console.log(err);
    }
  }

  downloadData() {
    const download = [];
    const totalRows = 6;
    for (let i = 0; i < Math.max(this.anatomicalStructures.length, this.cellTypes.length, this.bioMarkers.length); i++) {
      const row = {};
      if (i < this.anatomicalStructures.length) {
        row['Unique Anatomical Structres'] = this.anatomicalStructures[i].structure;
        if (!this.anatomicalStructures[i].uberon.includes('UBERON')) {
          row['AS with no Uberon Link'] = this.anatomicalStructures[
            i
          ].structure;
        }
      }
      if (i < this.cellTypes.length) {
        row['Unique Cell Types'] = this.cellTypes[i].structure;
        if (!this.cellTypes[i].link.includes('CL')) {
          row['CL with no Link'] = this.cellTypes[i].structure;
        }
      }
      if (i < this.bioMarkers.length) {
        row['Unique Biomarkers'] = this.bioMarkers[i].structure;
        row['Biomarkers with no links'] = this.bioMarkers[i].structure;
      }

      if (i < this.similarAS.length) {
        row['Similar AS from Derived Data'] = this.similarAS[i].name;
      }

      if (i < this.similarCT.length) {
        row['Similar CT from Derived Data'] = this.similarCT[i].name;
      }

      if (i < this.similarB.length) {
        row['Similar B from Derived Data'] = this.similarB[i].name;
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
      name:  `ASCT+B-Reporter_${sn}_${dt}_Report.xlsx`
    };
  }

  getASWithNoLink() {
    const noLinks = [];
    this.anatomicalStructures.forEach((ele) => {
      if (!ele.uberon.includes('UBERON')) {
        noLinks.push(ele);
      }
    });
    return noLinks;
  }

  getCTWithNoLink() {
    const noLinks = [];
    this.cellTypes.forEach((ele) => {
      if (!ele.link.includes('CL')) {
        noLinks.push(ele);
      }
    });
    return noLinks;
  }
  getBMWithNoLink() {
    const noLinks = [];
    this.bioMarkers.forEach((ele) => {
      if (!ele.link.includes('HGNC')) {
        noLinks.push(ele);
      }
    });
    return noLinks;
  }

  downloadReport(i= -1) {
    const wb = XLSX.utils.book_new();
    const allReport = [];

    /**
     * When all reports need to be downloaded
     */
    if (i === -1) {
      allReport.push(this.downloadData());

      for (const [sheet, ele] of this.compareDataStats.entries()) {
        allReport.push(this.downloadCompareSheetReport(sheet));
      }
    } else {
      /**
       * When a single compare sheet report needs to be downloaded
       */
      allReport.push(this.downloadCompareSheetReport(i));
    }

    for (const book of allReport) {
      XLSX.utils.book_append_sheet(wb, book.sheet, book.sheetName);
    }

    XLSX.writeFile(wb, allReport[0].name);
    this.googleAnalyticsService.eventEmitter('report_download', 'click',  'report', 'Download Report', 1);
  }

  downloadCompareSheetReport(i: number) {
    this.clickButton = true;
    const totalRows = 6;
    const sheet = this.compareDataStats[i];
    const keyMapper = {
      identicalAS: 'Identical Anatomical Structures',
      newAS: 'New Anatomical Structres',
      identicalCT: 'Identical Cell Types',
      newCT: 'New Cell Types',
      identicalB: 'Identical Biomarkers',
      newB: 'New Biomarkers'
    };
    const download = [];
    const keys = Object.keys(this.compareDataStats[i]);

    for (const key of keys)  {
      if (typeof sheet[key] === 'object') {
        for (const [idx, value] of sheet[key].entries()) {
          const t = {};
          t[keyMapper[key]] = value;

          if (!!download[idx]) {
            download[idx] = {...download[idx], ...t};
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
    return {
      sheet: sheetWS,
      sheetName: sheet.title,
      name:  `ASCT+B-Reporter_Derived_${sn}_${dt}_Report.xlsx`
    };
  }

  deleteCompareSheetReport(i) {
    this.clickButton = true;
    this.compareDataStats.splice(i, 1);
    this.deleteSheet.emit(i);
  }

  closeDrawer() {
    this.googleAnalyticsService.eventEmitter('report_close', 'click', 'report',  'close' , 1);
    this.closeComponent.emit(false);
  }

  openDialogtoCompare() {
    this.openCompareDialog.emit(true);
    this.googleAnalyticsService.eventEmitter('report_compare_button', 'click', 'report', 'Compare Sheet' , 1);
  }

  mail() {

    const subject = `Problem with ${this.currentSheet.name}.xlsx`;
    const mailText = `mailto:infoccf@indiana.edu?subject=${subject}`;
    window.location.href = mailText;
    this.googleAnalyticsService.eventEmitter('report_problem', 'click', 'report',  'Report Problem' , 1);
  }

  tabClick(event){
    this.googleAnalyticsService.eventEmitter('report_tabs', 'click', 'report', event.tab.textLabel , 1);
  }

  panelClick(panel){
    this.googleAnalyticsService.eventEmitter('report_main_sheet_panels',  'click', 'report', panel ,  1);
  }
}
