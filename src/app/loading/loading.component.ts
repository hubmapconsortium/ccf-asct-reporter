import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SheetService } from '../services/sheet.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent implements OnInit {
  loadingText: string;
  loadingList: Array<string>;

  constructor(
    private dialogRef: MatDialogRef<LoadingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sheet: SheetService
  ) {
    console.log(data)
    this.loadingText = data.sheet.display;
    // this.loadingList = data.list;
  }

  ngOnInit(): void {
    this.sheet.loadingStatus.subscribe((organ) => {
      this.loadingText = organ;
    });
  }

  close() {
    this.dialogRef.close();
  }
}
