import { Component, OnInit, Inject, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { HttpClient } from '@angular/common/http';
import { Error } from '../../models/response.model';
import { faThemeisle } from '@fortawesome/free-brands-svg-icons';
import { getInformation } from '../../static/url';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  loading: boolean = true;
  noId: boolean = false;
  error: Error = {hasError: false};
  info: any;
  
  // @Output() close: EventEmitter<any> = new EventEmitter<any>();


  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private http: HttpClient, private changeDetectorRef: ChangeDetectorRef, public sheetRef: MatBottomSheetRef) {
  }


  ngOnInit(): void {
    setTimeout(() => {
      this.getInfo(this.data.uberonId);
    }, 2000);
  }

  getInfo(id: string) {
    this.loading = true;
    this.error = { hasError: false };
    this.http.get<any>(getInformation(id))
      .subscribe(
        (res) => {
          console.log(res)
          this.loading = false;
          this.info = res._embedded.terms[0];
          this.changeDetectorRef.detectChanges();
        },
        (err) => {
          this.loading = false;
          this.error = {
            hasError: true,
            msg: err.message,
            status: err.status
          };
          this.changeDetectorRef.detectChanges();
        }
      )
  }

  close() {
    this.sheetRef.dismiss()
  }

}
