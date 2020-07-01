import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { SheetService } from '../services/sheet.service';
import embed from 'vega-embed';
import { ReportService } from '../report/report.service';
import { TreeService } from './tree.service';
import { BimodalService } from '../bimodal/bimodal.service';

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

  @Input() public refreshData = false;
  @Input() public shouldReloadData = false;
  @Output() returnRefresh = new EventEmitter();
  @ViewChild('bimodal') biomodal;
  

  bimodalSortOptions = [
    'Alphabetically',
    'Degree'
  ]

  bimodalSizeOptions = [
    'Static',
    'Degree'
  ]

  bimodalConfig = {
    BM: {
      sort: this.bimodalSortOptions[0],
      size: this.bimodalSizeOptions[0]
    },
    CT: {
      sort: this.bimodalSortOptions[0],
      size: this.bimodalSizeOptions[0]
    }
  }

  constructor(public sheet: SheetService, public report: ReportService, public ts: TreeService, public bms: BimodalService) {
    
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.shouldReloadData = false;
  }

  getBimodalSelecion() {
    this.biomodal.getSelection(this.bimodalConfig)
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
      this.bms.sheetData = this.sheetData // this is needed to update the bimodal network
      this.treeData = await this.ts.makeTreeData(this.sheetData);

      const height = document.getElementsByTagName('body')[0].clientHeight;

      this.graphWidth = this.sheet.sheet.config.width
      this.bimodalDistance = this.sheet.sheet.config.bimodal_distance * 2.5

      const config: any = {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        description: 'An example of Cartesian layouts for a node-link diagram of hierarchical data.',
        width: this.sheet.sheet.config.width,
        height: height + 300,
        padding: 5,
        autosize: "pad",
        signals: [
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
                size: [{ signal: 'height + 200' }, { signal: `width ` }],
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
          }
        ],

        scales: [
          {
            name: 'color',
            type: 'linear',
            range: { scheme: 'viridis' },
            domain: { data: 'tree', field: 'depth' },
            zero: true
          }
        ],

        marks: [
          {
            type: 'path',
            from: { data: 'links' },
            encode: {
              update: {
                path: { field: 'path' },
                stroke: { value: '#ccc' }
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
                  { field: 'uberon_id', type: 'quantitative' }
                ],
                fill: { field: 'color' }
                // fill: { scale: 'color', field: 'depth' }
              }
            }
          },
          {
            type: 'text',
            from: { data: 'tree' },
            encode: {
              enter: {
                text: { field: 'name' },
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
      };

      let embedding = embed("#vis", config, { actions: false })

      try {
        const treeData = await embedding
        this.bms.updatedTreeData = treeData.spec.data[0].values; // this is needed to update the bimodal network
        const asctData = await this.bms.makeASCTData(this.sheetData, this.bms.updatedTreeData, this.bimodalConfig)
        if (asctData) {
          this.shouldRenderASCTBiomodal = true;
          if (this.shouldRenderASCTBiomodal)
            this.biomodal.makeGraph(asctData);

          this.report.reportLog(`Tree succesfully rendered`, 'success', 'msg')
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
        console.log(err)
      }
    } catch (err) {
      this.returnRefresh.emit({
        comp: 'Tree',
        val: false
      });
      this.report.reportLog(`Tree failed to render`, 'error', 'msg')
    }
  }
}
