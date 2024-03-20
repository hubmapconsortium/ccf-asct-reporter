import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Observable } from 'rxjs';
import { GaAction, GaCategory, GaCompareInfo } from '../../models/ga.model';
import { CompareData } from '../../models/sheet.model';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent implements OnInit {
  @Output() closeCompare = new EventEmitter<boolean>();
  @Output() compareData = new EventEmitter<CompareData[]>();

  @Input() compareSheets!: Observable<CompareData[]>;

  formGroup!: UntypedFormGroup;
  formSheets!: UntypedFormArray;
  formValid = true;

  constructor(
    public fb: UntypedFormBuilder,
    public ga: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      sheets: this.fb.array([]),
    });
    this.formSheets = this.formGroup.get('sheets') as UntypedFormArray;

    this.compareSheets.subscribe((sheets) => {
      if (sheets.length) {
        for (const source of sheets) {
          this.formSheets.push(
            this.createCompareForm(
              source.link,
              source.color,
              source.title,
              source.description,
              source.formData,
              source.fileName
            )
          );
        }
      } else {
        this.formSheets.push(this.createCompareForm());
      }
    });

    this.formGroup.valueChanges.subscribe(() => {
      const formArray = this.formGroup.controls['sheets'] as UntypedFormArray;
      formArray.controls.forEach((control) => {
        const sheet = control as UntypedFormGroup;
        const file = sheet.controls['formData'];
        const link = sheet.controls['link'];
        if (file.value != null) {
          link.clearValidators();
          link.updateValueAndValidity({ emitEvent: false });
        }
      });
    });
  }

  upload(fileFormDataEvent: FormData, control: AbstractControl) {
    const sheet = control as UntypedFormGroup;
    sheet.controls['formData'].setValue(fileFormDataEvent);
  }

  markFormGroupTouched(formGroup: UntypedFormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      const form = control as UntypedFormGroup;
      form.markAsTouched();

      if (form.controls) {
        this.markFormGroupTouched(form);
      }
    });
  }

  compare() {
    this.markFormGroupTouched(this.formGroup);
    this.formValid = this.formGroup.status === 'VALID';
    if (this.formGroup.status !== 'VALID') {
      return;
    }
    const data: CompareData[] = [];
    for (const [idx, sheet] of this.formGroup.value.sheets.entries()) {
      if (sheet.title === '') {
        sheet.title = `Sheet ${idx + 1}`;
      }

      data.push({
        ...sheet,
        sheetId: this.checkLinkFormat(sheet.link)?.sheetID,
        gid: this.checkLinkFormat(sheet.link)?.gid,
        csvUrl: this.checkLinkFormat(sheet.link)?.csvUrl,
      });

      const sheetInfo: GaCompareInfo = {
        title: sheet.title,
        desc: sheet.description,
        link: sheet.link,
        color: sheet.color,
      };
      this.ga.event(
        GaAction.CLICK,
        GaCategory.COMPARE,
        `Add new sheet to compare: ${JSON.stringify(sheetInfo)}`
      );
    }

    this.compareData.emit(data);
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

  createCompareForm(
    link = '',
    color?: string,
    title = '',
    description = '',
    formData?: FormData,
    fileName?: string
  ): UntypedFormGroup {
    if (!color) {
      color = this.getRandomColor();
    }

    return this.fb.group(
      {
        title: [title],
        description: [description],
        link: [
          link,
          Validators.compose([
            Validators.required,
            Validators.pattern(/\/([\w-_]{15,})\/(.*?gid=(\d+))?|\w*csv$/),
          ]),
        ],
        color: [color],
        formData: [formData],
        fileName: [fileName],
      },
      { validators: [this.atLeastOnePhoneRequired] }
    );
  }

  atLeastOnePhoneRequired(
    group: UntypedFormGroup
  ): { [s: string]: boolean } | null {
    if (group) {
      if (group.controls['link'].value || group.controls['fileName'].value) {
        return null;
      }
    }
    return { error: true };
  }

  get CSControls() {
    return this.formGroup.get('sheets') as UntypedFormArray;
  }

  getRandomColor() {
    const letters = '3456789BC'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }

  doesFormHaveError() {
    (this.formGroup.controls['sheets'].value as UntypedFormGroup[]).forEach(
      (sheet) => {
        // mark as touched for all controls
        sheet.controls['link'].markAsTouched();
      }
    );
    return this.formGroup.status !== 'VALID';
  }

  addCompareSheetRow() {
    const sheet = this.createCompareForm();
    this.formSheets.push(sheet);
    this.ga.event(
      GaAction.CLICK,
      GaCategory.COMPARE,
      'Add new compare row',
      undefined
    );
  }

  removeCompareSheetRow(i: number) {
    this.formSheets.removeAt(i);
    this.ga.event(GaAction.CLICK, GaCategory.COMPARE, 'Delete compare row', i);
  }
}
