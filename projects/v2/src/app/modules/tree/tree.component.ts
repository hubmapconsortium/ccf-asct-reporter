import { Component, OnInit, Input } from '@angular/core';
import { ExportVega } from '../../models/response.model';
// import embed from 'vega-embed';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  @Input() export: ExportVega;

  constructor() {

  }

  async ngOnInit() {
  }

  

}
