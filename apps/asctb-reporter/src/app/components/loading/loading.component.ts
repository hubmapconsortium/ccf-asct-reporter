import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { UIState } from '../../store/ui.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  @Select(UIState) loadingText$: Observable<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadingText$.subscribe((l) => {
      this.data = l.loadingText;
    });
  }
}
