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
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { GaAction, GaCategory } from '../../models/ga.model';
import { BottomSheetInfo } from '../../models/bottom-sheet-info.model';

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

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private changeDetectorRef: ChangeDetectorRef,
    public sheetRef: MatBottomSheetRef,
    public ga: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.data.subscribe((info: BottomSheetInfo) => {
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
    this.ga.eventEmitter('graph_bottom_sheet_close', GaCategory.GRAPH, 'Close Bottom Sheet Information', GaAction.CLICK, false);
    this.sheetRef.dismiss();
  }
}
