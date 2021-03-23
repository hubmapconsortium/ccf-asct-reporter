import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { HttpClient } from '@angular/common/http';
import { Error } from '../../models/response.model';
import { faThemeisle } from '@fortawesome/free-brands-svg-icons';
import { getInformation } from '../../static/url';
import { Select } from '@ngxs/store';
import { SheetState } from '../../store/sheet.state';
import { Observable } from 'rxjs';
import { SheetInfo } from '../../models/sheet.model';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  loading = true;
  noId = false;
  error: Error = { hasError: false };
  info: any;

  // @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Select(SheetState.getBottomSheetInfo)
  bottomSheetInfo$: Observable<SheetInfo>;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    public sheetRef: MatBottomSheetRef
  ) {
    this.bottomSheetInfo$.subscribe((info) => {
      this.loading = false;
      if (info.hasError) {
        console.log(info);
        this.error = {
          hasError: info.hasError,
          msg: info.msg,
          status: info.status,
        };
      } else {
        this.error = { hasError: false };
        this.info = info;
      }
    });
  }

  ngOnInit(): void {
    this.loading = true;
  }

  // getInfo(id: string) {
  //   this.loading = true;
  //   this.error = { hasError: false };
  //   this.http.get<any>(getInformation(id)).subscribe(
  //     (res) => {
  //       this.loading = false;
  //       const r = res._embedded.terms[0];
  //       this.info = {
  //         iri: r.iri,
  //         label: r.label,
  //         desc: r.description ? r.description[0] : 'null',
  //       };
  //       this.changeDetectorRef.detectChanges();
  //     },
  //     (err) => {
  //       this.loading = false;
  //       this.error = {
  //         hasError: true,
  //         msg: err.message,
  //         status: err.status,
  //       };
  //       this.changeDetectorRef.detectChanges();
  //     }
  //   );
  // }

  close() {
    this.sheetRef.dismiss();
  }
}
