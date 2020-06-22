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
        name: 'A', group: 1, first: 'ONE', x: 5.744, y: 1.0915, fontSize: 14
      },
      {
        name: 'B', group: 2, last: 'TWO', x: 0.844, y: 0.0915, fontSize: 14
      },
      {
        name: 'AA', group: 1, first: 'ONE AA', x: 0.744, y: 0.0915, fontSize: 14
      },
      {
        name: 'BB', group: 2, last: 'TWO BB', x: 0.744, y: 0.0915, fontSize: 14
      },
      {
        name: 'CC', group: 2, last: 'TWO CC', x: 0.744, y: 0.0915, fontSize: 14
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

        
      }

      embed('#vis', config)
    }, 2000)
  }

  ngOnInit(): void {

    //   let config: any = {
    //     "$schema": "https://vega.github.io/schema/vega/v3.0.json",
    //     "width": 800,
    //     "height": 600,
    //     "padding": 0,
    //     "autosize": "none",

    //     "signals": [{
    //             "name": "tooltip",
    //             "value": { "datum": {} },
    //             "on": [{
    //                     "events": {
    //                         "type": "mouseover",
    //                         "markname": "nodes"
    //                     },
    //                     "update": "{'datum':datum,'x':x(datum),'y':y(datum)}"
    //                 },
    //                 { "events": "@nodes:mouseout", "update": "{'datum':{}}" },
    //                 {
    //                     "events": {
    //                         "type": "mousemove",
    //                         "markname": "nodes",
    //                         "between": [
    //                             { "type": "mousedown" },
    //                             { "type": "mouseup" }
    //                         ]
    //                     },
    //                     "update": "{'datum':{}}"
    //                 }
    //             ]
    //         },
    //         {
    //             "name": "legendHover",
    //             "value": { "datum": {} },
    //             "on": [{
    //                 "events": {
    //                     "type": "mouseover",
    //                     "markname": "legendLabel"
    //                 },
    //                 "update": "{'datum':datum,'x':x(datum),'y':y(datum)}"
    //             }, {
    //                 "events": {
    //                     "type": "mouseout",
    //                     "markname": "legendLabel"
    //                 },
    //                 "update": "{'datum':{}}"
    //             }]
    //         },
    //         { "name": "maxNodeSize", "update": "0" },
    //         { "name": "cx", "update": "width / 2" },
    //         { "name": "cy", "update": "height / 2" },
    //         {
    //             "name": "nodeRadius",
    //             "value": 8,
    //             "bind": { "input": "range", "min": 1, "max": 50, "step": 1 }
    //         },
    //         {
    //             "name": "nodeCharge",
    //             "value": -30,
    //             "bind": { "input": "range", "min": -100, "max": 10, "step": 1 }
    //         },
    //         {
    //             "name": "linkDistance",
    //             "value": 30,
    //             "bind": { "input": "range", "min": 5, "max": 200, "step": 1 }
    //         },
    //         {
    //             "name": "static",
    //             "value": true,
    //             "bind": { "input": "checkbox" }
    //         },
    //         {
    //             "description": "State variable for active node fix status.",
    //             "name": "fix",
    //             "value": 0,
    //             "on": [{
    //                     "events": "*:mouseout[!event.buttons], window:mouseup",
    //                     "update": "0"
    //                 },
    //                 {
    //                     "events": "*:mouseover",
    //                     "update": "fix || 1"
    //                 },
    //                 {
    //                     "events": "[*:mousedown, window:mouseup] > window:mousemove!",
    //                     "update": "2",
    //                     "force": true
    //                 }
    //             ]
    //         },
    //         {
    //             "description": "Graph node most recently interacted with.",
    //             "name": "node",
    //             "value": null,
    //             "on": [{
    //                 "events": "*:mouseover",
    //                 "update": "fix === 1 ? item() : node"
    //             }]
    //         },
    //         {
    //             "description": "Flag to restart Force simulation upon data changes.",
    //             "name": "restart",
    //             "value": false,
    //             "on": [
    //                 { "events": { "signal": "fix" }, "update": "fix > 1" }
    //             ]
    //         }
    //     ],

    //     "data": [{
    //             "name": "node-data",
    //             "values": this.treeData,
    //             "format": { "type": "json", "property": "nodes" }
    //         },
    //         {
    //             "name": "link-data",
    //             "values": this.treeData,
    //             "format": { "type": "json", "property": "links" }
    //         }
    //     ],

    //     "scales": [{
    //             "name": "color",
    //             "type": "ordinal",
    //             "range": { "scheme": "category10" }
    //         },
    //         {
    //             "name": "topic",
    //             "type": "ordinal",
    //             "range": { "scheme": "category10" },
    //             "domain": { "data": "node-data", "field": "topicName" }
    //         },
    //         {
    //             "name": "xscale",
    //             "type": "band",
    //             "domain": {
    //                 "data": "node-data",
    //                 "field": "group",
    //                 "sort": true
    //             },
    //             "range": [{ "signal": "maxNodeSize" }, { "signal": "width-maxNodeSize" }]
    //         }
    //     ],
    //     "legends": [{
    //         "title": "Last week topics",
    //         "zindex": 0,
    //         "padding": { "value": 10 },
    //         "orient": "top-left",
    //         "fill": "topic",
    //         "encode": {
    //             "title": {
    //                 "update": {
    //                     "fontSize": { "value": 14 },
    //                     "orient": { "value": "vertical" }
    //                 }
    //             },
    //             "labels": {
    //                 "name": "legendLabel",
    //                 "update": {
    //                     "fontSize": { "value": 12 },
    //                     "fill": { "value": "black" }
    //                 },
    //                 "hover": {
    //                     "opacity": { "value": 1 },
    //                     "fill": { "value": "black" }
    //                 },
    //                 "interactive": true
    //             },
    //             "symbols": {
    //                 "name": "legendSymbol",
    //                 "update": {
    //                     "stroke": { "value": "transparent" },
    //                     "size": { "value": 50 },
    //                     "opacity": { "value": 1 }
    //                 },
    //                 "hover": {
    //                     "opacity": { "value": 1 },
    //                     "fill": { "value": "black" }
    //                 },
    //                 "interactive": true
    //             },
    //             "legend": {
    //                 "update": {
    //                     "fill": { "value": "#eee" },
    //                     "opacity": { "value": 0.9 },
    //                     "stroke": { "value": "#ccc" },
    //                     "strokeWidth": { "value": 1.5 }
    //                 }
    //             }
    //         }
    //     }],

    //     "marks": [{
    //             "name": "nodes",
    //             "type": "symbol",
    //             "zindex": 4,
    //             "from": { "data": "node-data" },
    //             "on": [{
    //                     "trigger": "fix",
    //                     "modify": "node",
    //                     "values": "fix === 1 ? {fx:node.x, fy:node.y} : {fx:x(), fy:y()}"
    //                 },
    //                 {
    //                     "trigger": "!fix",
    //                     "modify": "node",
    //                     "values": "{fx: null, fy: null}"
    //                 }
    //             ],

    //             "encode": {
    //                 "enter": {
    //                     "xfocus": { "scale": "xscale", "field": "group", "band": 0.5 },
    //                     "yfocus": { "signal": "cy" },
    //                     "fill": { "scale": "color", "field": "group" },
    //                     "stroke": { "value": "white" }
    //                 },
    //                 "update": {
    //                     "size": { "field": "size" },
    //                     "cursor": { "value": "pointer" },
    //                     "opacity": { "value": 0 }
    //                 }
    //             },

    //             "transform": [{
    //                 "type": "force",
    //                 "iterations": 300,
    //                 "restart": { "signal": "restart" },
    //                 "static": { "signal": "static" },
    //                 "forces": [
    //                     { "force": "center", "x": { "signal": "cx" }, "y": { "signal": "cy" } },
    //                     { "force": "collide", "radius": { "signal": "nodeRadius" } },
    //                     { "force": "nbody", "strength": { "signal": "nodeCharge" }, "distanceMax": 80 },
    //                     { "force": "link", "links": "link-data", "distance": { "signal": "linkDistance" } },
    //                     { "force": "x", "x": "xfocus", "strength": 0.1 },
    //                     { "force": "y", "y": "yfocus", "strength": 0.005 }
    //                 ]
    //             }]
    //         },
    //         {
    //             "type": "path",
    //             "from": { "data": "link-data" },
    //             "zindex": 0,
    //             "interactive": false,
    //             "encode": {
    //                 "update": {
    //                     "stroke": { "value": "#ccc" },
    //                     "strokeWidth": { "value": 0.5 }
    //                 }
    //             },
    //             "transform": [{
    //                 "type": "linkpath",
    //                 "shape": "line",
    //                 "sourceX": "datum.source.x",
    //                 "sourceY": "datum.source.y",
    //                 "targetX": "datum.target.x",
    //                 "targetY": "datum.target.y"
    //             }]
    //         },
    //         {
    //             "name": "visibleNodes",
    //             "type": "symbol",
    //             "zindex": 1,
    //             "from": { "data": "nodes" },
    //             "encode": {
    //                 "update": {
    //                     "x": { "field": "x" },
    //                     "y": { "field": "y" },
    //                     "size": { "field": "size" },
    //                     "fill": { "scale": "color", "field": "datum.group" },
    //                     "stroke": { "value": "white" },
    //                     "opacity": [
    //                         { "test": "legendHover.datum.index===datum.datum.group", "value": 1 },
    //                         { "value": 0.3 }
    //                     ]
    //                 }
    //             }
    //         },
    //         {
    //             "name": "lastName",
    //             "type": "text",
    //             "zindex": 2,
    //             "from": { "data": "nodes" },

    //             "encode": {
    //                 "update": {
    //                     "x": { "field": "x" },
    //                     "y": { "field": "y" },
    //                     "dy": { "field": "datum.fontSize" },
    //                     "align": { "value": "center" },
    //                     "baseline": { "value": "bottom" },
    //                     "text": { "field": "datum.last" },
    //                     "fontSize": { "field": "datum.fontSize" },
    //                     "opacity": { "value": 1 }
    //                 }
    //             }
    //         },
    //         {
    //             "name": "firstName",
    //             "type": "text",
    //             "zindex": 2,
    //             "from": { "data": "nodes" },
    //             "encode": {
    //                 "update": {
    //                     "x": { "field": "x" },
    //                     "y": { "field": "y" },
    //                     "align": { "value": "center" },
    //                     "baseline": { "value": "bottom" },
    //                     "text": { "field": "datum.first" },
    //                     "fontSize": { "field": "datum.fontSize" },
    //                     "opacity": { "value": 1 }
    //                 }
    //             }
    //         },
    //         {
    //             "type": "image",
    //             "zindex": 3,
    //             "from": { "data": "nodes" },
    //             "encode": {
    //                 "update": {
    //                     "x": { "signal": "tooltip.x" },
    //                     "y": { "signal": "tooltip.y" },
    //                     "baseline": { "value": "middle" },
    //                     "align": { "value": "center" },
    //                     "url": { "signal": "tooltip.datum.thumb" },
    //                     "fontSize": { "value": 25 },
    //                     "opacity": [
    //                         { "test": "tooltip.datum.name", "value": 1 },
    //                         { "value": 0 }
    //                     ]

    //                 }
    //             }
    //         }
    //     ]
    // }


  }

}
