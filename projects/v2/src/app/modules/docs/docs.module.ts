import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsComponent } from './docs.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MarkdownModule } from 'ngx-markdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DocsNavModule } from './docs-nav/docs-nav.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [DocsComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MarkdownModule,
    FontAwesomeModule,
    DocsNavModule,
    RouterModule
  ],
  exports: [DocsComponent]
})
export class DocsModule { }
