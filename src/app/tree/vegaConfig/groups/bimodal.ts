import { GroupMark } from 'vega';

export interface VegaBimodalGroup {
  group: GroupMark;
}

export class BimodalMarkGroup implements VegaBimodalGroup {
  group: any;

  constructor() {
    this.group = this.makeBimodalMarkGroup();
    return this.group;
  }

  makeBimodalMarkGroup() {
    return {
      type: 'group',
      name: 'bimodal-network',
      marks: [
        this.makeBimodalPathMarks(),
        this.makeBimodalSymbolMarks(),
        this.makeBiomodalTextMarks()
      ]
    }
  }

  makeBimodalPathMarks() {
    return {
      type: 'path',
      from: { data: 'edges' },
      encode: {
        enter: {
          stroke: { value: '#ccc' },
          strokeWidth: { value: 1.5 },
          x: { value: 0 },
          y: { value: 5 },
        },
        update: {
          path: { field: 'path' },
          stroke: [
            // red: E41A1C, green: 4DAF4A, blue: 377EB8
            {
              test:
                'datum.source.id === node__hover && datum.source.group == 1',
              value: '#E41A1C',
            }, // for hover
            {
              test:
                'datum.source.id === node__hover && datum.source.group == 2',
              value: '#377EB8',
            }, // for hover
            {
              test:
                'datum.target.id === node__hover && datum.target.group == 2',
              value: '#E41A1C',
            }, // for hover
            {
              test:
                'datum.target.id === node__hover && datum.target.group == 3',
              value: '#4DAF4A',
            }, // for hover

            {
              test:
                'datum.source.id === node__click && datum.source.group == 1',
              value: '#E41A1C',
            }, // for click
            {
              test:
                'datum.source.id === node__click && datum.source.group == 2',
              value: '#377EB8',
            }, // for click
            {
              test:
                'datum.target.id === node__click && datum.target.group == 2',
              value: '#E41A1C',
            }, // for click
            {
              test:
                'datum.target.id === node__click && datum.target.group == 3',
              value: '#4DAF4A',
            }, // for click
            // for getting AS -> CT -> B
            {
              test:
                'indata(\'targets_hovered_array\', \'id\', datum.source.id)',
              value: '#377EB8',
            },

            {
              test:
                'indata(\'targets_clicked_array\', \'id\', datum.source.id)',
              value: '#377EB8',
            },
            // for getting B -> CT -> AS
            {
              test:
                'indata(\'sources_hovered_array\', \'id\', datum.target.id) && datum.source.group !== 2',
              value: '#377EB8',
            },
            {
              test:
                'indata(\'sources_clicked_array\', \'id\', datum.target.id) && datum.source.group !== 2',
              value: '#377EB8',
            },
            { signal: 'datum.source.pathColor ? datum.source.pathColor : "#ccc"' },
          ],
          opacity: [
            { test: 'datum.target.id === node__click', value: 0.65 },
            { test: 'datum.source.id === node__click', value: 0.65 },
            {
              test: 'indata(\'targets_clicked_array\', \'id\', datum.source.id)',
              value: 0.65,
            },
            {
              test: 'indata(\'sources_clicked_array\', \'id\', datum.target.id) && datum.source.group !== 2',
              value: 0.65,
            },
            {
              test: 'indata(\'targets_hovered_array\', \'id\', datum.source.id)',
              value: 0.4
            },
            {
              test: 'indata(\'sources_hovered_array\', \'id\', datum.target.id)',
              value: 0.4
            },
            {
              test: 'indata(\'view_mode__hover\', \'id\', datum.source.id) && indata(\'view_mode__hover\', \'id\', datum.target.id)',
              value: 0.4
            },
            {
              test: 'node__hover && datum.source.id !== node__hover && node__click === null',
              value: 0.22
            },
            {
              test: 'node__click !== null',
              value: 0.1
            },
            { value: 0.4 },
          ],
          zindex: [
            { test: 'datum.source.id === node__hover', value: 2 },
            { test: 'datum.target.id === node__hover', value: 2 },
            { test: 'datum.source.id === node__click', value: 2 },
            { test: 'datum.target.id === node__click', value: 2 },
            {
              test:
                'indata(\'targets_clicked_array\', \'id\', datum.source.id)',
              value: 2,
            },
          ],
        },
      },
    }
  }

