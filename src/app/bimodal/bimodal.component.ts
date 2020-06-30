import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import embed, { vega } from 'vega-embed';
import { SheetService } from '../sheet.service';
import { BimodalService } from './bimodal.service';

@Component({
  selector: 'app-bimodal',
  templateUrl: './bimodal.component.html',
  styleUrls: ['./bimodal.component.css']
})
export class BimodalComponent implements OnInit, OnChanges {

  @Output() graphCompleted = new EventEmitter();
  @Input() bimodalSelection;
  @Input() bimodalSizeSelection;
  selectedOption;
  selectedSizeOption;

  hasGraphRendered = false;
  constructor(public sheet: SheetService, public bms: BimodalService) {
  }

  ngOnInit(): void {

  }

  ngOnChanges() {
    this.selectedOption = this.bimodalSelection

  }

  async makeGraph(data) {
    let config: any = {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "data": [
        {
          "name": "nodes",
          values: data,
          "format": { "type": "json", "property": "nodes" },
        },
        {
          "name": "edges",
          values: data,
          "format": { "type": "json", "property": "links" },
          "transform": [
            {
              "type": "lookup",
              "from": "nodes",
              "key": "id",
              "fields": ["s", "t"],
              "as": ["source", "target"]
            },
            {
              "type": "linkpath",
              "sourceX": "source.x",
              "sourceY": "source.y",
              "targetX": "target.x",
              "targetY": "target.y",
              "orient": "vertical",
              "shape": "line"
            }
          ]
        }
      ],
      "marks": [
        {
          "type": "path",
          "from": { "data": "edges" },
          "encode": {
            "enter": {
              "stroke": { "value": "#ccc" },
              "strokeWidth": { "value": 1.5 },
              "x": { "value": 0 },
              "y": { "value": 5 }
            },
            "update": {
              "path": { "field": "path" }
            }
          }
        },
        {
          "type": "symbol",
          "from": { "data": "nodes" },
          "encode": {
            "enter": {
              "size": { "field": "nodeSize" },
              "fill": { "field": "color" },
              "color": { "field": "Origin", "type": "nominal" },
              "x": { "field": "x" },
              "y": { "field": "y", "offset": 5 },
              "opacity": { "signal": "datum.group == 1 ? 0 : 1" }
            }
          }
        },
        {
          "type": "text",
          "zindex": 5,
          "dx": 5,
          "from": { "data": "nodes" },
          "encode": {
            "update": {
              "x": { "field": "x" },
              "y": { "field": "y", offset: 5 },
              "dx": { value: 15 },
              "align": { "value": "left" },
              "baseline": { "value": "middle" },
              "text": { "field": "last" },
              "fontSize": { "field": "fontSize" },
              "fontWeight": { "value": 400 },
              "opacity": { "value": 1 }
            }
          }
        },
      ]
    }

    let embedded = embed('#ASCTVis', config, { actions: false })
    embedded.then(data => {
      if (data) {
        this.graphCompleted.emit({
          val: true
        })
        this.hasGraphRendered = true;
      }
    })
  }

  getSelection(sortOption, sizeOption) {
    if (sortOption == 'Degree')
      this.bms.shouldSortAlphabetically = false
    else
      this.bms.shouldSortAlphabetically = true

    if (sizeOption == 'Static')
      this.bms.shouldSortBySize = false
    else
      this.bms.shouldSortBySize = true

    this.bms.makeASCTData(this.bms.sheetData, this.bms.updatedTreeData).then(data => {
      if (data) {
        this.makeGraph(data);
      }
    })

  }

}
