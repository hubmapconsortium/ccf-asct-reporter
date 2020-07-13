import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingComponent } from './loading/loading.component';
import { SconfigService } from './services/sconfig.service';
import { SheetService } from './services/sheet.service';
import { ReportService } from './report/report.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('drawer') drawer;
  @ViewChild('reportComponent') reportComponent;
  @ViewChild('tree') treeComponent;

  displayGraph = 'Tree';
  refreshTree = false;
  refreshIndent = false;
  refreshReport = false;
  refreshLogs = false;
  sheetName = 'All Organs';
  shouldRefreshData = false;
  showCompInDrawer = 'Report';

  constructor(
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    public sc: SconfigService,
    public sheet: SheetService,
    public report: ReportService) {
    this.getSelectedSheet(this.sheetName);
  }

  ngOnInit() {
  }

  toggleReportDrawer(val) {
    this.refreshReport = val;
    this.drawer.opened = val;
    this.showCompInDrawer = 'Report';
  }

  toggleLogsDrawer(val) {
    this.refreshLogs = val;
    this.drawer.opened = val;
    this.showCompInDrawer = 'Logs';
  }

  showGraph(val) {
    this.displayGraph = val;
    this.getSelectedSheet(this.sheetName);
  }

  refreshData(val) {
    if (val === 'Tree') {
      this.openLoading();
      this.refreshTree = true;
      this.shouldRefreshData = true;
    } else if (val === 'Indented List') {
      this.openLoading();
      this.refreshIndent = true;
    }
  }

  returnRefresh(val) {
    if (val.comp === 'Tree') {
      this.dialog.closeAll();
      if (val.val) {
        this.openSnackBar('Tree data successfully fetched.', 'Close', 'green');
      } else {
        this.openSnackBar('Error while fetching data.', 'Close', 'red');
      }
      this.refreshTree = false;
      this.shouldRefreshData = false;


    } else if (val.comp === 'Indented List') {
      this.dialog.closeAll();
      if (val.val) {
        this.openSnackBar('Indented List data successfully fetched.', 'Close', 'green');
      } else {
        this.openSnackBar('Error while fetching data.', 'Close', 'red');
      }
      this.refreshIndent = false;
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

  downloadVis() {
    this.treeComponent.downloadVis();
  }

  getSelectedSheet(event) {
    this.sheetName = event;
    this.report.reportLog(`${this.sheetName}`, 'success', 'file');
    new Promise((res, rej) => {
      this.sheet.sheet = this.sc.SHEET_CONFIG[this.sc.SHEET_CONFIG.findIndex(i => i.display === this.sheetName)];
      res(true);
    })
      .then(data => {
        if (data) {
          this.openLoading();
          setTimeout(() => {
            this.shouldRefreshData = true;
            this.reportComponent.getData();
          }, 500)
        }
      });

  }
}
