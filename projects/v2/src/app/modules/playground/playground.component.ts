import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SheetState } from '../../store/sheet.state';
import { Observable } from 'rxjs';

import * as jexcel from "jexcel";
import { UpdatePlaygroundData } from '../../actions/sheet.actions';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit, AfterViewInit {
  @ViewChild("spreadsheet") spreadsheet: ElementRef;
  
  @Select(SheetState.getParsedData) data$: Observable<string[][]>;

  spreadSheetData: Array<string[]>;
  table: any;
  prevTab = 0;

  constructor(public store: Store) { 
    
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.data$.subscribe(data => {
      if (data.length) {
        this.spreadSheetData = data;
        if (!this.table) {
          this.initTable(data, this.store);
        } else {
          this.table.destroy()
          this.initTable(data, this.store);
        }
      }
      
    })
  }

  
  initTable(data, store) {
    let that = this;
    this.table = jexcel(this.spreadsheet.nativeElement, {
      data: data,
      minDimensions: [50, 50],
      onchange: function() {
        that.spreadSheetData = data;
      }
    });
  }


  addRow() {

  }

  tabChange(tab: MatTabChangeEvent) {
     if (this.prevTab === 1 && tab.index === 0) {
      this.store.dispatch(new UpdatePlaygroundData(this.spreadSheetData));
     }
      this.prevTab = tab.index
  }

}
