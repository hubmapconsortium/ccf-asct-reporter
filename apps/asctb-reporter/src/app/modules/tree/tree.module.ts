import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeComponent } from './tree.component';

@NgModule({
  declarations: [TreeComponent],
  imports: [CommonModule],
  exports: [TreeComponent],
})
export class TreeModule {}
