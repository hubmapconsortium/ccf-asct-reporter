import { Component, OnInit, Output, EventEmitter, Input, OnChanges} from '@angular/core';
import { ReportService } from '../report.service';
import { SheetService } from '../sheet.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit, OnChanges {
  logs; any;
  sheetData;
  anatomicalStructures= []
  cellTypes =[]
  bioMarkers = []
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
      this.sheetData = data.data;
      this.sheet.makeReportData(this.sheetData);
      this.anatomicalStructures = this.sheet.anatomicalStructures
      this.cellTypes = this.sheet.cellTypes
      this.bioMarkers = this.sheet.bioMarkers
    })
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
