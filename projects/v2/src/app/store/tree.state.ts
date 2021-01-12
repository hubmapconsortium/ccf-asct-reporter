import {State, Action, StateContext, Selector} from '@ngxs/store';
import { Spec } from 'vega';
import { Injectable } from '@angular/core';
import { UpdateVegaSpec, UpdateVegaView, UpdateBimodal, UpdateBimodalConfig, DoSearch, UpdateGraphWidth, UpdateBottomSheetData, UpdateLinksData } from '../actions/tree.actions';
import { TNode, SearchStructure } from '../models/tree.model';
import { BMNode, Link, BimodalConfig } from '../models/bimodal.model';

import { validateWidth } from '../static/util';

export class TreeStateModel {
  spec: Spec;
  treeData: TNode[];
  view: any;
  width: number;
  height: number;
  screenWidth: number;
  bimodal: {
    nodes: BMNode[],
    links: Link[],
    config: BimodalConfig
  };
  search: SearchStructure[];
  completed: boolean;
  bottomSheetData: {};
  links: {
    AS_CT: number;
    CT_B: number;
  };
}

@State<TreeStateModel>({
  name: 'treeState',
  defaults: {
    spec: {},
    treeData: [],
    view: {},
    width: 0,
    height: document.getElementsByTagName('body')[0].clientHeight,
    screenWidth: validateWidth(document.getElementsByTagName('body')[0].clientWidth),
    bimodal: {nodes: [], links: [], config: {BM: {sort: 'Alphabetically', size: 'None'}, CT: {sort: 'Alphabetically', size: 'None'}}},
    completed: false,
    search: [],
    bottomSheetData: {},
    links: {AS_CT: 0, CT_B: 0}
  }
})
@Injectable()
export class TreeState {

  constructor() {
  }

  @Selector()
  static getBimodalConfig(state: TreeStateModel) {
    return state.bimodal.config;
  }

  @Selector()
  static getVegaSpec(state: TreeStateModel) {
    return state.spec;
  }

  @Selector()
  static getTreeData(state: TreeStateModel) {
    return state.treeData;
  }

  @Selector()
  static getVegaView(state: TreeStateModel) {
    return state.view;
  }

  @Selector()
  static getBimodal(state: TreeStateModel) {
    return state.bimodal;
  }

  @Selector()
  static getScreenWidth(state: TreeStateModel) {
    return state.screenWidth;
  }

  @Selector()
  static getBottomSheetData(state: TreeStateModel) {
    return state.bottomSheetData;
  }

  @Selector()
  static getLinksData(state: TreeStateModel) {
    return state.links;
  }


  @Action(UpdateBimodal)
  updateBimodal({getState, setState}: StateContext<TreeStateModel>, {nodes, links}: UpdateBimodal) {
    const state = getState();
    setState({
      ...state,
      bimodal: {nodes, links, config: state.bimodal.config}
    });
  }

  @Action(UpdateVegaView)
  updateVegaView({getState, patchState}: StateContext<TreeStateModel>, {view}: UpdateVegaView) {
    const state = getState();
    patchState({
      view,
      treeData: view.data('tree'),
      width: view._viewWidth
    });
  }


  @Action(UpdateVegaSpec)
  updateVegaSpec({setState, getState}: StateContext<TreeStateModel>, {spec}: UpdateVegaSpec) {
    const state = getState();
    setState({
      ...state,
      spec
    });
  }

  @Action(UpdateBimodalConfig)
  updateBimodalConfig({getState, setState}: StateContext<TreeStateModel>, {config}: UpdateBimodalConfig) {
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

  @Action(DoSearch)
  doSearch({getState, setState}: StateContext<TreeStateModel>, {searchStructures}: DoSearch) {
    const state = getState();
    setState({
      ...state,
      search: searchStructures
    });
  }

  @Action(UpdateGraphWidth)
  updateWidth({getState, setState}: StateContext<TreeStateModel>, {width}: UpdateGraphWidth) {
    const state = getState();
    setState({
      ...state,
      screenWidth: validateWidth(width)
    });
  }

  @Action(UpdateBottomSheetData)
  updateBottomSheetData({getState, setState}: StateContext<TreeStateModel>, {data}: UpdateBottomSheetData) {
    const state = getState();
    setState({
      ...state,
      bottomSheetData: data
    });
  }

  @Action(UpdateLinksData)
  updateLinksData({getState, setState}: StateContext<TreeStateModel>, {AS_CT, CT_B}: UpdateLinksData) {
    const state = getState();
    setState({
      ...state,
      links: {AS_CT, CT_B}
    });
  }

}
