import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';

import { SheetService } from './sheet.service';
import { NavbarComponent } from './navbar/navbar.component';
import { TreeComponent } from './tree/tree.component';
import { ReportComponent } from './report/report.component';
import { IndentComponent } from './indent/indent.component';
import { TableComponent } from './table/table.component';
import { LogsComponent } from './logs/logs.component';
import { BimodalComponent } from './bimodal/bimodal.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { LoadingComponent } from './loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';


const MatModules = [
  MatToolbarModule,
  MatButtonModule,
  MatSelectModule,
  MatSidenavModule,
  MatTreeModule,
  MatIconModule,
  MatListModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatExpansionModule,
  MatTableModule
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TreeComponent,
    ReportComponent,
    IndentComponent,
    LoadingComponent,
    TableComponent,
    BimodalComponent,
    LogsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatModules,
    OrderModule
  ],
  providers: [
    SheetService
  ],
  exports: [
    MatModules
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
