import { Component, OnInit, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { bimodalCTSizeOptions, bimodalBSizeOptions, bimodalSortOptions, BimodalConfig } from '../../models/bimodal.model';
import { TreeState } from '../../store/tree.state';
import { Observable } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { UpdateBimodalConfig } from '../../actions/tree.actions';
import { BimodalService } from '../../modules/tree/bimodal.service';
import { Error } from '../../models/response.model';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.scss']
})
export class FunctionsComponent implements OnInit {

  bmSizeOptions = bimodalBSizeOptions;
  sortOptions = bimodalSortOptions;
  ctSizeOptions = bimodalCTSizeOptions;
  bimodalConfig: BimodalConfig;

  @Input() error: Error;

  @Select(TreeState.getBimodalConfig) config$: Observable<BimodalConfig>;

  constructor(public store: Store, public bms: BimodalService) {
    this.config$.subscribe(config => {
      this.bimodalConfig = config;
    });
  }

  ngOnInit(): void {
  }

  changeOptions(type: string, field: string, event: MatSelectChange) {
    this.bimodalConfig[type][field] = event.value;
    this.updateBimodal();
  }

  updateBimodal() {
    this.store.dispatch(new UpdateBimodalConfig(this.bimodalConfig)).subscribe(states => {
      const data = states.sheetState.data;
      const sheet = states.sheetState.sheet;
      const treeData = states.treeState.treeData;
      const bimodalConfig = states.treeState.bimodal.config;
      const sheetConfig = states.sheetState.sheetConfig;


      if (data.length) {
        this.bms.makeBimodalData(data, treeData, bimodalConfig, sheet, sheetConfig);
      }
    });
  }

}
