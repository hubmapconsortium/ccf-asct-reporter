import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { ReportService } from '../report/report.service';
import { SheetService } from '../services/sheet.service';
import * as XLSX from 'xlsx';

export class AS {
  structure: string;
  uberon: string;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnChanges {
  sheetData;
  anatomicalStructures = [];
  cellTypes = [];
  bioMarkers = [];
  warningCount = 0;
  @Output() closeComponent = new EventEmitter();
  @Input() refreshData;

  sheetName = 'Spleen_R2';

  constructor(public report: ReportService, public sheet: SheetService) {
  }

  ngOnChanges() {

  }

  ngOnInit(): void {
    this.getData();
  }

  async getData() {
    this.sheetData = await this.sheet.getSheetData();
    try {
      this.anatomicalStructures = await this.sheet.makeAS(this.sheetData.data);
      this.cellTypes = await this.sheet.makeCellTypes(this.sheetData.data);
      this.bioMarkers = await this.sheet.makeBioMarkers(this.sheetData.data);
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
        if (!(this.anatomicalStructures[i].uberon.includes('UBERON'))) {
          row['AS with no Uberon Link'] = this.anatomicalStructures[i].structure;
        }

      }
      if (i < this.cellTypes.length) {
        row['Unique Cell Types'] = this.cellTypes[i].structure;
        if (!(this.cellTypes[i].link.includes('CL'))) {
          row['CL with no Link'] = this.cellTypes[i].structure;
        }
      }
      if (i < this.bioMarkers.length) {
        row['Unique Biomarkers'] = this.bioMarkers[i].structure;
        row['Biomarkers with no links'] = this.bioMarkers[i].structure;
      }
      download.push(row);
    }

    const sheetWS = XLSX.utils.json_to_sheet(download);
    sheetWS['!cols'] = [];
    for (let i = 0; i < totalRows; i++) {
      sheetWS['!cols'].push({ wch: 30 });
    }
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheetWS, this.sheet.sheet.display);
    XLSX.writeFile(wb, `${this.sheet.sheet.name}_Report.xlsx`);
  }

  getASWithNoLink() {
    const noLinks = [];
    this.anatomicalStructures.forEach(ele => {
      if (!(ele.uberon.includes('UBERON'))) {
        noLinks.push(ele);
      }
    });
    return noLinks;
  }

  getCTWithNoLink() {
    const noLinks = [];
    this.cellTypes.forEach(ele => {
      if (!(ele.link.includes('CL'))) {
        noLinks.push(ele);
      }
    });
    return noLinks;
  }
  getBMWithNoLink() {
    const noLinks = [];

    return noLinks;
  }

  closeDrawer() {
    this.closeComponent.emit(false);
  }

  mail() {
    const subject = `Problem with ${this.sheet.sheet.name}.xlsx`;
    const mailText = `mailto:infoccf@indiana.edu?subject=${subject}`;
    window.location.href = mailText;
  }

}
