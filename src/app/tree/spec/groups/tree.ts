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
      name: 'asTree',
      marks: [
        this.makeTreePathMarks(),
        this.makeTreeSymbolMarks(),
        this.makeTreeTextMarks()
      ],
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
          tooltip: { signal: '{"Ontology Link": datum.uberonId}' },
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

  makeTreeTextMarks() {
    return {
      type: 'text',
      from: { data: 'tree' },
      encode: {
        enter: {
          text: { field: 'name' },
          limit: { value: 180 },
          fontSize: { value: 14 },
          baseline: { value: 'middle' },
          fontWeight: { value: 400 },
        },
        update: {
          x: { field: 'x' },
          y: { field: 'y' },
          dx: { signal: 'datum.children ? 15: -15' },
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
