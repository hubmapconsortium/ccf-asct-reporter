/*eslint no-underscore-dangle: "off" */
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Spec } from 'vega';
import { Injectable } from '@angular/core';
import {
  UpdateVegaSpec,
  UpdateVegaView,
  UpdateBimodal,
  UpdateBimodalConfig,
  DoSearch,
  UpdateBottomSheetData,
  UpdateLinksData,
  DiscrepencyLabel,
  DiscrepencyId,
  DuplicateId,
} from '../actions/tree.actions';
import { TNode, SearchStructure, DiscrepencyStructure } from '../models/tree.model';
import { BMNode, Link, BimodalConfig } from '../models/bimodal.model';

/** Class to keep track of all data and events related to the visualization */
export class TreeStateModel {
  /**
   * Stores the Vega Specification
   */
  spec: Spec;
  /**
   * Store the data from the Tree
   */
  treeData: TNode[];
  /**
   * Store the Vega view object which enables us to use the Vega API
   */
  view: any;
  /**
   * Store the width of the visualization
   */
  width: number;
  /**
   * Store the height of the visualization
   */
  height: number;
  /**
   * Store bimodal data - nodes, links and config (for sorting and sizing)
   */
  bimodal: {
    nodes: BMNode[],
    links: Link[],
    config: BimodalConfig
  };
  /**
   * Store the search data
   */
  search: SearchStructure[];
  /**
   * Store the last clicked node in the search field
   */
  lastSearch: SearchStructure;
  /**
   * Store data for the bottom sheet to display information
   */
  bottomSheetData: Record<string, never>;
  /**
   * Store data of links between nodes to show in the report
   */
  links: {
    AS_CT: number;
    CT_B: number;
    AS_AS: number;
    AS_CT_organWise: Record<string, number>;
    CT_B_organWise: Record<string, number>;
    AS_AS_organWise: Record<string, number>;
  };
  /**
   * Store the discrepency label data
   */
  discrepencyLabel: DiscrepencyStructure[];
  /**
   * Store the discrepency id data
   */
  discrepencyId: DiscrepencyStructure[];
  /**
   * Store the discrepency id data
   */
  duplicateId: DiscrepencyStructure[];

}

@State<TreeStateModel>({
  name: 'treeState',
  defaults: {
    spec: {},
    treeData: [],
    view: {},
    width: 0,
    height: document.getElementsByTagName('body')[0].clientHeight,
    bimodal: { nodes: [], links: [], config: { BM: { sort: 'Alphabetically', size: 'None', type: 'All' }, CT: { sort: 'Alphabetically', size: 'None' } } },
    search: [],
    lastSearch: null,
    bottomSheetData: {},
    links: { 
      AS_CT: 0,
      CT_B: 0,
      AS_AS: 0,
      AS_CT_organWise: {},
      CT_B_organWise: {},
      AS_AS_organWise: {}
    },
    discrepencyLabel: [],
    discrepencyId: [],
    duplicateId: []
  }
})
@Injectable()
export class TreeState {

  constructor() { }

  /**
   * Select the bimodal config (for sorting and sizing)
   */
  @Selector()
  static getBiomarkerType(state: TreeStateModel) {
    return state.bimodal.config.BM.type;
  }

  /**
   * Select the bimodal config (for sorting and sizing)
   */
  @Selector()
  static getBimodalConfig(state: TreeStateModel) {
    return state.bimodal.config;
  }

  /**
   * Select the vega specification
   */
  @Selector()
  static getVegaSpec(state: TreeStateModel) {
    return state.spec;
  }

  /**
   * Select the tree data (only anatomical structures)
   */
  @Selector()
  static getTreeData(state: TreeStateModel) {
    return state.treeData;
  }

  /**
   * Select the Vega View to use the Vega View API
   */
  @Selector()
  static getVegaView(state: TreeStateModel) {
    return state.view;
  }

  /**
   * Select the bimodal data. Contains the nodes, links and the bimodal config
   */
  @Selector()
  static getBimodal(state: TreeStateModel) {
    return state.bimodal;
  }

  /**
   * Select the bottom sheet data
   */
  @Selector()
  static getBottomSheetData(state: TreeStateModel) {
    return state.bottomSheetData;
  }

  /**
   * Select the links data to show in the report
   */
  @Selector()
  static getLinksData(state: TreeStateModel) {
    return state.links;
  }

