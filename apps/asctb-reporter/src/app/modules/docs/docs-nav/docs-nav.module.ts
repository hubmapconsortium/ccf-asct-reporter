import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DocsNavComponent } from './docs-nav.component';

@NgModule({
  declarations: [DocsNavComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [DocsNavComponent],
})
export class DocsNavModule {}
