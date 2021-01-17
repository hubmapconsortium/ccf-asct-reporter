import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Sheet, SheetConfig } from '../../models/sheet.model';
import { Error } from '../../models/response.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-vis-controls',
  templateUrl: './vis-controls.component.html',
  styleUrls: ['./vis-controls.component.scss']
})
export class VisControlsComponent implements OnInit {

  @Input() config: SheetConfig;
  @Input() error: Error;
  @Input() currentSheet: Sheet;
  

  @Output() updatedConfig: EventEmitter<any>  = new EventEmitter<any>();
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  changeWidth() {
    this.updatedConfig.emit({
      property: 'width',
      config: this.config
    });
  }

  changeHeight() {
    this.updatedConfig.emit({
      property: 'height',
      config: this.config
    });
  }

  changeShowOntology() {
    this.config.show_ontology = !this.config.show_ontology;
    this.updatedConfig.emit({
      property: 'show-ontology',
      config: this.config
    });
  }

  changeBimodalDistanceX() {
    this.updatedConfig.emit({
      property: 'bm-x',
      config: this.config
    });
  }

  changeBimodalDistanceY() {
    this.updatedConfig.emit({
      property: 'bm-y',
      config: this.config
    });
  }

  changeShowAS() {
    this.updatedConfig.emit({
      property: 'show-as',
      config: this.config
    });
  }

  exportControls(event: any) {
    event.stopPropagation();
    var sJson = JSON.stringify(this.config);
    var element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
    element.setAttribute('download', "asct-b-graph-config.json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

}
