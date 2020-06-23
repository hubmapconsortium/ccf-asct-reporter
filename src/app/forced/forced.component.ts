import { Component, OnInit } from '@angular/core';
import embed, { vega } from 'vega-embed';
import { THETA } from 'vega-lite/build/src/channel';
import { SheetService } from '../sheet.service';

@Component({
  selector: 'app-forced',
  templateUrl: './forced.component.html',
  styleUrls: ['./forced.component.css']
})
export class ForcedComponent implements OnInit {

  constructor(public sheet: SheetService) {
    const height = document.getElementsByTagName('body')[0].clientHeight;
    const width = document.getElementsByTagName('body')[0].clientWidth;


    setTimeout(() => {
      
      let config: any = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": width,
        "height": 2500,
        "autosize": "fit",
      
        "signals": [
          {
            "name": "orient", "value": "vertical",
            "bind": {"input": "select", "options": ["vertical", "horizontal", "radial"]}
          },
          {
            "name": "shape", "value": "diagonal",
            "bind": {"input": "select", "options": ["line", "arc", "curve", "diagonal", "orthogonal"]}
          }
        ],
      
        "data": [
          {
            "name": "nodes",
            // "values": [
            //   {"id": 2, "x":  0, "y":100},
            //   {"id": 3, "x":-75, "y":175},
            //   {"id": 5, "x": 75, "y":175},
            //   {"id": 6, "x":-50, "y": 25},
            //   {"id": 7, "x": 50, "y": 25}
            // ],
            values: sheet.bioModalData,
            "format": { "type": "json", "property": "nodes" },
            "transform": [
              {
                "type": "formula",
                "expr": "atan2(datum.y, datum.x)",
                "as":   "angle"
              },
              {
                "type": "formula",
                "expr": "sqrt(datum.y * datum.y + datum.x * datum.x)",
                "as":   "radius"
              },
              {
                "type": "formula",
                "expr": "orient === 'radial' ? datum.angle : datum.x",
                "as":   "v0"
              },
              {
                "type": "formula",
                "expr": "orient === 'radial' ? datum.radius : datum.y",
                "as":   "v1"
              }
            ]
          },
          {
            "name": "edges",
            values: sheet.bioModalData, "format": { "type": "json", "property": "links" },
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
                "sourceX": "source.v0",
                "sourceY": "source.v1",
                "targetX": "target.v0",
                "targetY": "target.v1",
                "orient": {"signal": "orient"},
                "shape": {"signal": "shape"},
              }
            ]
          }
        ],
      
        "marks": [
          {
            "type": "path",
            "from": {"data": "edges"},
            "encode": {
              "enter": {
                "stroke": {"value": "#ccc"},
                "strokeWidth": {"value": 2},
                "x": {"value": 100},
                "y": {"value": 0}
              },
              "update": {
                "path": {"field": "path"}
              }
            }
          },
          {
            "type": "symbol",
            "from": {"data": "nodes"},
            "encode": {
              "enter": {
                "size": {"value": 200},
                "fill": {"value": "steelblue"},
                "x": {"field": "x", "offset": 100},
                "y": {"field": "y", "offset": 0}
              }
            }
          },
          
        
          {
            "name": "lastName",
            "type": "text",
            "zindex": 5,
            "dx": 5,
            "from": { "data": "nodes" },
            "encode": {
              "update": {
                "x": { "field": "x" },
                "y": { "field": "y" },
                "dx": { value: 120 },
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

      embed('#forcedVis', config)
    }, 3000)
  }

  ngOnInit(): void {

  }

}
