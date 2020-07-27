import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css'],
})
export class CompareComponent implements OnInit {
  link: string;
  fromGroupOptions: FormGroup;

  constructor(private dialogRef: MatDialogRef<CompareComponent>, public fb: FormBuilder) {
    this.fromGroupOptions = fb.group({
      hideRequired: false,
      floatLabel: new FormControl('always')
    });
  }
  ngOnInit(): void {}
  checkLinkFormat(url: string) {
    const matches = /\/([\w-_]{15,})\/(.*?gid=(\d+))?/.exec(url);

    if (matches) {
      return {
        sheetID: matches[1],
        gid: matches[3],
      };
    }
  }

  close() {
    this.dialogRef.close();
  }
}