  /**
   * Select the most recently chosen search option
   */
  @Selector()
  static getLatestSearchStructure(state: TreeStateModel) {
    return state.lastSearch;
  }

  /**
   * Updates the bimodal data
   */
  @Action(UpdateBimodal)
  updateBimodal({ getState, setState }: StateContext<TreeStateModel>, { nodes, links }: UpdateBimodal) {
    const state = getState();
    setState({
      ...state,
      bimodal: { nodes, links, config: state.bimodal.config }
    });
  }

  /**
   * Updates the vega view
   * Updates the tree data with the anatomical structures
   * Updates the width of the visualization
   */
  @Action(UpdateVegaView)
  updateVegaView({ getState, patchState }: StateContext<TreeStateModel>, { view }: UpdateVegaView) {
    patchState({
      view,
      treeData: view.data('tree'),
      width: view._viewWidth
    });
  }

  /**
   * Updates te vega spec
   */
  @Action(UpdateVegaSpec)
  updateVegaSpec({ setState, getState }: StateContext<TreeStateModel>, { spec }: UpdateVegaSpec) {
    const state = getState();
    setState({
      ...state,
      spec
    });
  }

  /**
   * Updates the bimodal config
   */
  @Action(UpdateBimodalConfig)
  updateBimodalConfig({ getState, setState }: StateContext<TreeStateModel>, { config }: UpdateBimodalConfig) {
    const state = getState();
    const nodes = state.bimodal.nodes;
    const links = state.bimodal.links;

    setState({
      ...state,
      bimodal: {
        nodes,
        links,
        config
      }
    });
  }

  /**
   * Updates the search list
   */
  @Action(DoSearch)
  doSearch({ getState, setState }: StateContext<TreeStateModel>, { searchStructures, lastClickedOption: lastClickedStructure }: DoSearch) {
    const state = getState();
    setState({
      ...state,
      search: searchStructures,
      lastSearch: lastClickedStructure
    });
  }

  /**
   * Updates the discrepency labels list
   */
  @Action(DiscrepencyLabel)
  discrepencyLabel({ getState, setState }: StateContext<TreeStateModel>, { discrepencyStructures }: DiscrepencyLabel) {
    const state = getState();
    setState({
      ...state,
      discrepencyLabel: discrepencyStructures,
    });
  }

  /**
   * Updates the discrepency ids list
   */
  @Action(DiscrepencyId)
  discrepencyId({ getState, setState }: StateContext<TreeStateModel>, { discrepencyStructures }: DiscrepencyLabel) {
    const state = getState();
    setState({
      ...state,
      discrepencyId: discrepencyStructures,
    });
  }

  /**
   * Updates the duplicate ids list
   */
  @Action(DuplicateId)
  duplicateId({ getState, setState }: StateContext<TreeStateModel>, { discrepencyStructures }: DiscrepencyLabel) {
    const state = getState();
    setState({
      ...state,
      duplicateId: discrepencyStructures,
    });
  }

  /**
   * Updates the bottom sheet data
   */
  @Action(UpdateBottomSheetData)
  updateBottomSheetData({ getState, setState }: StateContext<TreeStateModel>, { data }: UpdateBottomSheetData) {
    const state = getState();
    setState({
      ...state,
      bottomSheetData: data
    });
  }

  /**
   * Updates the links data that is displayed in the report
   */
  @Action(UpdateLinksData)
  updateLinksData({ getState, setState }: StateContext<TreeStateModel>, { AS_CT, CT_B,  AS_CT_organWise, CT_B_organWise, AS_AS, AS_AS_organWise, allOrgans }: UpdateLinksData) {
    const state = getState();
    if (AS_AS) {
      setState({
        ...state,
        links: { ...state.links, AS_AS}
      });
    } else if (AS_AS_organWise) {
      setState({
        ...state,
        links: { ...state.links,
          AS_AS_organWise: {...state.links.AS_AS_organWise, ...AS_AS_organWise}
        }
      });
    } else {
      setState({
        ...state,
        links: { 
          AS_CT : allOrgans ? state.links.AS_CT : AS_CT,
          CT_B : allOrgans ? state.links.CT_B : CT_B,
          CT_B_organWise: {...state.links.CT_B_organWise, ...CT_B_organWise},
          AS_CT_organWise: {...state.links.AS_CT_organWise, ...AS_CT_organWise},
          AS_AS: state.links.AS_AS,
          AS_AS_organWise: state.links.AS_AS_organWise
        }
      });
    }

  }

}
