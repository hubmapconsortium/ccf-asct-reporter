import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { SheetService } from '../services/sheet.service';
import embed from 'vega-embed';
import * as vega from 'vega';
import { ReportService } from '../report/report.service';
import { TreeService } from './tree.service';
import { BimodalService } from '../bimodal/bimodal.service';
import { group } from '@angular/animations';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit, OnChanges, OnDestroy {
  sheetData;
  treeData;
  updatedTreeData;
  graphWidth;
  bimodalDistance;
  shouldRenderASCTBiomodal = false;
  prevData = {};
  treeWidth = 0;

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
    this.makeBimodalGraph()
    // this.biomodal.getSelection(this.bimodalConfig);
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
      // this.bms.sheetData = this.sheetData; // this is needed to update the bimodal network
      this.treeData = await this.ts.makeTreeData(this.sheetData);

      const height = document.getElementsByTagName('body')[0].clientHeight;
      const width = document.getElementsByTagName('body')[0].clientWidth;

      this.bimodalDistance = this.sheet.sheet.config.bimodal_distance;

      const config: any = {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        description: 'An example of Cartesian layouts for a node-link diagram of hierarchical data.',
        autosize: "pad",
        signals: [
          {
            name: 'hover', value: null,
            on: [
              { events: '@bimodal-symbol:mouseover', update: 'datum.id' },
              { events: 'mouseover[!event.item]', update: 'null' }
            ]
          },
          {
            name: 'targets_hover',
            value: [],
            on: [
              { events: '@bimodal-symbol:mouseover', update: 'datum.targets' },
              { events: 'mouseover[!event.item]', update: '[]' }
            ]
          },
          {
            name: 'click_active', value: null,
            on: [
              { events: '@bimodal-symbol:click', update: 'datum.id' },
              { events: 'click[!event.item]', update: 'null' }
            ]
          },
          {
            name: 'targets_click_active', value: [],
            on: [
              { events: '@bimodal-symbol:click', update: 'datum.targets' },
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
                size: [{ signal: height + 200 }, { signal: this.sheet.sheet.config.width }],
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
            // format: { type: 'json', property: 'nodes' },
          },
          {
            name: 'edges',
            values: [],
            // format: { type: 'json', property: 'links' },
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
            name: 'targets_selected',
            source: 'nodes',
            transform: [
              {
                type: 'filter',
                expr: 'indexof(targets_hover, datum.id) !== -1'
              }
            ]
          },
          {
            name: 'click_targets_selected',
            source: 'nodes',
            transform: [
              {
                type: 'filter',
                expr: 'indexof(targets_click_active, datum.id) !== -1'
              }
            ]
          }
        ],
        marks: [
          {
            type: "group",
            marks: [
              {
                type: 'path',
                from: { data: 'links' },
                encode: {
                  update: {
                    path: { field: 'path' },
                    stroke: { value: '#ccc' },
                    opacity: { value: 0.5 },
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
                    align: { signal: 'datum.children ? \'left\' : \'right\'' },
                  }
                }
              }
            ]
          },
          {
            type: "group",
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
                      { test: 'datum.source.id === hover && datum.source.group == 1', value: '#E41A1C' }, // for hover
                      { test: 'datum.source.id === hover && datum.source.group == 2', value: '#377EB8' }, // for hover
                      { test: 'datum.target.id === hover && datum.target.group == 2', value: '#E41A1C' }, // for hover
                      { test: 'datum.target.id === hover', value: '#4DAF4A' }, // for hover
                      { test: 'datum.source.id === click_active && datum.source.group == 1', value: '#E41A1C' }, // for click
                      { test: 'datum.source.id === click_active && datum.source.group == 2', value: '#377EB8' }, // for click
                      { test: 'datum.target.id === click_active && datum.target.group == 2', value: '#E41A1C' }, // for click
                      { test: 'datum.target.id === click_active', value: '#4DAF4A' }, // for click
                      {
                        test: 'indata(\'targets_selected\', \'id\', datum.source.id)', // for highlighting children
                        value: '#377EB8'
                      },
                      {
                        test: 'indata(\'click_targets_selected\', \'id\', datum.source.id)',
                        value: '#377EB8'
                      },
                      { value: '#ccc' }
                    ],
                    opacity: [
                      { test: 'datum.target.id === click_active', value: 1 },
                      { test: 'datum.source.id === click_active', value: 1 },
                      {
                        test: 'indata(\'click_targets_selected\', \'id\', datum.source.id)',
                        value: 1
                      },
                      { value: 0.5 }
                    ],
                    zindex: [
                      { test: 'datum.source.id === hover', value: 2 },
                      { test: 'datum.target.id === hover', value: 2 },
                      { test: 'datum.source.id === click_active', value: 2 },
                      { test: 'datum.target.id === click_active', value: 2 },
                      {
                        test: 'indata(\'click_targets_selected\', \'id\', datum.source.id)',
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
                    // size: { signal: 'length(datum.sources) === 0 ? 300 : length(datum.sources) * 75' },
                    size: {field: "nodeSize"},
                    fill: { field: 'color' },
                    x: { field: 'x' },
                    y: { field: 'y', offset: 5 },
                    cursor: { value: 'pointer' },
                    tooltip:{field: 'name'}
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
                    text: { field: 'last' },
                    fontSize: { field: 'fontSize' },
                    fontWeight: { value: 400 },
                    opacity: { value: 1 },
                    limit: { value: 180 }
                  }
                }
              },
            ]
          }

        ]
      };

      const embedding = embed('#vis', config, {actions: false});
      


      try {
        this.updatedTreeData = await embedding;
        this.treeWidth = this.updatedTreeData.view._viewWidth
        
        // this.bms.updatedTreeData = treeData.spec.data[0].values; // this is needed to update the bimodal network
        
        const isBimodalComplete = await this.makeBimodalGraph()
        
        if (isBimodalComplete) {
          this.shouldRenderASCTBiomodal = true
          this.report.reportLog(`Tree succesfully rendered`, 'success', 'msg');
          this.returnRefresh.emit({
            comp: 'Tree',
            val: true
          });
        } else {
          this.returnRefresh.emit({
            comp: 'Tree',
            val: false
          });
        }

      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      this.returnRefresh.emit({
        comp: 'Tree',
        val: false
      });
      this.report.reportLog(`Tree failed to render`, 'error', 'msg');
    }
  }

  public async makeBimodalGraph() {
    const asctData = await this.bms.makeASCTData(this.sheetData, this.updatedTreeData.spec.data[0].values, this.bimodalConfig);
    this.updatedTreeData.view._runtime.signals.click_active.value = null; // removing clicked highlighted nodes if at all

    await this.updatedTreeData.view.change('nodes', vega.changeset().remove(this.prevData['nodes']).insert(asctData['nodes'])).runAsync()
    await this.updatedTreeData.view.change('edges', vega.changeset().remove(this.prevData['links']).insert(asctData['links'])).runAsync()

    const didViewRender = await this.updatedTreeData.view.resize().runAsync()
    await this.updatedTreeData.view.runAsync()
    if (didViewRender) {
      this.prevData = asctData
      this.graphWidth = this.updatedTreeData.view._viewWidth
      return true
    }
    return false
  }
}
