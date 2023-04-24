import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Error } from '../../models/response.model';
import { Store } from '@ngxs/store';
import { UpdateOmapConfig } from '../../actions/tree.actions';
import { OmapConfig } from '../../models/omap.model';
import { BimodalService } from '../../modules/tree/bimodal.service';

@Component({
  selector: 'app-omap-controls',
  templateUrl: './omap-controls.component.html',
  styleUrls: ['./omap-controls.component.scss']
})
export class OmapControlsComponent {


  @Input() omaps: OmapConfig = { 'organsOnly': false, 'proteinsOnly': false };
  @Input() error: Error;

  @Output() updateConfig: EventEmitter<any> = new EventEmitter<any>();

  constructor(public store: Store, public bms: BimodalService) {

  }


  checkBoxClicked(event: Record<string, boolean>) {
    this.omaps.organsOnly = event.organsOnly;
    this.omaps.proteinsOnly = event.proteinsOnly;
    this.updateConfig.emit(this.omaps);
    this.updateBimodal(this.omaps);
  }

  updateBimodal(config) {
    this.store.dispatch(new UpdateOmapConfig(config)).subscribe(states => {
      const data = states.sheetState.data;
      const treeData = states.treeState.treeData;
      const bimodalConfig = states.treeState.bimodal.config;
      const omapConfig = states.treeState.omapConfig;
      const sheetConfig = states.sheetState.sheetConfig;
      let omapOrganNames= states.sheetState.allOmapOrgans;
      omapOrganNames.push('body');
      omapOrganNames=omapOrganNames.map(word => word.toLowerCase());


      if (data.length) {
        this.bms.makeBimodalData(data, treeData, bimodalConfig, false, sheetConfig, omapConfig,omapOrganNames);
      }
    });
  }
}
