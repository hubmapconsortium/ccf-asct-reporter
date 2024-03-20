import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UploadForm } from '../../models/sheet.model';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  @Output() uploadForm = new EventEmitter<UploadForm>();

  formGroup!: FormGroup;
  formValid = true;

  constructor(public fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup(
      {
        link: new FormControl('', [
          Validators.required,
          Validators.compose([
            Validators.pattern(/\/([\w-_]{15,})\/(.*?gid=(\d+))?|\w*csv$/),
          ]) as ValidatorFn,
        ]),
        formData: new FormControl(''),
        fileName: new FormControl(''),
      },
      { validators: [this.atLeastOnePhoneRequired as ValidatorFn] }
    );

    this.formGroup.valueChanges.subscribe((x) => {
      if (!(x.fileName === null || x.fileName === '')) {
        this.formGroup.get('link')?.clearValidators();
        this.formGroup
          .get('link')
          ?.updateValueAndValidity({ emitEvent: false });
      }
      this.formValid = this.formGroup.status === 'VALID';
    });
  }

  atLeastOnePhoneRequired(group: FormGroup): { [s: string]: boolean } | null {
    if (group) {
      if (group.controls['link'].value || group.controls['fileName'].value) {
        return null;
      }
    }
    return { error: true };
  }

  upload(fileFormDataEvent: FormData) {
    this.formGroup.patchValue({ formData: fileFormDataEvent });
  }

  submitData() {
    this.formValid = this.formGroup.status === 'VALID';
    if (this.formGroup.status !== 'VALID') {
      return;
    }
    const sheet = this.formGroup.value;
    const sheetId = this.checkLinkFormat(sheet.link)?.sheetID ?? '';

    const data: UploadForm = {
      link: sheet.link,
      formData: sheet.formData,
      fileName: sheet.fileName,
      sheetId,
      gid: this.checkLinkFormat(sheet.link)?.gid ?? '',
      csvUrl: this.checkLinkFormat(sheet.link)?.csvUrl ?? '',
    };
    // ga call handled in the playground module component

    this.uploadForm.emit(data);
  }

  checkLinkFormat(url: string) {
    if (url.startsWith('https://docs.google.com/spreadsheets/d/')) {
      const splitUrl = url.split('/');
      if (splitUrl.length === 7) {
        return {
          sheetID: splitUrl[5],
          gid: splitUrl[6].split('=')[1],
          csvUrl: '',
        };
      }
    }

    return {
      sheetID: '0',
      gid: '0',
      csvUrl: url,
    };
  }
}
