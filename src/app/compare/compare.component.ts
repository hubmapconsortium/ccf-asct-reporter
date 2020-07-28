import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { SheetService } from '../services/sheet.service';

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

  constructor(
    private dialogRef: MatDialogRef<CompareComponent>,
    public sheet: SheetService
  ) {}
  ngOnInit(): void {}

  public async getData(link: string, columns: string) {
    let sheetID = this.checkLinkFormat(link).sheetID;
    let gid = this.checkLinkFormat(link).gid;
    const constructedURL = `https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv&gid=${gid}`;
    const CN = columns.split(',');
    console.log(CN);
    const markerCol = CN[CN.length - 1];
    const cellCol = CN[CN.length - 2];

    let structureNames = [];
    const csvData = await this.sheet.getDataFromURL(
      constructedURL,
      200,
      'Ok',
      1
    );

    csvData.data.forEach((row) => {
      for (let i = 0; i < CN.length - 2; i++) {
        if (
          !structureNames.some((s) => s.name.toLowerCase() == row[i].toLowerCase())
        ) {
          structureNames.push({name: row[i]});
        }
      }
      let cells = row[cellCol].split(',').map((c) => c.trim());
      for (let i = 0; i < cells.length; i++) {
        if (
          !structureNames.some((s) => s.name.toLowerCase() == cells[i].toLowerCase())
        ) {
          structureNames.push({name: cells[i].trim()});
        }
      }

      let markers = row[markerCol].split(',').map((m) => m.trim());
      for (let i = 0; i < markers.length; i++) {
        if (
          !structureNames.some(
            (s) => s.name.toLowerCase() == markers[i].toLowerCase()
          )
        ) {
          structureNames.push({name: markers[i]});
        }
      }
    });

    this.dialogRef.close({data: structureNames});
    
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
    this.dialogRef.close();
  }
}
