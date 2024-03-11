import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [InfoComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatBottomSheetModule,
    MarkdownModule,
  ],
  exports: [InfoComponent],
})
export class InfoModule {}
