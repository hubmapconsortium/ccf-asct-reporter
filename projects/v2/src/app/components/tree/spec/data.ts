import { Data as VegaDataInterface } from 'vega';

interface VegaData {
  data: Array<VegaDataInterface>;
}

export class Data implements VegaData {
  data: any;

  constructor(currentSheet, bimodalDistance, height, width, treeData, multiParentLinksData) {
    this.data = [
      this.makeASTreeData(currentSheet, bimodalDistance, height, width, treeData),
      this.makeASTreeLinksData(),
      this.makeASMultiParentEdgesData(multiParentLinksData),
      this.makeBimodalNodesData(),
      this.makeBimodalEdgesData(),
      this.makeSourcesClickData(),
      this.makeSourcesHoverData(),
      this.makeTargetsClickData(),
      this.makeTargetsHoverData(),
      this.makeSourcesOfSourcesClickData(),
      this.makeSourcesOfSourcesHoverData(),
      this.makeTargetsOfTargetsClickData(),
      this.makeTargetsOfTargetsHoverData(),
      this.makeViewModeClickData(),
      this.makeViewModeHoverData(),
      this.makeSearchIdsData()
    ];

    return this.data;
  }

  makeSearchIdsData() {
    return {
      name: 'search',
      values: []
    };
  }

  makeASTreeData(currentSheet, bimodalDistance, height, width, treeData) {
    return {
      name: 'tree',
      values: treeData,
      transform: [
        {
          type: 'stratify',
          key: 'id',
          parentKey: 'parent',
        },
        {
          type: 'tree',
          method: 'cluster',
          size: [
            { signal: height + currentSheet.config.height_offset },
            { signal: width - bimodalDistance * 2 - 200 },
          ],
          separation: { value: false },
          as: ['y', 'x', 'depth', 'children'],
        },
      ],
    };
  }

  makeASTreeLinksData() {
    return {
      name: 'links',
      source: 'tree',
      transform: [
        { type: 'treelinks' },
        {
          type: 'linkpath',
          orient: 'horizontal',
          shape: 'diagonal',
        },
      ],
    };
  }

  makeASMultiParentEdgesData(multiParentLinksData) {
    return {
      name: 'multi_parent_edges',
      values: multiParentLinksData,
      transform: [
        {
          type: 'lookup',
          from: 'tree',
          key: 'id',
          fields: ['s', 't'],
          as: ['source', 'target'],
        },
        {
          type: 'linkpath',
          sourceX: 'source.x',
          sourceY: 'source.y',
          targetX: 'target.x',
          targetY: 'target.y',
          orient: 'horizontal',
          shape: 'curve',
        }
      ],
    };
  }

  makeBimodalNodesData() {
    return {
      name: 'nodes',
      values: []
    };
  }

  makeBimodalEdgesData() {
    return {
      name: 'edges',
      values: [],
      transform: [
        {
          type: 'lookup',
          from: 'nodes',
          key: 'id',
          fields: ['s', 't', 'pathColor'],
          as: ['source', 'target', 'c'],
        },
        {
          type: 'linkpath',
          sourceX: 'source.x',
          sourceY: 'source.y',
          targetX: 'target.x',
          targetY: 'target.y',
          orient: 'horizontal',
          shape: 'diagonal',
        },
      ],
    };
  }

  makeTargetsHoverData() {
    return {
      name: 'targets_hovered_array',
      source: 'nodes',
      transform: [
        {
          type: 'filter',
          expr: 'indexof(node_targets__hover, datum.id) !== -1',
        },
      ],
    };
  }

  makeSourcesHoverData() {
    return {
      name: 'sources_hovered_array',
      source: 'nodes',
      transform: [
        {
          type: 'filter',
          expr: 'indexof(node_sources__hover, datum.id) !== -1',
        },
      ],
    };
  }

  makeTargetsClickData() {
    return {
      name: 'targets_clicked_array',
      source: 'nodes',
      transform: [
        {
          type: 'filter',
          expr: 'indexof(targets__click, datum.id) !== -1',
        },
      ],
    };
  }

  makeSourcesClickData() {
    return {
      name: 'sources_clicked_array',
      source: 'nodes',
      transform: [
        {
          type: 'filter',
          expr: 'indexof(sources__click, datum.id) !== -1',
        },
      ],
    };
  }

  makeTargetsOfTargetsClickData() {
    return {
      name: 'targets_of_targets__click',
      source: 'nodes',
      transform: [
        {
          type: 'filter',
          expr: 'indexof(targets__click, datum.id) !== -1',
        },
        {
          type: 'flatten',
          fields: ['targets'],
        },
      ],
    };
  }

  makeSourcesOfSourcesClickData() {
    return {
      name: 'sources_of_sources__click',
      source: 'nodes',
      transform: [
        {
          type: 'filter',
          expr: 'indexof(sources__click, datum.id) !== -1',
        },
        {
          type: 'flatten',
          fields: ['sources'],
        },
      ],
    };
  }

  makeTargetsOfTargetsHoverData() {
    return {
      name: 'targets_of_targets__hover',
      source: 'nodes',
      transform: [
        {
          type: 'filter',
          expr: 'indexof(node_targets__hover, datum.id) !== -1',
        },
        {
          type: 'flatten',
          fields: ['targets'],
        },
      ],
    };
  }

  makeSourcesOfSourcesHoverData() {
    return {
      name: 'sources_of_sources__hover',
      source: 'nodes',
      transform: [
        {
          type: 'filter',
          expr: 'indexof(node_sources__hover, datum.id) !== -1',
        },
        {
          type: 'flatten',
          fields: ['sources'],
        },
      ],
    };
  }

  makeViewModeClickData() {
    return {
      name: 'view_mode__click',
      source: 'nodes',
      transform: [
        {
          type: 'filter',
          expr: 'node__click === datum.id || indata("sources_clicked_array", "id", datum.id) || indata("targets_clicked_array", "id", datum.id)',
        },
      ]
    };
  }

  makeViewModeHoverData() {
    return {
      name: 'view_mode__hover',
      source: 'nodes',
      transform: [
        {
          type: 'filter',
          expr: 'node__hover === datum.id || indata("sources_hovered_array", "id", datum.id) || indata("targets_hovered_array", "id", datum.id)',
        },
      ]
    };
  }
}
