import { Component, OnInit, Input } from '@angular/core';
import { ExportVega } from '../../models/response.model';
import { VegaService } from './vega.service';
// import embed from 'vega-embed';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { InfoComponent } from '../../components/info/info.component';
import { TNode } from '../../models/tree.model';
import { BMNode } from '../../models/bimodal.model';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  @Input() export: ExportVega;
  infoSheetRef: MatBottomSheetRef;

  constructor(public vs: VegaService, private infoSheet: MatBottomSheet) {
    
  }

  ngOnInit() {
    this.initInfoBS();
  }

  initInfoBS() {
    this.vs.textSignal$.subscribe(text => {
      if (text) {
        this.infoSheetRef = this.infoSheet.open(InfoComponent, {
          disableClose: false,
          hasBackdrop: false,
          autoFocus: false,
          data: text
        })
      } else {
        if(this.infoSheetRef) this.infoSheetRef.dismiss();
      }
    })
  }

  

}
