import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FetchSheetData } from '../../actions/sheet.actions';
import { Sheet } from '../../models/sheet.model';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { SheetState } from '../../store/sheet.state';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  fileName = '';

  @Select(SheetState.getParsedData) data$: Observable<string[][]>;
  @Select(SheetState.getSheet) sheet$: Observable<Sheet>;


  constructor(public readonly store: Store, public readonly ga: GoogleAnalyticsService) { }

  ngOnInit(): void { }

  onFileSelected(event) {

    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("csvFile", file);
      //console.log(formData['files'].csvFile);
      //const upload$ = this.http.post("/api/thumbnail-upload", formData);
      //upload$.subscribe();
      const sheet = {
        gid: null,
        sheetId: null,
        csvUrl: null,
        formData: formData
      } as Sheet;

      this.store.dispatch(new FetchSheetData(sheet));
      //this.ga.eventEmitter('playground_upload', GaCategory.PLAYGROUND, 'Upload Playground Sheet', GaAction.CLICK, sheet.sheetId);
    }
  }

}