  makeBimodalSymbolMarks() {
    return {
      type: 'symbol',
      name: 'bimodal-symbol',
      from: { data: 'nodes' },
      encode: {
        enter: {
          size: { field: 'nodeSize' },
          fill: { signal: 'datum.isNew ? "#fafafa" : datum.color' },
          x: { field: 'x' },
          y: { field: 'y', offset: 5 },
          cursor: { value: 'pointer' },
          tooltip: {
            signal:
              '{\'Name\': datum.name, \'Degree\': datum.group === 1 ? length(datum.sources) + length(datum.targets) + 1 : length(datum.sources) + length(datum.targets), "Indegree": datum.group == 1 ? 1 : length(datum.sources), "Outdegree": length(datum.targets), "Ontology ID": datum.uberonId}',
          },
        },
        update: {
          opacity:
            [
              {
                test: 'node__click === null && node__hover === null',
                value: 1
              },
              {
                test: 'indata(\'view_mode__click\', \'id\', datum.id) || indata(\'targets_of_targets__click\', \'targets\', datum.id) || (indata(\'sources_of_sources__click\', \'sources\', datum.id) && datum.group !== 2 && datum.group !== 3)',
                value: 1
              },
              {
                test: 'node__hover !== null && indata(\'view_mode__hover\', \'id\', datum.id) || indata(\'targets_of_targets__hover\', \'targets\', datum.id) || (indata(\'sources_of_sources__hover\', \'sources\', datum.id) && datum.group !== 2 && datum.group !== 3)',
                value: 1
              },
              {
                test: 'node__hover !== null && datum.id !== node__hover && node__click === null',
                value: 0.5
              },
              {
                value: 0.1
              }
            ],
          stroke: { signal: 'datum.problem ? "#000" : datum.isNew ? datum.color : "#fff"' },
          strokeWidth: { signal: 'datum.isNew ? 3 : datum.problem ? 3 : 0' },
          strokeDash: { signal: 'datum.isNew ? 3 : 0' }
        }
      }
    }
  }

  makeBiomodalTextMarks() {
    return {
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
              value: 'bold',
            },
            {
              test: 'datum.id === node__click',
              value: 'bold',
            },
            {
              test: 'indata(\'sources_clicked_array\', \'id\', datum.id)',
              value: 'bold',
            },
            {
              test:
                'indata(\'targets_of_targets__click\', \'targets\', datum.id)',
              value: 'bold',
            },
            {
              test:
                'indata(\'sources_of_sources__click\', \'sources\', datum.id)  && datum.group !== 2 && datum.group !== 3',
              value: 'bold',
            },
          ],
          opacity: [
            {
              test: 'node__click === null && node__hover === null',
              value: 1
            },
            {
              test: 'indata(\'view_mode__click\', \'id\', datum.id) || indata(\'targets_of_targets__click\', \'targets\', datum.id) || (indata(\'sources_of_sources__click\', \'sources\', datum.id) && datum.group !== 2 && datum.group !== 3)',
              value: 1
            },
            {
              test: 'node__hover !== null && indata(\'view_mode__hover\', \'id\', datum.id) || indata(\'targets_of_targets__hover\', \'targets\', datum.id) || (indata(\'sources_of_sources__hover\', \'sources\', datum.id) && datum.group !== 2 && datum.group !== 3)',
              value: 1
            },
            {
              test: 'node__hover !== null && datum.id !== node__hover && node__click === null',
              value: 0.5
            },
            {
              value: 0.1
            }
          ],
          limit: { value: 180 },
        },
      },
    }
  }
}
