import { Data as VegaDataInterface } from 'vega';
import { TNode } from '../../../models/tree.model';
import { Sheet, SheetConfig } from '../../../models/sheet.model';

interface VegaData {
  /**
   * List of vega data interfaces
   */
  data: Array<VegaDataInterface>;
}

export class Data implements VegaData {
  /**
   * List of data functions
   */
  data: any;

  constructor(currentSheet: Sheet, treeData: TNode[], sheetConfig: SheetConfig) {
    this.data = [
      this.makeASTreeData(currentSheet, treeData, sheetConfig),
      this.makeASTreeLinksData(),
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
      this.makeSearchIdsData(),
      this.makeDiscrepencyLabelData(),
      this.makeDiscrepencyIdData(),
      this.makeDuplicateIdData()
    ];

    return this.data;
  }

  /**
   * Stores the list of IDs that should show on the graph
   * when search is used
   */
  makeSearchIdsData() {
    return {
      name: 'search',
      values: []
    };
  }

  /**
   * Stores the list of IDs that should show on the graph
   * when Discrepency ID feature is used
   */
  makeDiscrepencyIdData() {
    return {
      name: 'discrepencyId',
      values: []
    };
  }

  /**
   * Stores the list of IDs that should show on the graph
   * when Duplicate ID feature is used
   */
  makeDuplicateIdData() {
    return {
      name: 'duplicateId',
      values: []
    };
  }

  /**
   * Stores the list of Labels that should show on the graph
   * when Discrepency Labels feature is used
   */
  makeDiscrepencyLabelData() {
    return {
      name: 'discrepencyLabel',
      values: []
    };
  }

  /**
   * Function to create vega data. Has tree config
   * and the nodes
   *
   * @param treeData tree data from tree service
   */
  makeASTreeData(currentSheet: Sheet, treeData: TNode[], config: SheetConfig) {
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
            { signal: 'as_height'  },
            { signal: 'as_width' },
          ],
          separation: { value: false },
          as: ['y', 'x', 'depth', 'children'],
        },
      ],
    };
  }

  /**
   * Creates links in the vega tree
   */
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

  /**
   * Function to create edges between multi parents (depricated)
   * @param multiParentLinksData multi parent links (depricated)
   */
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

  /**
   * Stores the nodes data of the bimodal network
   */
  makeBimodalNodesData() {
    return {
      name: 'nodes',
      values: []
    };
  }

  /**
   * Stores the edges of the bimodal network
   */
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

  /**
   * Stores the targets of a node that has been hovered on
   */
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

  /**
   * Stores the sources of a node that has been hovered on
   */
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

  /**
   * Stores the targets of a node that has been clicked on
   */
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

  /**
   * Stores the sources of a node that has been clicked on
   */
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

  /**
   * Stores the targets or targets of a node that has been clicked on
   */
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

  /**
   * Stores the sources or sources of a node that has been clicked on
   */
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

  /**
   * Stores the targets or targets of a node that has been hovered on
   */
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

  /**
   * Stores the sources or sources of a node that has been hovered on
   */
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

  /**
   * Stores the nodes whole opacity needs to be reduced when a node is clicked on
   */
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

  /**
   * Stores the nodes whole opacity needs to be reduced when a node is hovered on
   */
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
