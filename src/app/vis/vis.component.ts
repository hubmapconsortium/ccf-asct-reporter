import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingComponent } from '../loading/loading.component';
import { SconfigService } from '../services/sconfig.service';
import { SheetService } from '../services/sheet.service';
import { ReportService } from '../report/report.service';
import { BimodalService } from '../services/bimodal.service';
import { CompareComponent } from '../compare/compare.component';
import { SearchComponent} from '../search/search.component';

import { TreeComponent } from '../tree/tree.component';

@Component({
  selector: 'app-vis',
  templateUrl: './vis.component.html',
  styleUrls: ['./vis.component.css'],
})
export class VisComponent implements OnInit, OnChanges {
  @ViewChild('drawer') drawer;
  @ViewChild('reportComponent') reportComponent;
  @ViewChild('tree') treeComponent;
  @ViewChild(TreeComponent) treeChild: TreeComponent;

  visError = false;
  displayGraph = 'Tree';
  refreshTree = false;
  refreshIndent = false;
  refreshReport = false;
  refreshLogs = false;
  currentSheetName = 'All Organs';
  currentSheet = this.sc.SHEET_CONFIG[0];
  shouldRefreshData = false;
  showCompInDrawer = '';
  dataVersion = '';
  compareData = [];
  comapreComponentSources = [];
  searchIds = [-1];
  loadingDialog: any;
  fullscreen: boolean;

  constructor(
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    public sc: SconfigService,
    public sheet: SheetService,
    public report: ReportService,
    public bms: BimodalService
  ) {}

  ngOnInit() {}

  ngOnChanges() {

  }

  toggleFullScreen(val: boolean) {
    this.fullscreen = val;
  }

  toggleReportDrawer(val) {
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

      this.compareData = [];
      this.comapreComponentSources = [];
      this.displayGraph = val;
      this.shouldRefreshData = true;
  }

  async searchStructure() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100%';
    dialogConfig.maxWidth = '700px';

    const dialogRef = this.dialog.open(SearchComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(r => {
      if (r?.data) {
        this.treeChild.setGraphToShowSearch(r.data);
        this.searchIds = r.data;
      } else {
        this.searchIds = [-1];
      }
    });

  }

  uploadDDSheet() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100%';
    dialogConfig.maxWidth = '700px';
    dialogConfig.data = {
      sources: this.comapreComponentSources
    };
    const dialogRef = this.dialog.open(CompareComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(r => {
      if (r.data.length > 0) {
        this.treeChild.setGraphToCompare(r.data);
        this.compareData = r.data;
        this.comapreComponentSources = r.sources;
        dialogRef.close();
        this.loadingDialog.close();
      }
    });
  }

  deleteCompareSheet(i) {
    this.compareData.splice(i, 1);
    this.comapreComponentSources.splice(i, 1);
    this.shouldRefreshData = true;
  }

  refreshData(val) {
    this.refreshReport = true;
    this.compareData = [];
    this.comapreComponentSources = [];
    this.searchIds = [];
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
      this.loadingDialog.close();
      if (val.val) {
        val.status === 200
          ? this.openSnackBar(
              'Tree data successfully fetched.',
              'Close',
              'green'
            )
          : this.openSnackBar(val.msg, 'Close', 'warn');
      } else {
        this.visError = true;
        this.openSnackBar(val.msg, 'Close', 'red');
      }
      this.refreshTree = false;
      this.shouldRefreshData = false;
    } else if (val.comp === 'Indented List') {
      this.loadingDialog.close();
      if (val.val) {
        val.status === 200
          ? this.openSnackBar(
              'Indented List data successfully fetched.',
              'Close',
              'green'
            )
          : this.openSnackBar(
              'Indented List successfully fetched from system cache.',
              'Close',
              'warn'
            );
      } else {
        this.openSnackBar('Error while fetching data.', 'Close', 'red');
      }
      this.refreshIndent = false;
      this.shouldRefreshData = false;
    }
    this.refreshReport = false;
  }

  closeComponent() {
    this.refreshReport = false;
    this.showCompInDrawer = '';
  }

  openLoading() {
    if (!this.dialog.getDialogById('loading-dialog')) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      this.loadingDialog = this.dialog.open(LoadingComponent, {
        id: 'loading-dialog',
        disableClose: true,
        autoFocus: true,
        data: {
          sheet: this.currentSheet,
          list: this.currentSheet.name === 'ao' ? this.sc.ORGANS : [],
        },
      });
    }

  }

  openSnackBar(message, action, style) {
    this.snackBar.open(message, action, {
      duration: style === 'green' || style === 'warn' ? 3000 : undefined,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: [`${style}-snackbar`],
    });
  }

  downloadVis(img) {
    this.treeComponent.downloadVis(img);
  }

  getSelectedSheet(event) {
    this.compareData = [];
    this.comapreComponentSources = [];
    this.currentSheetName = event;
    this.report.reportLog(`${this.currentSheetName}`, 'success', 'file');
    this.currentSheet = this.sc.SHEET_CONFIG[
      this.sc.SHEET_CONFIG.findIndex((i) => i.display === this.currentSheetName)
    ];
    this.openLoading();
    this.shouldRefreshData = true;
  }

  setVersionFolder(folder: string) {
    this.visError = false;
    this.dataVersion = folder;
    this.sheet.dataVersion = folder;
  }


  mail() {
    const subject = `Problem with ${this.currentSheet.name}.xlsx`;
    const mailText = `mailto:infoccf@indiana.edu?subject=${subject}`;
    window.location.href = mailText;
  }
}
