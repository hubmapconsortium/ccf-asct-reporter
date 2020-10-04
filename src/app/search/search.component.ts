import { Component, OnInit, Output, Input, ViewChild, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SheetService } from '../services/sheet.service';
import { BimodalService } from '../services/bimodal.service';
import {FormControl, Form} from '@angular/forms';

import {MatSelect} from '@angular/material/select';

import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

interface structure {
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

  @Output() search = new EventEmitter<any>();
  /** control for the selected structure */
  public structureCtrl: FormControl = new FormControl();

   /** control for the MatSelect filter keyword */
  public structureFilterCtrl: FormControl = new FormControl();

    /** control for the selected structure for multi-selection */
  public structureMultiCtrl: FormControl = new FormControl();

   /** control for the MatSelect filter keyword multi-selection */
  public structureMultiFilterCtrl: FormControl = new FormControl();

  private structures: Structure[] = [];

  /** list of structures filtered by search keyword */
  public filteredstructures: ReplaySubject<Structure[]> = new ReplaySubject<Structure[]>(1);

  /** list of structures filtered by search keyword for multi-selection */
  public filteredstructuresMulti: ReplaySubject<Structure[]> = new ReplaySubject<Structure[]>(1); 

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
    this.structureCtrl.setValue(this.structures[10]);

    // load the initial structure list
    this.filteredstructures.next(this.structures.slice());
    this.filteredstructuresMulti.next(this.structures.slice());

    // listen for search field value changes
    this.structureFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterstructures();
      });
    this.structureMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterstructuresMulti();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredstructures are loaded initially
   */
  private setInitialValue() {
    this.filteredstructures
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {          
        // setting the compareWith property to a comparison function 
        // triggers initializing the selection according to the initial value of 
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredstructures are loaded initially 
        // and after the mat-option elements are available
      
      });
  }

  private filterstructures() {
    if (!this.structures) {
      return;
    }
    // get the search keyword
    let search = this.structureFilterCtrl.value;
    if (!search) {
      this.filteredstructures.next(this.structures.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the structures
    this.filteredstructures.next(
      this.structures.filter(structure => structure.name.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterstructuresMulti() {
    if (!this.structures) {
      return;
    }
    // get the search keyword
    let search = this.structureMultiFilterCtrl.value;
    if (!search) {
      this.filteredstructuresMulti.next(this.structures.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the structures
    this.filteredstructuresMulti.next(
      this.structures.filter(structure => structure.name.toLowerCase().indexOf(search) > -1)
    );
  }

  doSearch() {
    if (this.structureMultiCtrl.value) {
      this.search.emit(this.structureMultiCtrl.value)
      this.dialogRef.close({ data: this.structureMultiCtrl.value});
    } else {
      this.dialogRef.close({ data: []});
    }
  
    
  }

  close() {
    this.dialogRef.close({data: []});
  }
}
