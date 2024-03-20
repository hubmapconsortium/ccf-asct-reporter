import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OmapConfig } from '../../models/omap.model';
import { Error } from '../../models/response.model';

@Component({
  selector: 'app-omap-controls',
  templateUrl: './omap-controls.component.html',
  styleUrls: ['./omap-controls.component.scss'],
})
export class OmapControlsComponent {
  @Input() omaps: OmapConfig = { organsOnly: false, proteinsOnly: false };
  @Input() error!: Error;

  @Output() updateConfig = new EventEmitter<OmapConfig>();

  checkBoxClicked(event: Record<string, boolean>) {
    this.omaps.organsOnly = event['organsOnly'];
    this.omaps.proteinsOnly = event['proteinsOnly'];
    this.updateConfig.emit(this.omaps);
  }
}
