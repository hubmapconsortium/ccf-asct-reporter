import { Component, OnInit, Inject, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { HttpClient } from '@angular/common/http';
import { Error } from '../../models/response.model';
import { faThemeisle } from '@fortawesome/free-brands-svg-icons';
import { getInformation } from '../../static/url';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { GaAction, GaCategory } from '../../models/ga.model';

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
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    public sheetRef: MatBottomSheetRef,
    public ga: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    if (this.data.ontologyId) {
      this.getInfo(this.data.ontologyId);
    } else {
      this.loading = false;
      this.error = { hasError: true };
    }
  }

  getInfo(id: string) {
    this.loading = true;
    this.error = { hasError: false };
    this.http.get<any>(getInformation(id)).subscribe(
      (res) => {
        this.loading = false;
        const r = res._embedded.terms[0];
        this.info = {
          iri: r.iri,
          label: r.label,
          desc: r.description ? r.description[0] : 'null',
        };
        this.changeDetectorRef.detectChanges();
      },
      (err) => {
        this.loading = false;
        this.error = {
          hasError: true,
          msg: err.message,
          status: err.status,
        };
        this.changeDetectorRef.detectChanges();
      }
    );
  }

  close() {
    this.ga.eventEmitter("graph_bottom_sheet_close", GaCategory.GRAPH, "Close Bottom Sheet Information", GaAction.CLICK, false);
    this.sheetRef.dismiss();
  }
}
