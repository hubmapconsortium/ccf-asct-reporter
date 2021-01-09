import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Sheet, SheetConfig } from '../../models/sheet.model';
import { Error } from '../../models/response.model';

@Component({
  selector: 'app-vis-controls',
  templateUrl: './vis-controls.component.html',
  styleUrls: ['./vis-controls.component.scss']
})
export class VisControlsComponent implements OnInit {
  
  @Input() config: SheetConfig;
  @Input() error: Error;

  @Output() updatedSheet: EventEmitter<any>  = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  changeWidth() {
    this.updatedSheet.emit({
      property: 'width',
      config: this.config
    })
  }

  changeHeight() {
    this.updatedSheet.emit({
      property: 'height',
      config: this.config
    })
  }

}
