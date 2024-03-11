import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompareComponent } from './compare.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidenavModule } from '../sidenav/sidenav.module';
import { SidenavHeaderModule } from '../sidenav-header/sidenav-header.module';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [CompareComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    SidenavModule,
    SidenavHeaderModule,
    MatButtonModule,
    FileUploadModule,
    MatCardModule,
  ],
  exports: [CompareComponent],
})
export class CompareModule {}
