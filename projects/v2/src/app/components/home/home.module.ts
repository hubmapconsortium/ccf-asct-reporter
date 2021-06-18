import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { FooterModule } from '../footer/footer.module';
import { YouTubePlayerModule } from '@angular/youtube-player';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    FontAwesomeModule,
    RouterModule,
    FooterModule,
    YouTubePlayerModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
