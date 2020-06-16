import { Component, OnInit } from '@angular/core';
import { SheetService } from '../sheet.service';
import embed from 'vega-embed'



@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  sheetData;
  treeData;
  constructor(public sheet: SheetService) {
    this.sheet.getSheetData().then(data => {
      this.sheetData = data.data;
      this.sheetData.shift() // removing headers
      this.treeData = this.sheet.makeTreeData(this.sheetData)

      let height = document.getElementsByTagName('body')[0].clientHeight;
      let width = document.getElementsByTagName('body')[0].clientWidth;

      let yourVlSpec: any = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "An example of Cartesian layouts for a node-link diagram of hierarchical data.",
        "width": width - 500,
        "height": height,
        "padding": 5,
  
        "signals": [
          {
            "name": "labels", "value": true,
            "bind": { "input": "checkbox" }
          },
          {
            "name": "layout", "value": "tidy",
            "bind": { "input": "radio", "options": ["tidy", "cluster"] }
          },
          {
            "name": "links", "value": "diagonal",
            "bind": {
              "input": "select",
              "options": ["line", "curve", "diagonal", "orthogonal"]
            }
          },
          {
            "name": "separation", "value": true,
            "bind": { "input": "checkbox" }
          }
        ],
  
        "data": [
          {
            "name": "tree",
            "values": this.treeData,
            "transform": [
              {
                "type": "stratify",
                "key": "id",
                "parentKey": "parent"
              },
              {
                "type": "tree",
                "method": { "signal": "layout" },
                "size": [{ "signal": "height + 100" }, { "signal": `width + 50` }],
                "separation": { "signal": "separation" },
                "as": ["y", "x", "depth", "children"]
              }
            ]
          },
          {
            "name": "links",
            "source": "tree",
            "transform": [
              { "type": "treelinks" },
              {
                "type": "linkpath",
                "orient": "horizontal",
                "shape": { "signal": "links" }
              }
            ]
          }
        ],
  
        "scales": [
          {
            "name": "color",
            "type": "linear",
            "range": { "scheme": "viridis" },
            "domain": { "data": "tree", "field": "depth" },
            "zero": true
          }
        ],
  
        "marks": [
          {
            "type": "path",
            "from": { "data": "links" },
            "encode": {
              "update": {
                "path": { "field": "path" },
                "stroke": { "value": "#ccc" }
              }
            }
          },
          {
            "type": "symbol",
            "from": { "data": "tree" },
            "encode": {
              "enter": {
                "size": { "value": 300 },
                "stroke": { "value": "#fff" }
              },
              "update": {
                "x": { "field": "x" },
                "y": { "field": "y" },
                "tooltip": [
                  {"field": "uberon_id", "type": "quantitative", "title": "date"}
                ],
                "fill": { "scale": "color", "field": "depth" }
              }
            }
          },
          {
            "type": "text",
            "from": { "data": "tree" },
            "encode": {
              "enter": {
                "text": { "field": "name" },
                "fontSize": { "value": 16 },
                "baseline": { "value": "middle" },
              },
              "update": {
                "x": { "field": "x" },
                "y": { "field": "y" },
                "dx": { "signal": "datum.children ? -15 : 15" },
                "align": { "signal": "datum.children ? 'right' : 'left'" },
                "opacity": { "signal": "labels ? 1 : 0" }
              }
            }
          }
        ]
      }

      embed('#vis', yourVlSpec)

    })
  }



  ngOnInit(): void {

  }


}
