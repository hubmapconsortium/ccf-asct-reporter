import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Sheet, SheetConfig } from '../../models/sheet.model';
import { Error } from '../../models/response.model';
import { DomSanitizer } from '@angular/platform-browser';
import {GoogleAnalyticsService, GaAction} from '../../services/google-analytics.service';

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
  constructor(private sanitizer: DomSanitizer, public ga: GoogleAnalyticsService) { }

  ngOnInit(): void {
  }

  changeWidth() {
    this.updatedConfig.emit({
      property: 'width',
      config: this.config
    });
    this.ga.eventEmitter("vc_change_width", "viscontrols", "Width Slider", GaAction.SLIDE, this.config.width);
  }

  changeHeight() {
    this.updatedConfig.emit({
      property: 'height',
      config: this.config
    });
    this.ga.eventEmitter("vc_change_height", "viscontrols", "Height Slider", GaAction.SLIDE, this.config.height);
  }

  changeShowOntology() {
    this.config.show_ontology = !this.config.show_ontology;
    this.updatedConfig.emit({
      property: 'show-ontology',
      config: this.config
    });
    this.ga.eventEmitter("vc_toggle_ontology", "viscontrols", "Toggle Ontology", GaAction.TOGGLE, this.config.show_ontology ? 1 : 0);
  }

  changeBimodalDistanceX() {
    this.updatedConfig.emit({
      property: 'bm-x',
      config: this.config
    });
    this.ga.eventEmitter("vc_change_bimodalX", "viscontrols", "Bimodal Distance X Slider", GaAction.SLIDE, this.config.bimodal_distance_x);
  }

  changeBimodalDistanceY() {
    this.updatedConfig.emit({
      property: 'bm-y',
      config: this.config
    });
    this.ga.eventEmitter("vc_change_bimodalY", "viscontrols", "Bimodal Distance Y Slider", GaAction.SLIDE, this.config.bimodal_distance_y);
  }

  changeShowAS() {
    this.updatedConfig.emit({
      property: 'show-as',
      config: this.config
    });
    this.ga.eventEmitter("vc_toggle_showAS", "viscontrols", "Toggle AS Visibility", GaAction.TOGGLE, this.config.show_all_AS ? 1 : 0);
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

    this.ga.eventEmitter("vc_export_controls", "viscontrols", "Export Vis Controls", GaAction.CLICK, null);
  }

}
