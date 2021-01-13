import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { SheetState } from '../../store/sheet.state';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {
  
  @Select(SheetState.getParsedData) data$: Observable<string[]>;
  constructor() { 

  }

  ngOnInit(): void {
  }

}
