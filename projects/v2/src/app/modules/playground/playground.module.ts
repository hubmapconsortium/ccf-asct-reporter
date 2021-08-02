import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaygroundComponent } from './playground.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TreeModule } from '../tree/tree.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FileUploadModule } from '../../components/file-upload/file-upload.module';



@NgModule({
  declarations: [PlaygroundComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    TreeModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule
  ],
  exports: [PlaygroundComponent]
})
export class PlaygroundModule { }
