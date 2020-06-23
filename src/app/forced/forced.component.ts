import { Component, OnInit } from '@angular/core';
import embed, { vega } from 'vega-embed';
import { SheetService } from '../sheet.service';

@Component({
  selector: 'app-forced',
  templateUrl: './forced.component.html',
  styleUrls: ['./forced.component.css']
})
export class ForcedComponent implements OnInit {
  constructor(public sheet: SheetService) {

    let config: any = {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "signals": [
      ],

      "data": [
        {
          "name": "nodes",
          values: sheet.bimodalData,
          "format": { "type": "json", "property": "nodes" },
        },
        {
          "name": "edges",
          values: sheet.bimodalData,
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
              "shape": "diagonal",
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
              "strokeWidth": { "value": 1 },
              "x": { "value": 0 },
              "y": { "value": 5 },
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
              "size": { value: 500 },
              "fill": { "signal": "datum.group == 1 ? '#39568CFF' : '#DCE319FF'" },
              "color": { "field": "Origin", "type": "nominal" },
              "x": { "field": "x" },
              "y": { "field": "y", "offset": 5 },
              // "opacity": { "signal": "datum.group == 1 ? 0 : 1" },
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
        // {
        //   "type": "text",
        //   "zindex": 5,
        //   "dx": 5,
        //   "from": { "data": "nodes" },
        //   "encode": {
        //     "update": {
        //       "x": { "field": "x", offset: 10},
        //       "y": { "field": "y"},
        //       "dx": { value: -20 },
        //       "align": { "value": "right" },
        //       "baseline": { "value": "middle" },
        //       "text": { "field": "first" },
        //       "fontSize": { "field": "fontSize" },
        //       "opacity": { "value": 1 }
        //     }
        //   }
        // },
      ]
    }

    embed('#forcedVis', config, { actions: false })

  }

  ngOnInit(): void {

  }

}
