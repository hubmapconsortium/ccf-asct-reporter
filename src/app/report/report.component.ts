import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { ReportService } from '../report.service';
import { SheetService } from '../sheet.service';
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnChanges {
  sheetData;
  anatomicalStructures = []
  cellTypes = []
  bioMarkers = []
  warningCount = 0;
  @Output() close = new EventEmitter();
  @Input() refreshData;

  sheetName = 'Spleen_R2'

  constructor(public report: ReportService, public sheet: SheetService) {
  }

  ngOnChanges() {

  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.sheet.getSheetData().then(data => {
      this.sheetData = data;
      this.sheet.makeReportData(this.sheetData);
      this.anatomicalStructures = this.sheet.anatomicalStructures
      this.cellTypes = this.sheet.cellTypes
      this.bioMarkers = this.sheet.bioMarkers
    })
  }

  downloadData() {
    let download = []
    let total_rows = 6
    for (var i = 0; i < Math.max(this.anatomicalStructures.length, this.cellTypes.length, this.bioMarkers.length); i++) {
      let row = {}
      if (i < this.anatomicalStructures.length) {
        row['Unique Anatomical Structres'] = this.anatomicalStructures[i].structure
        if (!(this.anatomicalStructures[i].uberon.includes('UBERON'))) {
          row['AS with no Uberon Link'] = this.anatomicalStructures[i].structure
        }

      }
      if (i < this.cellTypes.length) {
        row['Unique Cell Types'] = this.cellTypes[i].structure
        if (!(this.cellTypes[i].link.includes('CL'))) {
          row['CL with no Link'] = this.cellTypes[i].structure
        }
      }
      if (i < this.bioMarkers.length) {
        row['Unique Biomarkers'] = this.bioMarkers[i].structure
        row['Biomarkers with no links'] = this.bioMarkers[i].structure
      }
      download.push(row)
    }

    let sheetWS = XLSX.utils.json_to_sheet(download)
    sheetWS['!cols'] = []
    for(var i = 0 ; i < total_rows; i++) {
      sheetWS['!cols'].push({wch: 30})
    }
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, sheetWS, this.sheet.sheet.display)
    XLSX.writeFile(wb, `${this.sheet.sheet.name}_Report.xlsx`)
  }

  getASWithNoLink() {
    let noLinks = []
    this.anatomicalStructures.forEach(ele => {
      if (!(ele.uberon.includes('UBERON'))) {
        noLinks.push(ele)
      }
    });
    return noLinks;
  }

  getCTWithNoLink() {
    let noLinks = [];
    this.cellTypes.forEach(ele => {
      if (!(ele.link.includes('CL'))) {
        noLinks.push(ele)
      }
    });
    return noLinks;
  }
  getBMWithNoLink() {
    let noLinks = [];

    return noLinks;
  }

  closeDrawer() {
    this.close.emit(false);
  }

  mail() {
    let subject = `Problem with ${this.sheet.sheet.name}.xlsx`
    let mailText = `mailto:infoccf@indiana.edu?subject=${subject}`
    window.location.href = mailText
  }

}
