import { Signals } from './vegaConfig/signals';
import { Data } from './vegaConfig/data';
import { Scales } from './vegaConfig/scales';
import { Legends } from './vegaConfig/legends';

export class VegaConfig {
    
    async makeVegaConfig(currentSheet, bimodalDistance, height, width, treeData, multiParentLinksData) {
        let config: any = {
            $schema: 'https://vega.github.io/schema/vega/v5.json',
            autosize: 'pad',
            padding: {
              right: 0,
              top: 20,
              bottom: 20,
              left: 30,
            },
            signals: new Signals(),
            data: new Data(currentSheet, bimodalDistance, height, width, treeData, multiParentLinksData),
            scales: new Scales(),
            legends: new Legends(),
            marks: [
              {
                type: 'group',
                marks: [
                  {
                    type: 'path',
                    from: { data: 'multi_parent_edges' },
                    encode: {
                      update: {
                        path: { field: 'path' },
                        stroke: {signal: 'datum.source.pathColor'},
                        strokeDash: {value: [5, 8]},
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
                        zIndex: {value: -1},
                        strokeWidth: { value: 2 },
                      },
                    },
                  },
                ]
              },
              {
                type: 'group',
                name: 'asTree',
                marks: [
                  {
                    type: 'path',
                    from: { data: 'links' },
                    encode: {
                      update: {
                        path: { field: 'path' },
                        stroke: {signal: 'datum.source.pathColor'},
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
                  },
                  {
                    type: 'symbol',
                    from: { data: 'tree' },
                    encode: {
                      enter: {
                        size: { value: 300 },
                        stroke: { signal: 'datum.problem ? "#000": datum.isNew ? datum.color :"#fff"' },
                        strokeWidth: { signal: 'datum.problem ? 3: datum.isNew ? 3 : 0' },
                        strokeDash: {signal: 'datum.isNew ? 3 : 0'}
                      },
                      update: {
                        x: { field: 'x' },
                        y: { field: 'y' },
                        tooltip: {signal: '{"Ontology Link": datum.uberonId}'},
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
                        zIndex: {value: 1},
                        fill: { signal: 'datum.isNew ? "#fafafa" : datum.color' },
                      },
                    },
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
                  },
                ],
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
                          {signal: 'datum.source.pathColor ? datum.source.pathColor : "#ccc"'},
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
                          { test: 'node__hover && datum.source.id !== node__hover && node__click === null',
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
                  },
                  {
                    type: 'symbol',
                    name: 'bimodal-symbol',
                    from: { data: 'nodes' },
                    encode: {
                      enter: {
                        size: { field: 'nodeSize' },
                        fill: { signal: 'datum.isNew ? "#fafafa" : datum.color'},
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
                        strokeWidth: {signal: 'datum.isNew ? 3 : datum.problem ? 3 : 0'},
                        strokeDash: {signal: 'datum.isNew ? 3 : 0'}
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
                  },
                ],
              },
            ],
          };
        
          return config
    }
}