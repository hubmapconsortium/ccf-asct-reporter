import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingComponent } from '../loading/loading.component';
import { SconfigService } from '../services/sconfig.service';
import { SheetService } from '../services/sheet.service';
import { ReportService } from '../report/report.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-vis',
  templateUrl: './vis.component.html',
  styleUrls: ['./vis.component.css']
})
export class VisComponent implements OnInit {

  @ViewChild('drawer') drawer;
  @ViewChild('reportComponent') reportComponent;
  @ViewChild('tree') treeComponent;

  displayGraph = 'Tree';
  refreshTree = false;
  refreshIndent = false;
  refreshReport = false;
  refreshLogs = false;
  currentSheetName = 'All Organs';
  currentSheet = this.sc.SHEET_CONFIG[0];
  shouldRefreshData = false;
  showCompInDrawer = '';

  constructor(
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    public sc: SconfigService,
    public sheet: SheetService,
    public report: ReportService) {
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
    this.openLoading();
    this.displayGraph = val;
    this.shouldRefreshData = true;
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
        val.status === 200 ?
          this.openSnackBar('Tree data successfully fetched.', 'Close', 'green') :
          this.openSnackBar(val.msg, 'Close', 'warn');

      } else {
        this.openSnackBar('Error while fetching data.', 'Close', 'red');
      }
      this.refreshTree = false;
      this.shouldRefreshData = false;


    } else if (val.comp === 'Indented List') {
      this.dialog.closeAll();
      if (val.val) {
        val.status === 200 ?
          this.openSnackBar('Indented List data successfully fetched.', 'Close', 'green') :
          this.openSnackBar('Indented List successfully fetched from system cache.', 'Close', 'warn');
      } else {
        this.openSnackBar('Error while fetching data.', 'Close', 'red');
      }
      this.refreshIndent = false;
      this.shouldRefreshData = false;

    }
  }

  closeComponent() {
    this.showCompInDrawer = '';
  }

  openLoading() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(LoadingComponent, dialogConfig);
  }

  openSnackBar(message, action, style) {
    this.snackBar.open(message, action, {
      duration: style === 'green' || style === 'warn' ? 3000 : undefined,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: [`${style}-snackbar`]
    });
  }

  downloadVis(img) {
    this.treeComponent.downloadVis(img);
  }

  getSelectedSheet(event) {
    this.currentSheetName = event;
    this.report.reportLog(`${this.currentSheetName}`, 'success', 'file');
    this.currentSheet = this.sc.SHEET_CONFIG[this.sc.SHEET_CONFIG.findIndex(i => i.display === this.currentSheetName)];
    this.openLoading();
    this.shouldRefreshData = true;
  }
}

