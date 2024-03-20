import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { GaAction, GaCategory } from '../../models/ga.model';
import { Error } from '../../models/response.model';
import { Sheet, SheetConfig } from '../../models/sheet.model';

@Component({
  selector: 'app-vis-controls',
  templateUrl: './vis-controls.component.html',
  styleUrls: ['./vis-controls.component.scss'],
})
export class VisControlsComponent {
  @Input() config!: SheetConfig;
  @Input() error!: Error;
  @Input() currentSheet!: Sheet;
  @Input() selectedOrgans!: string[];

  @Output() updatedConfig = new EventEmitter<{
    property: string;
    config: SheetConfig;
  }>();
  constructor(public ga: GoogleAnalyticsService) {}

  changeWidth() {
    this.updatedConfig.emit({
      property: 'width',
      config: this.config,
    });
    this.ga.event(
      GaAction.SLIDE,
      GaCategory.CONTROLS,
      'Width Slider',
      this.config.width
    );
  }

  changeHeight() {
    this.updatedConfig.emit({
      property: 'height',
      config: this.config,
    });
    this.ga.event(
      GaAction.SLIDE,
      GaCategory.CONTROLS,
      'Height Slider',
      this.config.height
    );
  }

  changeShowOntology() {
    this.config.show_ontology = !this.config.show_ontology;
    this.updatedConfig.emit({
      property: 'show-ontology',
      config: this.config,
    });
    this.ga.event(
      GaAction.TOGGLE,
      GaCategory.CONTROLS,
      'Toggle Ontology',
      +this.config.show_ontology
    );
  }

  showDiscrepencyLabel() {
    this.config.discrepencyLabel = !this.config.discrepencyLabel;
    this.config.discrepencyId = false;
    this.config.duplicateId = false;
    this.updatedConfig.emit({
      property: 'show-discrepency-label',
      config: this.config,
    });
    this.ga.event(
      GaAction.TOGGLE,
      GaCategory.CONTROLS,
      'Toggle Discrepency Label',
      +this.config.discrepencyLabel
    );
  }

  showDiscrepencyId() {
    this.config.discrepencyId = !this.config.discrepencyId;
    this.config.discrepencyLabel = false;
    this.config.duplicateId = false;
    this.updatedConfig.emit({
      property: 'show-discrepency-id',
      config: this.config,
    });
    this.ga.event(
      GaAction.TOGGLE,
      GaCategory.CONTROLS,
      'Toggle Discrepency ID',
      +this.config.discrepencyLabel
    );
  }

  showDuplicateId() {
    this.config.duplicateId = !this.config.duplicateId;
    this.config.discrepencyLabel = false;
    this.config.discrepencyId = false;
    this.updatedConfig.emit({
      property: 'show-duplicate-id',
      config: this.config,
    });
    this.ga.event(
      GaAction.TOGGLE,
      GaCategory.CONTROLS,
      'Toggle Duplicate ID',
      +this.config.duplicateId
    );
  }

  changeBimodalDistanceX() {
    this.updatedConfig.emit({
      property: 'bm-x',
      config: this.config,
    });
    this.ga.event(
      GaAction.SLIDE,
      GaCategory.CONTROLS,
      'Bimodal Distance X Slider',
      this.config.bimodal_distance_x
    );
  }

  changeBimodalDistanceY() {
    this.updatedConfig.emit({
      property: 'bm-y',
      config: this.config,
    });
    this.ga.event(
      GaAction.SLIDE,
      GaCategory.CONTROLS,
      'Bimodal Distance Y Slider',
      this.config.bimodal_distance_y
    );
  }

  changeShowAS() {
    this.updatedConfig.emit({
      property: 'show-as',
      config: this.config,
    });
    this.ga.event(
      GaAction.TOGGLE,
      GaCategory.CONTROLS,
      'Toggle AS Visibility',
      +(this.config.show_all_AS ?? false)
    );
  }

  exportControls(event: Event) {
    event.stopPropagation();
    const sJson = JSON.stringify(this.config);
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson)
    );
    element.setAttribute('download', 'asct-b-graph-config.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    this.ga.event(
      GaAction.CLICK,
      GaCategory.CONTROLS,
      'Export Vis Controls',
      undefined
    );
  }
}
