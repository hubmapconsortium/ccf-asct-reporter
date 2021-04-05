import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { Error } from '../../models/response.model';

@Component({
  selector: 'app-doi',
  templateUrl: './doi.component.html',
  styleUrls: ['./doi.component.scss'],
})
export class DoiComponent implements OnInit {
  loading = true;
  noId = false;
  error: Error = { hasError: false };
  info: any;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public sheetRef: MatBottomSheetRef
  ) {}

  ngOnInit(): void {
    this.loading = false;
    this.data = this.data.map((item) => {
      if (item.doi.toUpperCase().search('DOI') === 0) {
        item.doi = item.doi.substring(5);
      }

      return item;
    });
    console.log(this.data);
  }

  close() {
    this.sheetRef.dismiss();
  }
}
