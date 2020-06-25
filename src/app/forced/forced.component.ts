import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import embed, { vega } from 'vega-embed';
import { SheetService } from '../sheet.service';

@Component({
  selector: 'app-forced',
  templateUrl: './forced.component.html',
  styleUrls: ['./forced.component.css']
})
export class ForcedComponent implements OnInit {

  @Output() graphCompleted = new EventEmitter();
  sortOptions = [
    'Alphabetically',
    'Degree'
  ]
  selectedOption = this.sortOptions[0]
  hasGraphRendered = false;
  constructor(public sheet: SheetService) {
    // this.makeGraph();
  }

  ngOnInit(): void {

  }

  makeGraph() {
    let config: any = {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "title": {
        "text": "Cell Types (Sorted by 1st Occurrence)",
        "anchor": "middle",
        fontSize: 16
      },
      "signals": [
      ],

      "data": [
        {
          "name": "nodes",
          values: this.sheet.getASCTData(),
          "format": { "type": "json", "property": "nodes" },
        },
        {
          "name": "edges",
          values: this.sheet.getASCTData(),
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
              "size": { value: 300 },
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

  getSelection() {
    if (this.selectedOption == 'Degree')
      this.sheet.shouldSortAlphabetically = false
    else
      this.sheet.shouldSortAlphabetically = true

    this.sheet.makeASCTData(this.sheet.sheetData, this.sheet.updatedTreeData).then(data => {
      if (data) {
        this.makeGraph();
      }
    })

  }

}
