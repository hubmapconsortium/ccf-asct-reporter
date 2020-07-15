import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { SheetService } from '../services/sheet.service';
import embed from 'vega-embed';
import * as vega from 'vega';
import vegaTooltip from 'vega-tooltip';

import { ReportService } from '../report/report.service';
import { TreeService } from './tree.service';
import { BimodalService, ASCTD } from '../services/bimodal.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit, OnChanges, OnDestroy {
  sheetData: any;
  treeData: any;
  updatedTreeData: any;
  treeView;
  graphWidth: number;
  bimodalDistance: number;
  shouldRenderASCTBiomodal = false;
  prevData: ASCTD = {
    nodes: [],
    links: []
  };
  treeWidth = 0;
  treeWidthOffset = 0;

  @Input() settingsExpanded: boolean;
  @Input() public refreshData = false;
  @Input() public shouldReloadData = false;
  @Output() returnRefresh = new EventEmitter();
  @ViewChild('bimodal') biomodal;

  bimodalSortOptions = [
    'Alphabetically',
    'Degree'
  ];

  bimodalSizeOptions = [
    'None',
    'Degree'
  ];

  bimodalCTSizeOptions = [
    'None',
    'Degree',
    'Indegree',
    'Outdegree'
  ];

  bimodalConfig = {
    BM: {
      sort: this.bimodalSortOptions[0],
      size: this.bimodalSizeOptions[0]
    },
    CT: {
      sort: this.bimodalSortOptions[0],
      size: this.bimodalCTSizeOptions[0]
    }
  };

  constructor(public sheet: SheetService, public report: ReportService, public ts: TreeService, public bms: BimodalService) {

  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.shouldReloadData = false;
  }

  getBimodalSelecion() {
    this.makeBimodalGraph();
  }

  ngOnChanges() {
    if (this.refreshData) {
      this.getData();
    }

    if (this.shouldReloadData && !this.refreshData) {
      this.getData();
    }

  }

  async getData() {
    try {
      this.sheetData = await this.sheet.getSheetData();
      this.treeData = await this.ts.makeTreeData(this.sheetData.data);
    
      const height = document.getElementsByTagName('body')[0].clientHeight;

      this.bimodalDistance = this.sheet.sheet.config.bimodal_distance;
      this.treeWidthOffset = this.sheet.sheet.config.width_offset;

      const config: any = {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        autosize: 'pad',
        padding: {
          right: 20,
          top: 20,
          bottom: 20
        },
        signals: [
          {
            name: 'node__hover', value: null,
            on: [
              { events: '@bimodal-symbol:mouseover', update: 'datum.id' },
              { events: 'mouseover[!event.item]', update: 'null' }
            ]
          },
          {
            name: 'node_targets__hover',
            value: [],
            on: [
              { events: '@bimodal-symbol:mouseover', update: 'datum.targets' },
              { events: 'mouseover[!event.item]', update: '[]' }
            ]
          },
          {
            name: 'node__click', value: null,
            on: [
              { events: '@bimodal-symbol:click', update: 'datum.id' },
              { events: 'click[!event.item]', update: 'null' }
            ]
          },
          {
            name: 'targets__click', value: [],
            on: [
              { events: '@bimodal-symbol:click', update: 'datum.targets' },
              { events: 'click[!event.item]', update: '[]' }
            ]
          },
          {
            name: 'sources__click',
            value: [],
            on: [
              { events: '@bimodal-symbol:click', update: 'datum.sources' },
              { events: 'click[!event.item]', update: '[]' }
            ]
          }
        ],
        data: [
          {
            name: 'tree',
            values: this.treeData,
            transform: [
              {
                type: 'stratify',
                key: 'id',
                parentKey: 'parent'
              },
              {
                type: 'tree',
                method: 'cluster',
                size: [{ signal: height + this.sheet.sheet.config.height_offset }, { signal: this.sheet.sheet.config.width }],
                separation: { value: false },
                as: ['y', 'x', 'depth', 'children']
              }
            ]
          },
          {
            name: 'links',
            source: 'tree',
            transform: [
              { type: 'treelinks' },
              {
                type: 'linkpath',
                orient: 'horizontal',
                shape: 'diagonal'
              }
            ]
          },
          {
            name: 'nodes',
            values: [],
          },
          {
            name: 'edges',
            values: [],
            transform: [
              {
                type: 'lookup',
                from: 'nodes',
                key: 'id',
                fields: ['s', 't'],
                as: ['source', 'target']
              },
              {
                type: 'linkpath',
                sourceX: 'source.x',
                sourceY: 'source.y',
                targetX: 'target.x',
                targetY: 'target.y',
                orient: 'horizontal',
                shape: 'diagonal'
              }
            ]
          },
          {
            name: 'targets_hovered_array',
            source: 'nodes',
            transform: [
              { type: 'filter', expr: 'indexof(node_targets__hover, datum.id) !== -1' }
            ]
          },
          {
            name: 'targets_clicked_array',
            source: 'nodes',
            transform: [
              {
                type: 'filter',
                expr: 'indexof(targets__click, datum.id) !== -1'
              }
            ]
          },
          {
            name: 'sources_clicked_array',
            source: 'nodes',
            transform: [
              {
                type: 'filter',
                expr: 'indexof(sources__click, datum.id) !== -1'
              }
            ]
          },
          {
            name: 'targets_clicked_array__bold',
            source: 'nodes',
            transform: [
              {
                type: 'filter',
                expr: 'indexof(targets__click, datum.id) !== -1'
              },
              {
                type: 'flatten',
                fields: ['targets']
              }
            ]
          }
        ],
        "scales": [
          {
            "name": "bimodal",
            "type": "ordinal",
            "domain": {"data": "nodes", "field": "groupName"},
            "range": ["#E41A1C", "#377EB8", "#4DAF4A"]
          },
          {
            "name": "treeLegend",
            "type": "ordinal",
            "domain": {"data": "tree", "field": "groupName"},
            "range": ["#E41A1C"]
          }
        ],
        "legends": [
          {
            "type": "symbol",
            "orient": "left",
            "fill": "bimodal",
            "title": 'Legend',
            "titlePadding": 20,
            "titleFontSize": 16,
            labelFontSize: 14,
            labelOffset: 10,
            symbolSize: 200,
            rowPadding: 10,
          },
          {
            "type": "symbol",
            "orient": "left",
            "fill": "treeLegend",
            labelFontSize: 14,
            labelOffset: 10,
            symbolSize: 200,
            rowPadding: 10,
            "encode": {
              symbols: {
                update: {
                  stroke: {value: "black"},
                  strokeWidth: {value: 2}
                }
              }
            }
          }
          
        ],
        
        marks: [
          {
            type: 'group',
            marks: [
              {
                type: 'path',
                from: { data: 'links' },
                encode: {
                  update: {
                    path: { field: 'path' },
                    stroke: { value: '#ccc' },
                    opacity: { value: 0.4 },
                    strokeWidth: { value: 1.5 }
                  }
                }
              },
              {
                type: 'symbol',
                from: { data: 'tree' },
                encode: {
                  enter: {
                    size: { value: 300 },
                    stroke: { signal: 'datum.problem ? "#000": "#fff"' },
                    strokeWidth: { signal: 'datum.problem ? 3: 0' }
                  },
                  update: {
                    x: { field: 'x' },
                    y: { field: 'y' },
                    tooltip: [
                      { field: 'uberonId', type: 'quantitative' }
                    ],
                    opacity: { signal: 'datum.children ? 1 : 0' },
                    fill: { field: 'color' }
                  }
                }
              },
              {
                type: 'text',
                from: { data: 'tree' },
                encode: {
                  enter: {
                    text: { field: 'name' },
                    limit: { value: 180 },
                    fontSize: { value: 14 },
                    baseline: { value: 'middle' },
                    fontWeight: { value: 400 }
                  },
                  update: {
                    x: { field: 'x' },
                    y: { field: 'y' },
                    dx: { signal: 'datum.children ? 15: -15' },
                    opacity: { signal: 'datum.children ? 1 : 0' },
                    align: { signal: 'datum.children ? \'left\' : \'right\'' },
                  }
                }
              }
            ]
          },
          {
            type: 'group',
            marks: [
              {
                type: 'path',
                from: { data: 'edges' },
                encode: {
                  enter: {
                    stroke: { value: '#ccc' },
                    strokeWidth: { value: 1.5 },
                    x: { value: 0 },
                    y: { value: 5 }
                  },
                  update: {
                    path: { field: 'path' },
                    stroke: [
                      { test: 'datum.source.id === node__hover && datum.source.group == 1', value: '#E41A1C' }, // for hover
                      { test: 'datum.source.id === node__hover && datum.source.group == 2', value: '#377EB8' }, // for hover
                      { test: 'datum.target.id === node__hover && datum.target.group == 2', value: '#E41A1C' }, // for hover
                      { test: 'datum.target.id === node__hover', value: '#4DAF4A' }, // for hover
                      { test: 'datum.source.id === node__click && datum.source.group == 1', value: '#E41A1C' }, // for click
                      { test: 'datum.source.id === node__click && datum.source.group == 2', value: '#377EB8' }, // for click
                      { test: 'datum.target.id === node__click && datum.target.group == 2', value: '#E41A1C' }, // for click
                      { test: 'datum.target.id === node__click', value: '#4DAF4A' }, // for click
                      {
                        test: 'indata(\'targets_hovered_array\', \'id\', datum.source.id)', // for highlighting children
                        value: '#377EB8'
                      },
                      {
                        test: 'indata(\'targets_clicked_array\', \'id\', datum.source.id)',
                        value: '#377EB8'
                      },
                      { value: '#ccc' }
                    ],
                    opacity: [
                      { test: 'datum.target.id === node__click', value: 0.65 },
                      { test: 'datum.source.id === node__click', value: 0.65 },
                      {
                        test: 'indata(\'targets_clicked_array\', \'id\', datum.source.id)',
                        value: 0.65
                      },
                      { value: 0.4 }
                    ],
                    zindex: [
                      { test: 'datum.source.id === node__hover', value: 2 },
                      { test: 'datum.target.id === node__hover', value: 2 },
                      { test: 'datum.source.id === node__click', value: 2 },
                      { test: 'datum.target.id === node__click', value: 2 },
                      {
                        test: 'indata(\'targets_clicked_array\', \'id\', datum.source.id)',
                        value: 2
                      },
                    ]
                  }
                }
              },
              {
                type: 'symbol',
                name: 'bimodal-symbol',
                from: { data: 'nodes' },
                encode: {
                  enter: {
                    size: { field: 'nodeSize' },
                    fill: { field: 'color' },
                    x: { field: 'x' },
                    y: { field: 'y', offset: 5 },
                    cursor: { value: 'pointer' },
                    tooltip: { signal: '{\'Name\': datum.name, \'Degree\': length(datum.sources) + length(datum.targets)}' }
                  },
                  update: {
                  }
                }
              },
              {
                type: 'text',
                zindex: 5,
                dx: 5,
                from: { data: 'nodes' },
                encode: {
                  update: {
                    x: { field: 'x' },
                    y: { field: 'y', offset: 5 },
                    dx: { value: 20 },
                    align: { value: 'left' },
                    baseline: { value: 'middle' },
                    text: { field: 'name' },
                    fontSize: { field: 'fontSize' },
                    fontWeight: [
                      {
                        test: 'indata(\'targets_clicked_array\', \'id\', datum.id)',
                        value: 'bold'
                      },
                      {
                        test: 'datum.id === node__click', value: 'bold'
                      },
                      {
                        test: 'indata(\'sources_clicked_array\', \'id\', datum.id)',
                        value: 'bold'
                      },
                      {
                        test: 'indata(\'targets_clicked_array__bold\', \'targets\', datum.id)',
                        value: 'bold'
                      }
                    ],
                    opacity: { value: 1 },
                    limit: { value: 180 }
                  }
                }
              },
            ]
          }
        ],
        
      };

      const runtime: vega.Runtime = vega.parse(config, {});
      this.treeView = new vega.View(runtime)
        .renderer('svg')
        .initialize('#vis')
        .hover();

      vegaTooltip(this.treeView);
      this.treeView.runAsync();

      try {
        this.updatedTreeData = this.treeView.data('tree');
        this.treeWidth = this.treeView._viewWidth;

        let isBimodalComplete = await this.makeBimodalGraph();
        if (isBimodalComplete) {
          this.shouldRenderASCTBiomodal = true;
          this.report.reportLog(`${this.sheet.sheet.display} tree succesfully rendered`, 'success', 'msg');

          this.returnRefresh.emit({
            msg: this.sheetData.msg,
            status: this.sheetData.status,
            comp: 'Tree',
            val: true
          });

        } else {
          this.returnRefresh.emit({
            comp: 'Tree',
            msg: this.sheetData.msg,
            status: this.sheetData.status,
            val: false
          });
        }
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      this.returnRefresh.emit({
        comp: 'Tree',
        msg: this.sheetData.msg,
        status: this.sheetData.status,
        val: false
      });
      this.report.reportLog(`Tree failed to render`, 'error', 'msg');
    }
  }

  public async makeBimodalGraph() {
    const asctData: ASCTD = await this.bms.makeASCTData(this.sheetData.data, this.updatedTreeData, this.bimodalConfig);
    this.treeView._runtime.signals.node__click.value = null; // removing clicked highlighted nodes if at all
    this.treeView._runtime.signals.sources__click.value = []; // removing clicked bold source nodes if at all
    this.treeView._runtime.signals.targets__click.value = []; // removing clicked bold target nodes if at all

    this.treeView.change('nodes', vega.changeset().remove(this.prevData.nodes).insert(asctData.nodes)).runAsync();
    this.treeView.change('edges', vega.changeset().remove(this.prevData.links).insert(asctData.links)).runAsync();

    const didViewRender = await this.treeView.resize().runAsync();
    await this.treeView.runAsync();
    if (didViewRender) {
      this.prevData = asctData;
      this.graphWidth = didViewRender._viewWidth;
      this.treeWidth = this.treeView._viewWidth;
      return true;
    }
    return false;
  }

  downloadVis() {
    this.treeView.background('white');
    this.treeView.toImageURL('png').then((url) => {
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('target', '_blank');
      link.setAttribute('download', 'asct+b vis.png');
      link.dispatchEvent(new MouseEvent('click'));
    }).catch((error) => {
      console.log(error);
    });
  }
}
