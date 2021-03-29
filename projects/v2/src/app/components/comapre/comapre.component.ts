import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CompareData } from '../../models/sheet.model';
import { Observable } from 'rxjs';
import {GoogleAnalyticsService} from '../../services/google-analytics.service';
import { GaAction, GaCategory } from "../../models/ga.model";

@Component({
  selector: 'app-comapre',
  templateUrl: './comapre.component.html',
  styleUrls: ['./comapre.component.scss']
})
export class ComapreComponent implements OnInit {

  @Output() closeCompare: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() compareData: EventEmitter<any> = new EventEmitter<any>();

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
              source.description
            )
          );
        }
      } else {
        this.formSheets.push(this.createCompareForm());
      }
    });

  }

  compare() {
    const data: CompareData[] = [];
    for (const [idx, sheet] of this.formGroup.value.sheets.entries()) {
      if (sheet.title === '') { 
        sheet.title = 'Sheet ' + (idx + 1); 
      }

      data.push(
        {
          ...sheet,
          sheetId: this.checkLinkFormat(sheet.link).sheetID,
          gid: this.checkLinkFormat(sheet.link).gid
        }
      );

      this.ga.eventEmitter("compare_sheet", GaCategory.COMPARE, `${sheet.title},${sheet.description},${sheet.link},${sheet.color}`, GaAction.INPUT, idx);
    }

    this.compareData.emit(data);
  }

  checkLinkFormat(url: string) {
    const matches = /\/([\w-_]{15,})\/(.*?gid=(\d+))?/.exec(url);

    if (matches) {
      return {
        sheetID: matches[1],
        gid: matches[3],
      };
    }
  }

  createCompareForm(link= '', color?: string, title= '', description= ''): FormGroup {
    if (!color) { color = this.getRandomColor(); }

    return this.fb.group({
      title: [title],
      description: [description],
      link: [link, Validators.compose([Validators.required, Validators.pattern(/\/([\w-_]{15,})\/(.*?gid=(\d+))?/)])],
      color: [color]
    });
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
    this.ga.eventEmitter("compare_add_row", GaCategory.COMPARE, null, GaAction.CLICK, null);
  }

  removeCompareSheetRow(i: number) {
    this.formSheets.removeAt(i);
    this.ga.eventEmitter("compare_delete_row", GaCategory.COMPARE, null, GaAction.CLICK, i);
  }

}
