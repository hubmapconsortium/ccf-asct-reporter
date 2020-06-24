import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingComponent } from './loading/loading.component';
import { SconfigService } from './sconfig.service';
import { SheetService } from './sheet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('logs_drawer') logs_drawer;
  @ViewChild('log_conponent') log_conponent;

  displayGraph = 'Tree';
  refreshTree = false;
  refreshIndent = false;
  refreshTable = false;
  refreshLogs = false;
  sheetName = 'Spleen_R2_EMQverify.xlsx';
  shouldRefreshData = false;

  constructor(private dialog: MatDialog, public snackBar: MatSnackBar, public sc: SconfigService, public sheet: SheetService) { 
    this.getSelectedSheet(this.sheetName)
  }

  ngOnInit() {
    this.openLoading();
  }

  toggleDrawer(val) {
    this.refreshLogs = val;
    this.logs_drawer.opened = val;
  }

  showGraph(val) {
    this.openLoading();
    this.displayGraph = val;
    this.getSelectedSheet(this.sheetName)
  }

  refreshData(val) {
    if (val == 'Tree') {
      this.openLoading();
      this.refreshTree = true;
      this.shouldRefreshData = true;
    } else if (val == 'Indented List') {
      this.openLoading();
      this.refreshIndent = true;
    } else if (val == 'Table') {
      this.openLoading()
      this.refreshTable = true;
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
      this.shouldRefreshData = false;

    } else if (val.comp == 'Indented List') {
      this.dialog.closeAll();
      if (val.val) {
        this.openSnackBar('Indented List data successfully fetched.', 'Close', 'green');
      } else {
        this.openSnackBar('Error while fetching data.', 'Close', 'red');
      }
      this.refreshIndent = false;
      this.shouldRefreshData = false;

    } else if (val.comp == 'Table') {
      this.dialog.closeAll();
      if (val.val) {
        this.openSnackBar('Table data successfully fetched.', 'Close', 'green');
      } else {
        this.openSnackBar('Error while fetching data.', 'Close', 'red');
      }
      this.refreshTable = false;
      this.shouldRefreshData = false;
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

  getSelectedSheet(event) {
    this.sheetName = event;
    new Promise((res, rej) => {
      this.sheet.sheet = this.sc.SHEET_CONFIG[this.sc.SHEET_CONFIG.findIndex(i => i.name == this.sheetName)]
      res(true)
    })
    .then(data => {
      if (data) {
        this.openLoading();
        this.shouldRefreshData = true;
        this.log_conponent.getData();
      }
    })
    
  }
}
