import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {
  heightValue: number;

  @Output() height = new EventEmitter<any>();

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  constructor(private dialogRef: MatDialogRef<ControlComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.heightValue = data.height;
    }

  ngOnInit(): void {
  }

  getSliderValue() {
    this.height.emit(this.heightValue)
  }

  reset() {
    this.heightValue = document.getElementsByTagName('body')[0].clientHeight;
    this.height.emit(this.heightValue)
  }

  close() {
    this.dialogRef.close();
  }

}
