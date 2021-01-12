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
import { Sheet, SheetConfig } from '../../models/sheet.model';
import { HasError } from '../../actions/ui.actions';
import { Error } from '../../models/response.model';
import { SheetState } from '../../store/sheet.state';
import { Row } from '../../models/sheet.model';

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  height: number;
  controlPaneOpen: boolean;
  sheetConfig: SheetConfig;

  @Select(TreeState) tree$: Observable<TreeStateModel>;
  @Select(UIState) uiState$: Observable<UIStateModel>;
  @Select(SheetState.getSheetConfig) sc$: Observable<SheetConfig>;

  constructor(public store: Store, public vs: VegaService) {

    this.tree$.subscribe(state => {
      this.height = state.height;
      const view = state.view;

      if (Object.keys(view).length) {
        const search = state.search;
        view.data('search', search);
        view.runAsync();
      }
    });

    this.uiState$.subscribe(state => {
      this.controlPaneOpen = state.controlPaneOpen;
    });

    this.sc$.subscribe(config => {
      this.sheetConfig = config;
    });

  }

  public makeTreeData(currentSheet: Sheet, data: Row[], compareData?: any) {
    try {
      let id = 1;
      const linkData = [];
      let parent: TNode;
      const nodes = [];
      const root = new TNode(id, data[0].anatomical_structures[0].name, 0, data[0].anatomical_structures[0].id, AS_RED);
      root.comparator = root.name + root.ontologyId;
      root.type = NODE_TYPE.R;
      delete root.parent;
      nodes.push(root);

      data.forEach(row => {
        parent = root;

        row.anatomical_structures.forEach(structure => {

          const s = nodes.findIndex(i => i.type !== 'root' && i.comparator === (parent.comparator + structure.name + structure.id));
          if (s === -1) {
            id += 1;
            const newNode = new TNode(id, structure.name, parent.id, structure.id, AS_RED);
            newNode.comparator = parent.comparator + newNode.name + newNode.ontologyId;
            if ('isNew' in structure) {
              newNode.isNew = true;
              newNode.color = structure.color;
              newNode.pathColor = structure.color;
            }

            nodes.push(newNode);
            parent = newNode;
          } else {
            const node = nodes[s];
            if ('isNew' in structure) {
              node.color = structure.color;
              node.pathColor = structure.color;
            }
            parent = node;
          }
        });
      });

      // delete duplicate organ element
      nodes.shift();
      delete nodes[0].parent;


      const spec = this.vs.makeVegaConfig(currentSheet, nodes, this.sheetConfig);
      this.store.dispatch(new UpdateVegaSpec(spec));
      this.vs.renderGraph(spec);
    } catch (error) {
      console.log(error);
      const err: Error = {
        msg: `${error.name} (Status: ${error.status})`,
        status: error.status,
        hasError: true
      };
      this.store.dispatch(new ReportLog(LOG_TYPES.MSG, 'Failed to create Tree', LOG_ICONS.error));
      this.store.dispatch(new HasError(err));
    }
  }
}


