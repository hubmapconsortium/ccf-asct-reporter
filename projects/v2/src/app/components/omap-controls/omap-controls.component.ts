import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Error } from '../../models/response.model';
import { Store } from '@ngxs/store';
import { OmapConfig } from '../../models/omap.model';

@Component({
  selector: 'app-omap-controls',
  templateUrl: './omap-controls.component.html',
  styleUrls: ['./omap-controls.component.scss']
})
export class OmapControlsComponent {


  @Input() omaps: OmapConfig = { 'organsOnly': false, 'proteinsOnly': false };
  @Input() error: Error;

  @Output() updateConfig: EventEmitter<any> = new EventEmitter<any>();

  constructor(public store: Store) {

  }


  checkBoxClicked(event: Record<string, boolean>) {
    this.omaps.organsOnly = event.organsOnly;
    this.omaps.proteinsOnly = event.proteinsOnly;
    this.updateConfig.emit(this.omaps);
  }
}
