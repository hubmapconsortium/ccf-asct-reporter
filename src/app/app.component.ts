import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingComponent } from './loading/loading.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('logs_drawer') logs_drawer;

  displayGraph = 'Indent';
  refreshTree = false;
  refreshIndent = false;

  constructor(private dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.openLoading();
  }

  toggleDrawer(val) {
    this.logs_drawer.opened = val;
  }

  showGraph(val) {
    this.openLoading();
    this.displayGraph = val;
  }

  refreshData(val) {
    if (val == 'Tree') {
      this.openLoading();
      this.refreshTree = true;
    } else if (val == 'Indent') {
      this.openLoading();
      this.refreshIndent = true;
    }
  }

  returnRefresh(val) {
    if (val.comp == 'Tree') {
      this.dialog.closeAll();
      if (val.val) {
        this.openSnackBar('Tree data successfully fetched.', 'Close', 'green');
      } else {
        this.openSnackBar('Error while fetching data.', 'Close', 'red');
      }
      this.refreshTree = false;

    } else if (val.comp == 'Indent') {
      this.dialog.closeAll();
      if (val.val) {
        this.openSnackBar('Indent data successfully fetched.', 'Close', 'green');
      } else {
        this.openSnackBar('Error while fetching data.', 'Close', 'red');
      }
      this.refreshIndent = false;
    }
  }

  openLoading() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(LoadingComponent, dialogConfig);
  }

  openSnackBar(message, action, style) {
    this.snackBar.open(message, action, {
      duration: style === 'green' ? 2500 : undefined,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: [`${style}-snackbar`]
    });
  }
}
