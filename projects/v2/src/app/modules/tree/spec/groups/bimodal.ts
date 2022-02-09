import { GroupMark } from 'vega';

export interface VegaBimodalGroup {
  /**
   * Vega mark group
   */
  group: GroupMark;
}

export class BimodalMarkGroup implements VegaBimodalGroup {
  group: any;

  constructor() {
    this.group = this.makeBimodalMarkGroup();
    return this.group;
  }

  /**
   * Function to create the mark groups for the bimodal network
   */
  makeBimodalMarkGroup() {
    return {
      type: 'group',
      signals: [
        { name: 'bgoffset', value: 8 }
      ],
      name: 'bimodal-network',
      marks: [
        this.makeBimodalPathMarks(),
        this.makeBimodalSymbolMarks(),
        this.makeBiomodalTextMarks(),
        this.makeBimodalTextSearchMarks(),
        this.makeBiomodalTextLinkMarks(),
        this.makeBimodalTextDiscrepencyLabelMarks(),
        this.makeBimodalTextDiscrepencyIdMarks(),
        this.makeBimodalTextDuplicateIdMarks()
      ]
    };
  }

  /**
   * Rectangle around the bimodal text mark
   */
  makeBimodalTextSearchMarks() {
    return {
      name: 'rectmark',
      type: 'rect',
      from: { data: 'textmark' },
      encode: {
        enter: {
          x: { field: 'bounds.x1', round: true, offset: { signal: '-bgoffset' } },
          x2: { field: 'bounds.x2', round: true, offset: { signal: 'bgoffset' } },
          y: { field: 'bounds.y1', round: true, offset: { signal: '-bgoffset' } },
          y2: { field: 'bounds.y2', round: true, offset: { signal: 'bgoffset' } },
          fill: { value: 'aliceblue' },
          stroke: { value: 'steelblue' },
          zindex: {value: -1}
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

  /**
   * Rectangle around the bimodal text mark when discrepency label toggle is turned on
   */
  makeBimodalTextDiscrepencyLabelMarks() {
    return {
      name: 'rectmarkdiscrepencylabel',
      type: 'rect',
      from: { data: 'textmark' },
      encode: {
        enter: {
          x: { field: 'bounds.x1', round: true, offset: { signal: '-bgoffset' } },
          x2: { field: 'bounds.x2', round: true, offset: { signal: 'bgoffset' } },
          y: { field: 'bounds.y1', round: true, offset: { signal: '-bgoffset' } },
          y2: { field: 'bounds.y2', round: true, offset: { signal: 'bgoffset' } },
          fill: { value: 'lightblue' },
          stroke: { value: 'darkblue' },
          zindex: {value: -1}
        },
        update: {
          opacity: [
            {
              test: 'node__click === null && indata(\'discrepencyLabel\', \'id\', datum.datum.id)',
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

  /**
   * Rectangle around the bimodal text mark when discrepency Id toggle is turned on
   */
  makeBimodalTextDiscrepencyIdMarks() {
    return {
      name: 'rectmarkdiscrepencyid',
      type: 'rect',
      from: { data: 'textmark' },
      encode: {
        enter: {
          x: { field: 'bounds.x1', round: true, offset: { signal: '-bgoffset' } },
          x2: { field: 'bounds.x2', round: true, offset: { signal: 'bgoffset' } },
          y: { field: 'bounds.y1', round: true, offset: { signal: '-bgoffset' } },
          y2: { field: 'bounds.y2', round: true, offset: { signal: 'bgoffset' } },
          fill: { value: 'bisque' },
          stroke: { value: 'burlywood' },
          zindex: {value: -1}
        },
        update: {
          opacity: [
            {
              test: 'node__click === null && indata(\'discrepencyId\', \'id\', datum.datum.id)',
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

  /**
   * Rectangle around the bimodal text mark when duplicate Id toggle is turned on
   */
  makeBimodalTextDuplicateIdMarks() {
    return {
      name: 'rectmarkduplicateid',
      type: 'rect',
      from: { data: 'textmark' },
      encode: {
        enter: {
          x: { field: 'bounds.x1', round: true, offset: { signal: '-bgoffset' } },
          x2: { field: 'bounds.x2', round: true, offset: { signal: 'bgoffset' } },
          y: { field: 'bounds.y1', round: true, offset: { signal: '-bgoffset' } },
          y2: { field: 'bounds.y2', round: true, offset: { signal: 'bgoffset' } },
          fill: { value: 'lightyellow' },
          stroke: { value: 'burlywood' },
          zindex: {value: -1}
        },
        update: {
          opacity: [
            {
              test: 'node__click === null && indata(\'duplicateId\', \'id\', datum.datum.id)',
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

  /**
   * Bimodal paths
   */
  makeBimodalPathMarks() {
    return {
      type: 'path',
      name: 'bimodal-path',
      from: { data: 'edges' },
      encode: {
        enter: {
          stroke: { value: '#ccc' },
          strokeWidth: { value: 1.5 },
          x: { value: 0 },
          y: { value: 5 },
        },
        update: {
          tooltip: [
            {
              test: 'node__click === null && datum.target.group === 2',
              signal: 'length(datum.target.references) > 0 ? \'Click to see DOI References\' : \'No DOI References\''
            },
            {
              test: 'node__click === null && datum.target.group !== 2',
              signal: 'length(datum.source.references) > 0 ? \'Click to see DOI References\' : \'No DOI References\''
            },
          ],
          strokeWidth: { value: 1.5 },
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
                'datum.source.id === node__hover && datum.source.group == 2 && !datum.pathColor',
              value: '#377EB8',
            }, // for hover
            {
              test:
                'datum.source.id === node__hover && datum.source.group == 2 && datum.pathColor',
              field: 'pathColor'
            }, // for hover
            {
              test:
                'datum.target.id === node__hover && datum.target.group == 2',
              value: '#E41A1C',
            }, // for hover
            {
              test:
                'datum.target.id === node__hover && datum.target.group == 3 && !datum.pathColor',
              value: '#4DAF4A',
            }, // for hover
            {
              test:
                'datum.target.id === node__hover && datum.target.group == 3 && datum.pathColor',
              field: 'pathColor'
            }, // for hover
            {
              test:
                'datum.source.id === node__click && datum.source.group == 1',
              value: '#E41A1C',
            }, // for click
            {
              test:
                'datum.source.id === node__click && datum.source.group == 2 && !datum.pathColor',
              value: '#377EB8',
            }, // for click
            {
              test:
                'datum.source.id === node__click && datum.source.group == 2 && datum.pathColor',
              field: 'pathColor'
            }, // for click
            {
              test:
                'datum.target.id === node__click && datum.target.group == 2',
              value: '#E41A1C',
            }, // for click
            {
              test:
                'datum.target.id === node__click && datum.target.group == 3 && !datum.pathColor',
              value: '#4DAF4A',
            }, // for click
            {
              test:
                'datum.target.id === node__click && datum.target.group == 3 && datum.pathColor',
              field: 'pathColor'
            }, // for click
            {
              test:'(node__click !== null || node__hover !== null) && datum.target.group == 3',
              value: '#ccc', // for greying out other paths when clicking on a node
            },
            {
              test:'(node__click !== null || node__hover !== null) && datum.target.group == 2',
              value: '#ccc', // for greying out other paths when clicking on a node
            },
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
            { signal: 'datum.pathColor? datum.pathColor :datum.source.pathColor === datum.target.pathColor ? datum.source.pathColor : "#ccc"' },
          ],
          opacity: [
            { test: 'datum.target.id === node__click', value: 0.5 },
            { test: 'datum.source.id === node__click', value: 0.5 },
            {
              test: 'indata(\'targets_clicked_array\', \'id\', datum.source.id)',
              value: 0.5,
            },
            {
              test: 'indata(\'sources_clicked_array\', \'id\', datum.target.id) && datum.source.group !== 2',
              value: 0.5,
            },
            {
              test: 'indata(\'targets_hovered_array\', \'id\', datum.source.id)',
              value: 0.3
            },
            {
              test: 'indata(\'sources_hovered_array\', \'id\', datum.target.id)',
              value: 0.3
            },
            {
              test: 'indata(\'view_mode__hover\', \'id\', datum.source.id) && indata(\'view_mode__hover\', \'id\', datum.target.id)',
              value: 0.3
            },
            {
              test: 'node__hover && datum.source.id !== node__hover && node__click === null',
              value: 0.15
            },
            {
              test: 'node__click !== null',
              value: 0.1
            },
            { value: 0.3 },
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
        hover: {
          strokeWidth: [
            { test: 'node__click === null', value: 3.5 }
          ],
          stroke: { value: '#6c6a63' },
          cursor: [
            { test: 'node__click === null', value:  'pointer'}
          ]
        }
      },
    };
  }

  /**
   * Bimodal symbols
   */
  makeBimodalSymbolMarks() {
    return {
      type: 'symbol',
      name: 'bimodal-symbol',
      from: { data: 'nodes' },
      encode: {
        enter: {
          shape: {
            signal:
              `datum.bType === "gene" ?
              "circle" : datum.bType === "protein" ?
              "diamond" : datum.bType === "lipids" ?
              "square" : datum.bType === "metabolites" ?
              "triangle": datum.bType === "proteoforms" ?
              "cross" : "circle"`,
          },
          size: { field: 'nodeSize' },
          fill: { signal: 'datum.isNew ? "#fafafa" : datum.color' },
          x: { field: 'x' },
          y: { field: 'y', offset: 5 },
          cursor: { value: 'pointer' },
          tooltip: {
            signal:
              '{\'Name\': datum.name, \'Degree\': datum.group === 1 ? length(datum.sources) + length(datum.targets) + 1 : length(datum.sources) + length(datum.targets), "Indegree": datum.group == 1 ? 1 : length(datum.sources), "Outdegree": length(datum.targets), "Ontology ID": datum.ontologyId, "rdfs:label": datum.label}',
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
          strokeWidth: { signal: 'datum.isNew ? 4 : 0' },
          strokeDash: { signal: 'datum.isNew ? [3, 3] : [0, 0]' }
        }
      }
    };
  }

  /**
   * Bimodal link texts
   */
  makeBiomodalTextLinkMarks() {
    return {
      type: 'text',
      name: 'textlinkmark',
      zindex: 5,
      dx: 5,
      from: { data: 'nodes' },
      encode: {
        update: {
          x: { field: 'x' },
          y: { field: 'y', offset: 5 },
          dx: { value: 20 },
          dy: { value: 10 },
          align: { value: 'left' },
          baseline: { value: 'middle' },
          text: { field: 'ontologyId' },
          fontSize: { value: 11 },
          fill: [
            {
              value: 'grey'
            }
          ],
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
              test: '!show_ontology',
              value: 0
            },
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
          limit: { signal: 'node__click === datum.id || node__hover === datum.id || indata(\'view_mode__click\', \'id\', datum.id) || indata(\'view_mode__hover\', \'id\', datum.id) || indata(\'targets_of_targets__click\', \'targets\', datum.id) || indata(\'sources_of_sources__click\', \'sources\', datum.id) || indata(\'targets_of_targets__hover\', \'targets\', datum.id) || indata(\'sources_of_sources__hover\', \'sources\', datum.id)? null : 150' },
        },
      },
    };
  }

  /**
   * Bimodal text marks
   */
  makeBiomodalTextMarks() {
    return {
      type: 'text',
      name: 'textmark',
      zindex: 5,
      dx: 5,
      from: { data: 'nodes' },
      encode: {
        update: {
          x: { field: 'x' },
          y: { field: 'y', offset: 5 },
          dx: { value: 20 },
          dy: { signal: 'show_ontology ? -8 : 0' },
          align: { value: 'left' },
          baseline: { value: 'middle' },
          text: { field: 'name' },
          fontSize: { field: 'fontSize' },
          cursor: { value: 'pointer' },
          fill: [
            {
              test: 'datum === bimodal_text__hover',
              value: 'steelblue'
            },
            {
              value: 'black'
            }
          ],
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
          limit: { signal: 'node__click === datum.id || node__hover === datum.id || indata(\'view_mode__click\', \'id\', datum.id) || indata(\'view_mode__hover\', \'id\', datum.id) || indata(\'targets_of_targets__click\', \'targets\', datum.id) || indata(\'sources_of_sources__click\', \'sources\', datum.id) || indata(\'targets_of_targets__hover\', \'targets\', datum.id) || indata(\'sources_of_sources__hover\', \'sources\', datum.id)? null : 150' },
        },
      },
    };
  }
}
