import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UIState, UIStateModel } from '../../store/ui.state';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  @Select(UIState) loadingText$!: Observable<UIStateModel>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}

  ngOnInit(): void {
    this.loadingText$.subscribe((l) => {
      this.data = l.loadingText;
    });
  }
}
