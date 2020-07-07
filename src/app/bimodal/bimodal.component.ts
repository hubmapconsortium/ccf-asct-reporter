import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import embed, { vega } from 'vega-embed';
import { SheetService } from '../services/sheet.service';
import { BimodalService } from './bimodal.service';

@Component({
  selector: 'app-bimodal',
  templateUrl: './bimodal.component.html',
  styleUrls: ['./bimodal.component.css']
})
export class BimodalComponent implements OnInit, OnChanges {

  @Output() graphCompleted = new EventEmitter();
  @Input() bimodalSelection;
  @Input() bimodalSizeSelection;
  selectedOption;
  selectedSizeOption;

  hasGraphRendered = false;
  constructor(public sheet: SheetService, public bms: BimodalService) {
  }

  ngOnInit(): void {

  }

  ngOnChanges() {
    this.selectedOption = this.bimodalSelection;

  }

  async makeGraph(data) {
    const config: any = {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      signals: [
        {
          name: 'active', value: null,
          on: [
            { events: 'symbol:mouseover', update: 'datum.id' },
            { events: 'mouseover[!event.item]', update: 'null' }
          ]
        },
        {
          name: 'click_active', value: null,
          on: [
            { events: 'symbol:click', update: 'datum.id' },
            { events: 'click[!event.item]', update: 'null' }
          ]
        }
      ],
      data: [
        {
          name: 'nodes',
          values: data,
          format: { type: 'json', property: 'nodes' },
        },
        {
          name: 'edges',
          values: data,
          format: { type: 'json', property: 'links' },
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
      ],
      marks: [
        {
          type: 'path',
          from: { data: 'edges' },
          encode: {
            enter: {
              stroke: { value: '#ccc' },
              strokeWidth: { value: 1.5},
              x: { value: 0 },
              y: { value: 5 }
            },
            update: {
              path: { field: 'path' },
              stroke: [
                {test: 'datum.source.id === active && datum.source.group == 1', value: '#E41A1C'}, // for hover
                {test: 'datum.source.id === active && datum.source.group == 2', value: '#377EB8'}, // for hover
                {test: 'datum.target.id === active && datum.target.group == 2', value: '#E41A1C'}, // for hover
                {test: 'datum.target.id === active', value: '#4DAF4A'}, // for hover
                {test: 'datum.source.id === click_active && datum.source.group == 1', value: '#E41A1C'}, // for click
                {test: 'datum.source.id === click_active && datum.source.group == 2', value: '#377EB8'}, // for click
                {test: 'datum.target.id === click_active && datum.target.group == 2', value: '#E41A1C'}, // for click
                {test: 'datum.target.id === click_active', value: '#4DAF4A'}, // for click
                {value: '#ccc'}
              ],
              opacity: [
                {test: 'datum.target.id === click_active', value: 1},
                {test: 'datum.source.id === click_active', value: 1},
                {value: 0.5}
              ],
              zindex: [
                {test: 'datum.source.id === active', value: 2},
                {test: 'datum.target.id === active', value: 2},
                {test: 'datum.source.id === click_active', value: 2},
                {test: 'datum.target.id === click_active', value: 2}
              ]
            }
          }
        },
        {
          type: 'symbol',
          from: { data: 'nodes' },
          encode: {
            enter: {
              size: { field: 'nodeSize' },
              fill: { field: 'color' },
              x: { field: 'x' },
              y: { field: 'y', offset: 5 },
              cursor: {value: 'pointer'}
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
              opacity: { value: 1 }
            }
          }
        },
      ]
    };

    const embedded = embed('#ASCTVis', config, { actions: false });
    embedded.then(data => {
      if (data) {
        this.graphCompleted.emit({
          val: true
        });
        this.hasGraphRendered = true;
      }
    });
  }

  getSelection(config) {
    this.bms.makeASCTData(this.bms.sheetData, this.bms.updatedTreeData, config).then(data => {
      if (data) {
        this.makeGraph(data);
      }
    });

  }

}
