import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
    public sheet: SheetService,
    private dialog: MatDialog,
  ) {
    this.loadingText = data.sheet.display;
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
