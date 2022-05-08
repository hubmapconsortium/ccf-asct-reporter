import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { Error } from '../../models/response.model';
import { DOI } from '../../models/sheet.model';

@Component({
  selector: 'app-doi',
  templateUrl: './doi.component.html',
  styleUrls: ['./doi.component.scss'],
})
export class DoiComponent implements OnInit {
  loading = true;
  noId = false;
  error: Error = { hasError: false };
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: DOI[],
    public sheetRef: MatBottomSheetRef
  ) {}

  ngOnInit(): void {
    this.loading = false;

    /**
     * Trimming the intial part of the doi property as it as "DOI: " in its respective property.
     */
    this.data = this.data.map((item) => {
      console.log(item);
      if (item.doi.toUpperCase().search('DOI') === 0) {
        item.doi = item.doi.substring(5);
      }
      return item;
    });
  }

  close() {
    this.sheetRef.dismiss();
  }
}
