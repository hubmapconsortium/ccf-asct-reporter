import { GroupMark } from 'vega';

export interface VegaTreeMarkGroup {
  group: GroupMark;
}

export class TreeMarkGroup implements VegaTreeMarkGroup {
  group: any;

  constructor() {
    this.group = this.makeTreeMarkGroup();

    return this.group;
  }

  makeTreeMarkGroup() {
    return {
      type: 'group',
      signals: [
        {name: 'bgoffset', value: 6}
      ],
      name: 'asTree',
      marks: [
        this.makeTreePathMarks(),
        this.makeTreeSymbolMarks(),
        this.makeTreeTextMarks(),
        this.makeBimodalTextSearchMarks(),
        this.makeTreeTextLinkMarks()
      ],
    };
  }

  makeBimodalTextSearchMarks() {
    return {
      name: 'rectmark',
      type: 'rect',
      from: {
        data: 'astextmark'
      },
      encode: {
        enter: {
          x: {field: 'bounds.x1', round: true, offset: {signal: '-bgoffset'}},
          x2: {field: 'bounds.x2', round: true, offset: {signal: 'bgoffset'}},
          y: {field: 'bounds.y1', round: true, offset: {signal: '-bgoffset'}},
          y2: {field: 'bounds.y2', round: true, offset: {signal: 'bgoffset'}},
          fill: {value: 'aliceblue'},
          stroke: {value: 'steelblue'}
        },
        update: {
          opacity: [
            {
              test: 'node__click === null && indata(\'search\', \'id\', datum.datum.id)',
              value: 1
            },
            {
             value: '0'
            }
           ]
        }
      }
    };
  }

  makeTreePathMarks() {
    return {
      type: 'path',
      from: { data: 'links' },
      encode: {
        update: {
          path: { field: 'path' },
          stroke: { signal: 'datum.source.pathColor' },
          opacity: [
            {
              test: 'node__click !== null',
              value: 0.1
            },
            {
              test: 'node__hover !== null && datum.source.id !== node__hover && node__click === null',
              value: 0.25
            },
            {
              value: 0.4
            }
          ],
          strokeWidth: { value: 1.5 },
        },
      },
    };
  }

  makeTreeSymbolMarks() {
    return {
      type: 'symbol',
      from: { data: 'tree' },
      encode: {
        enter: {
          size: { value: 300 },
          stroke: { signal: 'datum.problem ? "#000": datum.isNew ? datum.color :"#fff"' },
          strokeWidth: { signal: 'datum.problem ? 3: datum.isNew ? 3 : 0' },
          strokeDash: { signal: 'datum.isNew ? 3 : 0' }
        },
        update: {
          x: { field: 'x' },
          y: { field: 'y' },
          tooltip: { signal: '{"Ontology Link": datum.ontology_id}' },
          opacity: [
            {
              test: 'node__click === null && node__hover === null',
              value: 1
            },
            {
              test: 'node__hover !== null && node__click === null',
              value: 0.5
            },
            {
              test: 'node__click !== null',
              value: 0.1
            },
            {
              value: 0
            }
          ],
          zIndex: { value: 1 },
          fill: { signal: 'datum.isNew ? "#fafafa" : datum.color' },
        },
      },
    };
  }

  makeTreeTextLinkMarks() {
    return {
      type: 'text',
      name: 'aslinktextmark',
      from: { data: 'tree' },
      zindex: 5,
      encode: {
        enter: {
          text: { field: 'ontology_id' },
          limit: { value: 180 },
          fontSize: { value: 11 },
          baseline: { value: 'middle' },
          fontWeight: { value: 600 },
        },
        update: {
          x: { field: 'x' },
          y: { field: 'y' },
          dy: {value: 8},
          dx: { signal: 'datum.children ? 15: -15' },
          fill: [
            {
              value: 'grey'
            }
          ],
          opacity: [
            {
              test: '!datum.children',
              value: 0
            },
            {
              test: 'node__click !== null',
              value: 0.1
            },
            {
              test: 'node__click === null && node__hover === null',
              value: 1
            },
            {
              test: 'node__hover !== null && node__click === null',
              value: 0.5
            },
          ],
          align: { signal: 'datum.children ? \'left\' : \'right\'' },
        },
      },
    };
  }

  makeTreeTextMarks() {
    return {
      type: 'text',
      name: 'astextmark',
      from: { data: 'tree' },
      zindex: 5,
      encode: {
        enter: {
          text: { field: 'name' },
          limit: { value: 180 },
          fontSize: { value: 14 },
          baseline: { value: 'middle' },
          fontWeight: { value: 400 },
          cursor: {signal: 'datum.children ? "pointer" : "null"'}
        },
        update: {
          x: { field: 'x' },
          y: { field: 'y' },
          dy: {value: -8},
          dx: { signal: 'datum.children ? 15: -15' },
          fill: [
            {
              test: 'datum === bimodal_text__hover',
              value: 'steelblue'
            },
            {
              value: 'black'
            }
          ],
          opacity: [
            {
              test: '!datum.children',
              value: 0
            },
            {
              test: 'node__click !== null',
              value: 0.1
            },
            {
              test: 'node__click === null && node__hover === null',
              value: 1
            },
            {
              test: 'node__hover !== null && node__click === null',
              value: 0.5
            },
          ],
          align: { signal: 'datum.children ? \'left\' : \'right\'' },
        },
      },
    };
  }

}
