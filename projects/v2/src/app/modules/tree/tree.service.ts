import { Injectable } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { VegaService } from './vega.service';
import { AS_RED, TNode, NODE_TYPE } from './../../models/tree.model';
import { TreeState, TreeStateModel } from '../../store/tree.state';
import { Observable } from 'rxjs';
import { validateWidth } from '../../static/util';
import { UIState, UIStateModel } from '../../store/ui.state';
import { ReportLog } from '../../actions/logs.actions';
import { LOG_TYPES, LOG_ICONS } from '../../models/logs.model';
import { UpdateVegaSpec } from '../../actions/tree.actions';
import { Sheet } from '../../models/sheet.model';
import { HasError } from '../../actions/ui.actions';
import { Error } from '../../models/response.model';


@Injectable({
  providedIn: 'root'
})
export class TreeService {
  height: number;
  screenWidth: number;
  controlPaneOpen: boolean;

  @Select(TreeState) tree$: Observable<TreeStateModel>;
  @Select(UIState) uiState$: Observable<UIStateModel>;

  constructor(public store: Store, public vs: VegaService) {

    this.tree$.subscribe(state => {
      this.height = state.height;
      this.screenWidth = state.screenWidth;
      const view = state.view;

      if (Object.keys(view).length) {
        const search = state.search;
        view.data('search', search);
        view.runAsync();
      }
    });

    this.uiState$.subscribe(state => {
      this.controlPaneOpen = state.controlPaneOpen;
    })

  }

  public makeTreeData(currentSheet: Sheet, data, compareData?: any) {
    try {
      let id = 1;
      const linkData = [];
      let parent: TNode;
      const nodes = []
      const root = new TNode(id, data[0].anatomical_structures[0].name, 0, data[0].anatomical_structures[0].id, AS_RED);
      root.comparator = root.name + root.ontology_id
      root.type = NODE_TYPE.R;
      delete root.parent;
      nodes.push(root);

      data.forEach(row => {
        parent = root;

        row.anatomical_structures.forEach(structure => {

          let s = nodes.findIndex(i => i.type !== 'root' && i.comparator === (parent.comparator + structure.name + structure.id));
          if (s === -1) {
            id += 1
            const newNode = new TNode(id, structure.name, parent.id, structure.id, AS_RED);
            newNode.comparator = parent.comparator + newNode.name + newNode.ontology_id;
            if ('isNew' in structure) {
              newNode.isNew = true;
              newNode.color = structure.color;
              newNode.pathColor = structure.color;
            }

            nodes.push(newNode);
            parent = newNode;
          } else {
            let node = nodes[s];
            if ('isNew' in structure) {
              node.color = structure.color;
              node.pathColor= structure.color;
            }
            parent = node;
          }
        })
      });

      // delete duplicate organ element
      nodes.shift()
      delete nodes[0].parent


      const spec = this.vs.makeVegaConfig(currentSheet, this.height, validateWidth(this.screenWidth, this.controlPaneOpen), nodes);
      this.store.dispatch(new UpdateVegaSpec(spec));
      this.vs.renderGraph(spec);
    } catch (error) {
      console.log(error)
      const err: Error = {
        msg: `${error.name} (Status: ${error.status})`,
        status: error.status,
        hasError: true
      };
      this.store.dispatch(new ReportLog(LOG_TYPES.MSG, 'Failed to create Tree', LOG_ICONS.error))
      this.store.dispatch(new HasError(err))
    }
  }
}


