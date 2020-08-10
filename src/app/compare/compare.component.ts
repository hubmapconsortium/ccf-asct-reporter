import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
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
  linkValidator = new FormControl('', [
    Validators.required,
    Validators.pattern(/\/([\w-_]{15,})\/(.*?gid=(\d+))?/),
  ]);
  treeColumnsValidator = new FormControl('', [
    Validators.required,
    Validators.pattern(/^([0-9\s]+,)*([0-9\s]+){1}$/i),
  ]);

  @Output() compareData = new EventEmitter<any>();

  loadingDialog: any;

  constructor(
    private dialogRef: MatDialogRef<CompareComponent>,
    public sheet: SheetService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {}

  public async getData(link: string, columns: string) {
    this.openLoading();
    let sheetID = this.checkLinkFormat(link).sheetID;
    let gid = this.checkLinkFormat(link).gid;
    try {
      console.log(sheetID, gid)
      // const constructedURL = `https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv&gid=${gid}`;
      const constructedURL = `http://asctb-data-miner.herokuapp.com/${sheetID}/${gid}`
      console.log(constructedURL)
      const CN = columns.split(',');

      const markerCol = CN[CN.length - 1];
      const cellCol = CN[CN.length - 2];

      let structureNames = [];
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
          if (!structureNames.some((s) => s.name.toLowerCase() == cells[i].toLowerCase())
          ) {
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
    if (
      this.linkValidator.hasError('required') ||
      this.linkValidator.hasError('pattern') ||
      this.treeColumnsValidator.hasError('required') ||
      this.treeColumnsValidator.hasError('pattern')
    )
      return true;
    return false;
  }

  close() {
    this.dialogRef.close({data: []});
  }
}
