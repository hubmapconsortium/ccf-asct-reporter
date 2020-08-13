import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormControlName, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SheetService } from '../services/sheet.service';
import { LoadingComponent } from '../loading/loading.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css'],
})
export class CompareComponent implements OnInit {
  link: string;
  columnNumbers: string;
  formGroup: FormGroup;
  formSheets: FormArray;
  loadingDialog: any;

  
  @Output() compareData = new EventEmitter<any>();

  

  constructor(
    private dialogRef: MatDialogRef<CompareComponent>,
    public sheet: SheetService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      sheets: this.fb.array([this.createCompareForm()])
    })

    this.formSheets = this.formGroup.get('sheets') as FormArray;
  }

  createCompareForm(): FormGroup {
    return this.fb.group({
      link: ['', Validators.compose([Validators.required, Validators.pattern(/\/([\w-_]{15,})\/(.*?gid=(\d+))?/)])],
      columnNumbers: ['', Validators.compose([Validators.required, Validators.pattern(/^([0-9\s]+,)*([0-9\s]+){1}$/i)])],
      color: ['#8B008B']
    })
  }


  public async getData(link?: string, columns?: string) {
    this.openLoading();
    let structureNames = [];

    for(const ddSheet of this.formGroup.value.sheets) {
      if (!ddSheet.link) {
        continue
      }

      let sheetID = this.checkLinkFormat(ddSheet.link).sheetID;
      let gid = this.checkLinkFormat(ddSheet.link).gid;
      
      try {
        // const constructedURL = `https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv&gid=${gid}`;
        const constructedURL = `http://asctb-data-miner.herokuapp.com/${sheetID}/${gid}`
        const CN = ddSheet.columnNumbers.split(',');
  
        const markerCol = CN[CN.length - 1];
        const cellCol = CN[CN.length - 2];
  
        
        const csvData = await this.sheet.getDataFromURL(
          constructedURL, 1
        );
  
        csvData.data.forEach((row) => {
          for (let i = 0; i < CN.length - 2; i++) {
            if (!structureNames.some((s) => s.name.toLowerCase() == row[i].toLowerCase())) {
              structureNames.push({ name: row[i] });
            }
          }
          let cells = row[cellCol].split(',').map((c) => c.trim());
          for (let i = 0; i < cells.length; i++) {
            if (!structureNames.some((s) => s.name.toLowerCase() == cells[i].toLowerCase())) {
              structureNames.push({ name: cells[i].trim() });
            }
          }
  
          let markers = row[markerCol].split(',').map((m) => m.trim());
          for (let i = 0; i < markers.length; i++) {
            if (!structureNames.some((s) => s.name.toLowerCase() == markers[i].toLowerCase())) {
              structureNames.push({ name: markers[i] });
            }
          }
        });
  
        this.openSnackBar('Derived Data sheet succesfully fetched.', 'Close', 'green')
        this.dialog.closeAll();
        this.dialogRef.close({ data: structureNames });
      } catch (err) {
        this.loadingDialog.close();
        this.openSnackBar('Error while fetching data.', 'Close', 'red');
      }
    }
    
  }

  addCompareSheetRow() {
    this.formSheets.push(this.createCompareForm());
  }

  removeCompareSheetRow(i) {
    this.formSheets.removeAt(i);
  }

  get CSControls() {
    return this.formGroup.get('sheets') as FormArray;
  }

  checkLinkFormat(url: string) {
    const matches = /\/([\w-_]{15,})\/(.*?gid=(\d+))?/.exec(url);

    if (matches) {
      return {
        sheetID: matches[1],
        gid: matches[3],
      };
    }
  }

  openSnackBar(message, action, style) {
    this.snackBar.open(message, action, {
      duration: style === 'green' || style === 'warn' ? 3000 : undefined,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: [`${style}-snackbar`],
    });
  }

  openLoading() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      sheet: 'Derived Data Sheet'
    }
    this.loadingDialog = this.dialog.open(LoadingComponent, dialogConfig);
  }

  doesFormHaveError() {
    return this.formGroup.status !== 'VALID'
  }

  close() {
    this.dialogRef.close({data: []});
  }
  changeComplete(e) {
    console.log(e)
  }
}
