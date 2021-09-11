import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CompareData } from '../../models/sheet.model';
import { Observable } from 'rxjs';
import {GoogleAnalyticsService} from '../../services/google-analytics.service';
import { GaAction, GaCategory, GaCompareInfo } from '../../models/ga.model';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  @Output() closeCompare: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() compareData: EventEmitter<CompareData[]> = new EventEmitter<CompareData[]>();

  @Input() compareSheets: Observable<CompareData[]>;

  formGroup: FormGroup;
  formSheets: FormArray;

  constructor(public fb: FormBuilder, public ga: GoogleAnalyticsService) { }

  ngOnInit(): void {

    this.formGroup = this.fb.group({
      sheets: this.fb.array([]),
    });
    this.formSheets = this.formGroup.get('sheets') as FormArray;

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

    this.formGroup.valueChanges
    .subscribe(sheets => {
      const formArray =this.formGroup.controls.sheets as FormArray    
      formArray.controls.forEach((sheet: FormGroup) => {
        var file = sheet.controls["formData"];
        var link = sheet.controls["link"];   
        if (file.value != null) {
          link.clearValidators();
          link.updateValueAndValidity({emitEvent: false});
        }
      });
    });

  }

  upload(fileFormDataEvent: FormData, sheet: FormGroup) {
    sheet.controls['formData'].setValue(fileFormDataEvent);
  }

  compare() {
    const data: CompareData[] = [];
    for (const [idx, sheet] of this.formGroup.value.sheets.entries()) {
      if (sheet.title === '') {
        sheet.title = `Sheet ${idx + 1}`;
      }
      console.log(idx,sheet)

      data.push(
        {
          ...sheet,
          sheetId: this.checkLinkFormat(sheet.link).sheetID,
          gid: this.checkLinkFormat(sheet.link).gid,
          csvUrl: this.checkLinkFormat(sheet.link).csvUrl
        }
      );

      const sheetInfo: GaCompareInfo = {
        title: sheet.title,
        desc: sheet.description,
        link: sheet.link,
        color: sheet.color,
      };
      this.ga.eventEmitter('compare_sheet', GaCategory.COMPARE, 'Add new sheet to compare', GaAction.CLICK, JSON.stringify(sheetInfo));
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

  createCompareForm(link= '', color?: string, title= '', description= '', formData?: FormData, fileName?: string): FormGroup {
    if (!color) {
      color = this.getRandomColor();
    }

    return this.fb.group({
      title: [title],
      description: [description],
      link: [link, Validators.compose([Validators.required, Validators.pattern(/\/([\w-_]{15,})\/(.*?gid=(\d+))?|\w*csv$/)])],
      color: [color],
      formData: [formData],
      fileName: [fileName]
    }, { validators: [this.atLeastOnePhoneRequired]});
  }
  atLeastOnePhoneRequired(group : FormGroup) : {[s:string ]: boolean} {
    if (group) {
      if(group.controls['link'].value || group.controls['fileName'].value) {
        return null;
      }
    }
    return {'error': true};
  }
  get CSControls() {
    return this.formGroup.get('sheets') as FormArray;
  }

  getRandomColor() {
    const letters = '3456789BC'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }

  doesFormHaveError() {
    return this.formGroup.status !== 'VALID';
  }

  addCompareSheetRow() {
    const sheet = this.createCompareForm();
    this.formSheets.push(sheet);
    this.ga.eventEmitter('compare_add_row', GaCategory.COMPARE, 'Add new compare row', GaAction.CLICK, null);
  }

  removeCompareSheetRow(i: number) {
    this.formSheets.removeAt(i);
    this.ga.eventEmitter('compare_delete_row', GaCategory.COMPARE, 'Delete compare row', GaAction.CLICK, i);
  }

}
