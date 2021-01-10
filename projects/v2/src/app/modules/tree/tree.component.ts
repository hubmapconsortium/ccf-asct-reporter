import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { SheetState } from '../../store/sheet.state';
import { SheetConfig } from '../../models/sheet.model';
import { Observable } from 'rxjs';
import { CT_BLUE, AS_RED, B_GREEN } from '../../models/tree.model';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  CT_BLUE = CT_BLUE;
  AS_RED = AS_RED;
  B_GREEN = B_GREEN;
  
  @Select(SheetState.getSheetConfig) config$: Observable<SheetConfig>;

  constructor() {
    
  }

  ngOnInit() {
  }

}
