import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SheetService } from '../services/sheet.service';
import { BimodalService } from '../services/bimodal.service';
import {FormControl, Form} from '@angular/forms';

import {MatSelect} from '@angular/material/select';

import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

interface Bank {
  id: string;
  name: string;
 }
 
 interface Structure {
   id: string;
   name: string;
   groupName: string;
   x: number;
   y: number;
 }

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<SearchComponent>, 
    public sheet: SheetService,
    private dialog: MatDialog, 
    public bms: BimodalService
    ) { }
  
  /** control for the selected bank */
  public bankCtrl: FormControl = new FormControl();

   /** control for the MatSelect filter keyword */
  public bankFilterCtrl: FormControl = new FormControl();

    /** control for the selected bank for multi-selection */
  public bankMultiCtrl: FormControl = new FormControl();

   /** control for the MatSelect filter keyword multi-selection */
  public bankMultiFilterCtrl: FormControl = new FormControl();

  private structures: Structure[] = [];

  /** list of banks filtered by search keyword */
  public filteredBanks: ReplaySubject<Structure[]> = new ReplaySubject<Structure[]>(1);

  /** list of banks filtered by search keyword for multi-selection */
  public filteredBanksMulti: ReplaySubject<Structure[]> = new ReplaySubject<Structure[]>(1); 

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();


  async ngOnInit() {
    let data = await this.bms.getASCTData()
    for(let node of data.nodes) {
      this.structures.push({
        id: node.id,
        name: node.name,
        groupName: node.groupName,
        x: node.x,
        y: node.y
      })
    }

    // set initial selection
    this.bankCtrl.setValue(this.structures[10]);

    // load the initial bank list
    this.filteredBanks.next(this.structures.slice());
    this.filteredBanksMulti.next(this.structures.slice());

    // listen for search field value changes
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
    this.bankMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });

    
    console.log(this.structures)

  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  private setInitialValue() {
    this.filteredBanks
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {          
        // setting the compareWith property to a comparison function 
        // triggers initializing the selection according to the initial value of 
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially 
        // and after the mat-option elements are available
      
      });
  }

  private filterBanks() {
    if (!this.structures) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.structures.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks.next(
      this.structures.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterBanksMulti() {
    if (!this.structures) {
      return;
    }
    // get the search keyword
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      this.filteredBanksMulti.next(this.structures.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanksMulti.next(
      this.structures.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  doSearch() {
    console.log(this.bankMultiCtrl)
  }

  close() {
    this.dialogRef.close({data: []});
  }
}
