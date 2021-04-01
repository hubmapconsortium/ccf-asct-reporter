import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Sheet, SheetConfig } from '../../models/sheet.model';
import { Error } from '../../models/response.model';
import {GoogleAnalyticsService} from '../../services/google-analytics.service';
import { GaAction, GaCategory } from '../../models/ga.model';

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
  constructor(public ga: GoogleAnalyticsService) { }

  ngOnInit(): void {
  }

  changeWidth() {
    this.updatedConfig.emit({
      property: 'width',
      config: this.config
    });
    this.ga.eventEmitter('vc_change_width', GaCategory.CONTROLS, 'Width Slider', GaAction.SLIDE, this.config.width);
  }

  changeHeight() {
    this.updatedConfig.emit({
      property: 'height',
      config: this.config
    });
    this.ga.eventEmitter('vc_change_height', GaCategory.CONTROLS, 'Height Slider', GaAction.SLIDE, this.config.height);
  }

  changeShowOntology() {
    this.config.show_ontology = !this.config.show_ontology;
    this.updatedConfig.emit({
      property: 'show-ontology',
      config: this.config
    });
    this.ga.eventEmitter('vc_toggle_ontology', GaCategory.CONTROLS, 'Toggle Ontology', GaAction.TOGGLE, this.config.show_ontology);
  }

  changeBimodalDistanceX() {
    this.updatedConfig.emit({
      property: 'bm-x',
      config: this.config
    });
    this.ga.eventEmitter('vc_change_bimodalX', GaCategory.CONTROLS, 'Bimodal Distance X Slider', GaAction.SLIDE,
      this.config.bimodal_distance_x);
  }

  changeBimodalDistanceY() {
    this.updatedConfig.emit({
      property: 'bm-y',
      config: this.config
    });
    this.ga.eventEmitter('vc_change_bimodalY', GaCategory.CONTROLS, 'Bimodal Distance Y Slider', GaAction.SLIDE,
      this.config.bimodal_distance_y);
  }

  changeShowAS() {
    this.updatedConfig.emit({
      property: 'show-as',
      config: this.config
    });
    this.ga.eventEmitter('vc_toggle_showAS', GaCategory.CONTROLS, 'Toggle AS Visibility', GaAction.TOGGLE, this.config.show_all_AS);
  }

  exportControls(event: any) {
    event.stopPropagation();
    const sJson = JSON.stringify(this.config);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
    element.setAttribute('download', 'asct-b-graph-config.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    this.ga.eventEmitter('vc_export_controls', GaCategory.CONTROLS, 'Export Vis Controls', GaAction.CLICK, null);
  }

}
