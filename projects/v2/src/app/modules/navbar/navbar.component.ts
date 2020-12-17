import { Component, OnInit } from '@angular/core';
import { SHEET_OPTIONS } from '../../static/config';
import { Store, Select } from '@ngxs/store';
import { SheetState, SheetStateModel } from '../../store/sheet.state';
import { Observable } from 'rxjs';
import { Sheet } from '../../models/sheet.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  SHEET_OPTIONS = SHEET_OPTIONS;

  selectedSheetOption: string;

  @Select(SheetState) sheet$: Observable<SheetStateModel>;

  constructor(public Store: Store, public router: Router) { }

  ngOnInit(): void {
    this.sheet$.subscribe(sheet => {
      this.selectedSheetOption = sheet.sheet.display;
    }) 

  }

  getSheetSelection(sheet, event) {
    const selectedSheet = SHEET_OPTIONS.find(s => s.title === sheet);
    this.router.navigate(['/vis'], {queryParams: {sheet: selectedSheet.sheet}})

  }

}
