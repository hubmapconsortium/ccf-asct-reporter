import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { Error } from '../../models/response.model';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { GaAction, GaCategory } from '../../models/ga.model';
import { SheetInfo } from '../../models/sheet.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  loading = true;
  noId = false;
  error: Error = { hasError: false };
  info: SheetInfo;

  // @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Observable<SheetInfo>,
    private changeDetectorRef: ChangeDetectorRef,
    public sheetRef: MatBottomSheetRef,
    public ga: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.data.subscribe((info: SheetInfo) => {
      this.info = info;
      this.loading = false;

      if (info.hasError) {
        this.error = {
          hasError: info.hasError,
          msg: info.msg,
          status: info.status,
        };
      } else {
        this.error = { hasError: false };
        this.info = info;
      }

      this.changeDetectorRef.detectChanges();
    });
  }

  close() {
    this.ga.event(GaAction.CLICK, GaCategory.GRAPH, 'Close Bottom Sheet Information', +false);
    this.sheetRef.dismiss();
  }
}
