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

  @Output() updatedConfig: EventEmitter<any>  = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  changeWidth() {
    this.updatedConfig.emit({
      property: 'width',
      config: this.config
    })
  }

  changeHeight() {
    this.updatedConfig.emit({
      property: 'height',
      config: this.config
    })
  }

  changeShowOntology() {
    this.config.show_ontology = !this.config.show_ontology;
    this.updatedConfig.emit({
      property: 'so',
      config: this.config
    })
  }

  changeBimodalDistanceX() {
    this.updatedConfig.emit({
      property: 'bm-x',
      config: this.config
    })
  }

  changeBimodalDistanceY() {
    this.updatedConfig.emit({
      property: 'bm-y',
      config: this.config
    })
  }

}
