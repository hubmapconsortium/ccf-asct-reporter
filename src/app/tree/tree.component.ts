import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { SheetService } from '../sheet.service';
import embed from 'vega-embed';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit, OnChanges, OnDestroy {
  sheetData;
  treeData;
  updatedTreeData;
  shouldRenderASCTBiomodal = false;

  @Input() public refreshData = false;
  @Input() public shouldReloadData = false;
  @Output() returnRefresh = new EventEmitter();
  @ViewChild('bimodal') biomodal;

  constructor(public sheet: SheetService) {
    // this.getData();
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.shouldReloadData = false;
  }

  ngOnChanges() {
    if (this.refreshData) {
      this.getData();
    }

    if (this.shouldReloadData && !this.refreshData) {
      this.getData();
    }
  }

  getData() {
    this.sheet.getSheetData().then(data => {
      this.sheetData = data.data;
      this.sheet.sheetData = this.sheetData
      this.treeData = this.sheet.makeTreeData(this.sheetData);

      const height = document.getElementsByTagName('body')[0].clientHeight;
      const width = document.getElementsByTagName('body')[0].clientWidth;

      const config: any = {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        description: 'An example of Cartesian layouts for a node-link diagram of hierarchical data.',
        width: width - this.sheet.sheet.config.width_offset < 1000 ? 1000 : width - this.sheet.sheet.config.width_offset,
        height: height,
        padding: 5,
        "config": {
          "axis": {"labelFont": "Inter", "titleFont": "Inter"},
          "legend": {"labelFont": "Inter", "titleFont": "Inter"},
          "header": {"labelFont": "Inter", "titleFont": "Inter"},
          "mark": {"font": "Inter"},
          "title": {"font": "Inter", "subtitleFont": "Inter"}
        },
        autosize: "fit",
        "title": {
          "text": "Anatomical Structures",
          "anchor": "start",
          fontSize: 16,
          fontWeight: 500
        },
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
                stroke: { value: '#fff' }
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
                fontWeight: {value: 400}
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

      embedding.then((data) => {
        this.sheet.updatedTreeData = data.spec.data[0].values
        this.sheet.makeASCTData(this.sheetData, data.spec.data[0].values).then(data => {
          if (data) {
            this.shouldRenderASCTBiomodal = true;
            if (this.shouldRenderASCTBiomodal)
              this.biomodal.makeGraph();
            this.returnRefresh.emit({
              comp: 'Tree',
              val: true
            });
          }
        })
      })
    }).catch(err => {
      if (err) {
        this.returnRefresh.emit({
          comp: 'Tree',
          val: false
        });
      }

    });
  }


}
