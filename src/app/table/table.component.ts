import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SheetService } from '../sheet.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges {

  @Input() public refreshData = false;
  @Output() returnRefresh = new EventEmitter();

  dataSource;
  dataColumns = [
    'structure',
    'uberon',
    'substructure',
    'sub_uberon',
    'sub_2x',
    'sub_2x_uberon',
    'sub_3x',
    'sub_3x_uberon',
    'sub_4x',
    'sub_4x_uberon',
    'cell_types',
    'cl_id'
  ];
  sheetData;

  constructor(public sheet: SheetService) {
    this.getData();
  }

  ngOnInit(): void {
    
  }
  
  ngOnChanges() {
    if (this.refreshData) {
      this.getData();
    }
  }

  getData() {
    this.sheet.getSheetData().then(data => {
      this.sheetData = data;
      this.sheetData.shift(); // removing headers
      this.dataSource = this.sheet.makeTableData(this.sheetData);
      this.returnRefresh.emit({
        comp: 'Table',
        val: true
      });
    }).catch(err => {
      if (err) {
        console.log(err);
        this.returnRefresh.emit({
          comp: 'Table',
          val: false
        });
      }
    });
  }

}
