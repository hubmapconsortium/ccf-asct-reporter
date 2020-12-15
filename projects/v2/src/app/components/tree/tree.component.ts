import { Component, OnInit, Input } from '@angular/core';
// import embed from 'vega-embed';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  
  @Input() spec;

  constructor() { 
    
  }

  async ngOnInit() {
  }

}