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

  treeData = {
    nodes: [
      {
        name: 'A', group: 1, first: 'ONE', x: 20, y: 0, fontSize: 14
      },
      {
        name: 'B', group: 2, last: 'TWO', x: 100, y: 0, fontSize: 14
      },
      {
        name: 'AA', group: 1, first: 'ONE AA', x: 50, y: 100, fontSize: 14
      },
      {
        name: 'BB', group: 2, last: 'TWO BB', x: 100, y: 200, fontSize: 14
      },
      {
        name: 'CC', group: 2, last: 'TWO CC', x: 100, y: 300, fontSize: 14
      }
    ],
    links: [
      {
        source: 0,
        target: 3,
      },
      {
        source: 2,
        target: 1,
      },
      {
        source: 0,
        target: 4,
      }
    ]
  }

  constructor(public sheet: SheetService) {
    const height = document.getElementsByTagName('body')[0].clientHeight;
    const width = document.getElementsByTagName('body')[0].clientWidth;


    setTimeout(() => {

      let config: any = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "A node-link diagram with force-directed layout, depicting character co-occurrence in the novel Les Misérables.",
        "padding": 0,
        width: width - 300,
        height: height,

        "signals": [
          {
            "name": "tooltip",
            "value": { "datum": {} },
            "on": [{
              "events": {
                "type": "mouseover",
                "markname": "nodes"
              },
              "update": "{'datum':datum,'x':x(datum),'y':y(datum)}"
            },
            { "events": "@nodes:mouseout", "update": "{'datum':{}}" },
            {
              "events": {
                "type": "mousemove",
                "markname": "nodes",
                "between": [
                  { "type": "mousedown" },
                  { "type": "mouseup" }
                ]
              },
              "update": "{'datum':{}}"
            }
            ]
          },
          { "name": "maxNodeSize", "update": "0" },
          { "name": "cx", "update": "width / 2" },
          { "name": "cy", "update": "height / 2" },
          {
            "name": "nodeRadius", "value": 12,
            "bind": { "input": "range", "min": 1, "max": 50, "step": 1 }
          },
          {
            "name": "nodeCharge", "value": 0,
            "bind": { "input": "range", "min": -200, "max": 10, "step": 1 }
          },
          {
            "name": "linkDistance", "value": 500,
            "bind": { "input": "range", "min": 5, "max": 750, "step": 1 }
          },
          {
            "name": "static", "value": true,
            "bind": { "input": "checkbox" }
          },
          {
            "name": "collideRadius", "value": 20,
            "bind": { "input": "range", "min": 3, "max": 100, "step": 1 }
          },
          {
            "description": "State variable for active node fix status.",
            "name": "fix", "value": false,
            "on": [
              {
                "events": "*:mouseout[!event.buttons], window:mouseup",
                "update": "false"
              },
              {
                "events": "*:mouseover",
                "update": "fix || true"
              },
              {
                "events": "[*:mousedown, window:mouseup] > window:mousemove!",
                "update": "2",
                "force": false
              }
            ]
          },
          {
            "description": "Graph node most recently interacted with.",
            "name": "node", "value": null,
            "on": [
              {
                "events": "*:mouseover",
                "update": "fix === true ? item() : node"
              }
            ]
          },
          {
            "description": "Flag to restart Force simulation upon data changes.",
            "name": "restart", "value": false,
            "on": [
              { "events": { "signal": "fix" }, "update": "fix > 1" }
            ]
          }
        ],

        "data": [
          {
            "name": "node-data",
            // "values": sheet.bioModalData,
            "values": this.treeData,
            "format": { "type": "json", "property": "nodes" }
          },
          {
            "name": "link-data",
            // "values": sheet.bioModalData,
            "values": this.treeData,
            "format": { "type": "json", "property": "links" }
          }
        ],

        "scales": [
          {
            "name": "color",
            "type": "ordinal",
            "domain": { "data": "node-data", "field": "group" },
            "range": { "scheme": "category10" }
          },
          {
            "name": "topic",
            "type": "ordinal",
            "range": { "scheme": "category10" },
            "domain": { "data": "node-data", "field": "topicName" }
          },
          {
            "name": "xscale",
            "type": "band",
            "domain": {
              "data": "node-data",
              "field": "group",
              "sort": true
            },
            "range": [{ "signal": "maxNodeSize" }, { "signal": "width-maxNodeSize" }]
          }
        ],

        "marks": [
          {
            "name": "nodes",
            "type": "symbol",
            "zindex": 2,
            "from": { "data": "node-data" },
            "encode": {
              "enter": {
                "xfocus": { "scale": "xscale", "field": "group", "band": 0.5 },
                "yfocus": { "signal": "cy" },
                "fill": { "scale": "color", "field": "group" },
                "stroke": { "value": "white" },
                "x": {"field": "x"},
                "y": {"field": "y"}

              },
              "update": {
                "size": { "signal": "2 * nodeRadius * nodeRadius" },
                "cursor": { "value": "pointer" },
              }
            },

            "transform": [
              {
                "type": "force",
                "iterations": 500,
                // "restart": { "signal": "restart" },
                "static": { "signal": "static" },
                "signal": "force",
                "forces": [
                  // { "force": "center" },
                  // { "force": "collide", "radius": { "signal": "nodeRadius" } },
                  // { "force": "nbody", "strength": { "signal": "nodeCharge" } },
                  { "force": "link", "links": "link-data", "distance": { "signal": "linkDistance" } },
                  // { "force": "x"},
                  // { "force": "y"}
                ]
              }
            ]
          },
          {
            "type": "path",
            "from": { "data": "link-data" },
            "interactive": true,
            "encode": {
              "update": {
                "stroke": { "value": "#ccc" },
                "strokeWidth": { "value": 2.5 }
              }
            },
            "transform": [
              {
                "type": "linkpath",
                "require": { "signal": "force" },
                "shape": "line",
                "sourceX": "datum.source.x", "sourceY": "datum.source.y",
                "targetX": "datum.target.x", "targetY": "datum.target.y"
              }
            ]
          },
          {
            "name": "firstName",
            "type": "text",
            "dx": 5,
            "zindex": 5,
            "from": { "data": "nodes" },
            "encode": {
              "update": {
                "x": { "field": "x" },
                "y": { "field": "y" },
                "dx": { value: -10 },
                "align": { "value": "right" },
                "baseline": { "value": "middle" },
                "text": { "field": "datum.first" },
                "fontSize": { "field": "datum.fontSize" },
                "opacity": { "value": 1 }
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
                "dx": { value: 10 },
                "align": { "value": "left" },
                "baseline": { "value": "middle" },
                "text": { "field": "datum.last" },
                "fontSize": { "field": "datum.fontSize" },
                "opacity": { "value": 1 }
              }
            }
          },
        ]
      }

      embed('#vis', config)
    }, 1000)
  }

  ngOnInit(): void {

  }

}
