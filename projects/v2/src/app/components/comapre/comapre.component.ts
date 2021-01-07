import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-comapre',
  templateUrl: './comapre.component.html',
  styleUrls: ['./comapre.component.scss']
})
export class ComapreComponent implements OnInit {
  
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  

  formGroup: FormGroup;
  formSheets: FormArray;

  constructor(public fb: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      sheets: this.fb.array([this.createCompareForm()])
    })
    this.formSheets = this.formGroup.get('sheets') as FormArray;
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
    let sheet = this.createCompareForm()
    this.formSheets.push(sheet);
  }

  removeCompareSheetRow(i: number) {
    this.formSheets.removeAt(i);
    // this.ga.eventEmitter('compare', 'click', 'Delete Sheet' , i + 1);
  }

}
