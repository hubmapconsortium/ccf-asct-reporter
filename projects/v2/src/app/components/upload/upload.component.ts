import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { uploadForm } from '../../models/sheet.model';
import { Observable } from 'rxjs';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { GaAction, GaCategory, GaCompareInfo } from '../../models/ga.model';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @Output() closeCompare: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() uploadForm: EventEmitter<uploadForm[]> = new EventEmitter<uploadForm[]>();

  @Input() showToggles = false;

  formGroup: FormGroup;
  formSheets: FormArray;
  formValid = true;

  constructor(public fb: FormBuilder, public ga: GoogleAnalyticsService) { }

  ngOnInit(): void {

    this.formGroup = new FormGroup({
      link: new FormControl('', [Validators.required, Validators.compose([Validators.pattern(/\/([\w-_]{15,})\/(.*?gid=(\d+))?|\w*csv$/)])]),
      formData: new FormControl(''),
      fileName: new FormControl(''),
    }, { validators: [this.atLeastOnePhoneRequired] }
    );


    this.formGroup.valueChanges.subscribe(x => {
      console.log(x);
      if (!(x.fileName === null || x.fileName === '')) {
        console.log("Clearing");
        this.formGroup.get('link').clearValidators();
        this.formGroup.get('link').updateValueAndValidity({ emitEvent: false });
      }
      this.formValid = this.formGroup.status === 'VALID';
    });
  }

  atLeastOnePhoneRequired(group: FormGroup): { [s: string]: boolean } {
    if (group) {
      console.log("Here");
      if (group.controls.link.value || group.controls.fileName.value) {
        return null;
      }
    }
    return { 'error': true };
  }

  upload(fileFormDataEvent: FormData) {
    this.formGroup.patchValue({ formData: fileFormDataEvent });
  }


  compare() {
    this.formValid = this.formGroup.status === 'VALID';
    if (this.formGroup.status !== 'VALID') {
      return;
    }
    console.log(this.formGroup.get('link'));
    console.log(this.formGroup.get('formData'));
    console.log(this.formGroup.get('fileName'));

    // const data: CompareData[] = [];
    // for (const [idx, sheet] of this.formGroup.value.sheets.entries()) {
    //   if (sheet.title === '') {
    //     sheet.title = `Sheet ${idx + 1}`;
    //   }

    //   data.push(
    //     {
    //       ...sheet,
    //       sheetId: this.checkLinkFormat(sheet.link).sheetID,
    //       gid: this.checkLinkFormat(sheet.link).gid,
    //       csvUrl: this.checkLinkFormat(sheet.link).csvUrl
    //     }
    //   );

    //   const sheetInfo: GaCompareInfo = {
    //     title: sheet.title,
    //     desc: sheet.description,
    //     link: sheet.link,
    //     color: sheet.color,
    //   };
    //   this.ga.event(GaAction.CLICK, GaCategory.COMPARE, `Add new sheet to compare: ${JSON.stringify(sheetInfo)}`);
    // }

    // this.compareData.emit(data);
  }

  checkLinkFormat(url: string) {
    if (url.startsWith('https://docs.google.com/spreadsheets/d/')) {
      const splitUrl = url.split('/');
      if (splitUrl.length === 7) {
        return {
          sheetID: splitUrl[5],
          gid: splitUrl[6].split('=')[1],
          csvUrl: ''
        };
      }
    } else {
      return {
        sheetID: '0',
        gid: '0',
        csvUrl: url
      };
    }
  }



}
