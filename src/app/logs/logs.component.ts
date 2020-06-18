import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ReportService } from '../report.service';
import { SheetService } from '../sheet.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  logs; any;
  anatomicalStructures= []
  cellTypes =[]
  biomarkers = []
  @Output() close = new EventEmitter();

  sheetName = 'Spleen_R2'

  constructor(public report: ReportService, public sheet: SheetService) {
    this.anatomicalStructures = sheet.anatomicalStructures
    this.cellTypes = sheet.cellTypes
  }

  ngOnInit(): void {
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

}
