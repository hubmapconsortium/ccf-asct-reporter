import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ValuesData } from 'vega';
import { ReportLog } from '../../actions/logs.actions';
import { UpdateLinksData, UpdateVegaSpec } from '../../actions/tree.actions';
import { HasError } from '../../actions/ui.actions';
import { LOG_ICONS, LOG_TYPES } from '../../models/logs.model';
import { Error } from '../../models/response.model';
import { Row, Sheet, SheetConfig } from '../../models/sheet.model';
import { SheetState } from '../../store/sheet.state';
import { TreeState, TreeStateModel } from '../../store/tree.state';
import { UIState, UIStateModel } from '../../store/ui.state';
import { AS_RED, NODE_TYPE, TNode } from './../../models/tree.model';
import { BimodalService } from './bimodal.service';
import { VegaService } from './vega.service';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  /**
   * Height of the tree
   */
  height!: number;
  /**
   * Denotes if the left control pane is open
   */
  controlPaneOpen!: boolean;
  /**
   * Sheet configurations that has the different parameters
   */
  sheetConfig!: SheetConfig;

  /**
   * Tree State observable
   */
  @Select(TreeState) tree$!: Observable<TreeStateModel>;

  /**
   * UI State observable
   */
  @Select(UIState) uiState$!: Observable<UIStateModel>;

  /**
   * Sheet state - sheet config observable
   */
  @Select(SheetState.getSheetConfig) sc$!: Observable<SheetConfig>;

  constructor(
    public readonly store: Store,
    public readonly vs: VegaService,
    public readonly bm: BimodalService
  ) {
    this.tree$.subscribe((state) => {
      this.height = state.height;
      const view = TreeState.getVegaView(state);

      // if the vega view is valid, check for search data
      // re-render the view
      if (Object.keys(view).length) {
        const search = state.search;
        view.data('search', search);
        view.runAsync();
      }

      // if the vega view is valid, check for discrepency Labels data
      // re-render the view
      if (Object.keys(view).length) {
        const discrepency = state.discrepencyLabel;
        view.data('discrepencyLabel', discrepency);
        view.runAsync();
      }

      // if the vega view is valid, check for discrepency Ids data
      // re-render the view
      if (Object.keys(view).length) {
        const discrepency = state.discrepencyId;
        view.data('discrepencyId', discrepency);
        view.runAsync();
      }

      // if the vega view is valid, check for duplicate Ids data
      // re-render the view
      if (Object.keys(view).length) {
        const discrepency = state.duplicateId;
        view.data('duplicateId', discrepency);
        view.runAsync();
      }
    });
    this.uiState$.subscribe((state) => {
      this.controlPaneOpen = state.controlPaneOpen;
    });

    this.sc$.subscribe((config) => {
      this.sheetConfig = config;
    });
  }

  /**
   * Function to create the vega tree that visualization the
   * Anatomical structures and its substructures
   *
   * @param currentSheet current selected sheet
   * @param data data from the miner of the sheet
   * @param compareData compare data (depricated)
   */
  public makeTreeData(
    currentSheet: Sheet,
    data: Row[],
    _compareData?: unknown,
    isReport = false
  ): void {
    try {
      const idNameSet: Record<string, string> = {};
      let id = 1;
      let parent: TNode;
      const nodes: TNode[] = [];
      const allParentIds = new Set();
      const root = new TNode(
        id,
        data[0].anatomical_structures[0].name ?? '',
        0,
        data[0].anatomical_structures[0].id ?? '',
        data[0].anatomical_structures[0].notes ?? '',
        'Body',
        AS_RED
      );
      root.label = '';
      root.comparator = root.name + root.label + root.ontologyId;
      root.type = NODE_TYPE.R;
      delete (root as { parent?: unknown }).parent;
      nodes.push(root);
      let flag = 0;
      const AS_AS_organWise: Record<string, number> = {};

      data.forEach((row) => {
        parent = root;
        row.anatomical_structures.forEach((structure) => {
          let s: number;
          if (structure.id) {
            s = nodes.findIndex((i: TNode) => {
              if (!isReport) {
                return (
                  i.type !== 'root' &&
                  i.comparatorId === parent.comparatorId + structure.id
                );
              } else {
                return (
                  i.type !== 'root' &&
                  i.comparatorId === parent.comparatorId + structure.id &&
                  i.organName === row.organName
                );
              }
            });
          } else {
            s = nodes.findIndex((i: TNode) => {
              if (!isReport) {
                return (
                  i.type !== 'root' &&
                  i.comparatorName === parent.comparatorName + structure.name
                );
              } else {
                return (
                  i.type !== 'root' &&
                  i.comparatorName === parent.comparatorName + structure.name &&
                  i.organName === row.organName
                );
              }
            });
          }
          if (s === -1) {
            if (
              Object.prototype.hasOwnProperty.call(
                AS_AS_organWise,
                row?.organName
              ) &&
              flag >= 2
            ) {
              AS_AS_organWise[row?.organName] += 1;
            } else {
              flag += 1;
              AS_AS_organWise[row?.organName] = 1;
            }
            id += 1;
            const newNode = new TNode(
              id,
              structure.id && idNameSet[structure.id]
                ? idNameSet[structure.id]
                : structure.name ?? '',
              parent.id,
              structure.id ?? '',
              structure.notes ?? '',
              row.organName,
              AS_RED
            );
            newNode.label = structure.rdfs_label ?? '';
            newNode.comparator =
              parent.comparator +
              newNode.name +
              newNode.label +
              newNode.ontologyId;
            newNode.comparatorId = parent.comparatorId + newNode.ontologyId;
            newNode.comparatorName = parent.comparatorName + newNode.name;
            if (idNameSet[newNode.ontologyId] === undefined) {
              idNameSet[newNode.ontologyId] = newNode.name;
            }
            if ('isNew' in structure) {
              newNode.isNew = true;
              newNode.color = structure.color ?? '';
              newNode.pathColor = structure.color ?? '';
            }

            nodes.push(newNode);
            allParentIds.add(parent.id);
            parent = newNode;
          } else {
            const node = nodes[s];
            if ('isNew' in structure) {
              node.color = structure.color ?? '';
              node.pathColor = structure.color ?? '';
            }
            parent = node;
          }
        });
      });

      // delete duplicate organ element
      nodes.shift();
      delete (nodes[0] as { parent?: unknown }).parent;

      const spec = this.vs.makeVegaConfig(
        currentSheet,
        nodes,
        this.sheetConfig
      );
      allParentIds.delete(1);
      const allParentIdsArray = [...allParentIds];
      if (!isReport) {
        this.store.dispatch(
          new UpdateLinksData(0, 0, {}, {}, 0, AS_AS_organWise)
        );
        this.store.dispatch(new UpdateVegaSpec(spec));
        this.vs.renderGraph(spec);
      } else {
        this.store.dispatch(
          new UpdateLinksData(0, 0, {}, {}, 0, AS_AS_organWise)
        );
        this.bm.makeBimodalData(
          data,
          ((spec.data?.[0] as ValuesData).values as TNode[]).filter(
            (x) => !allParentIdsArray.includes(x.id)
          ),
          this.store.selectSnapshot(TreeState.getBimodalConfig),
          true,
          this.store.selectSnapshot(SheetState.getSheetConfig)
        );
      }
    } catch (error) {
      console.log(error);
      const error2 = error as { name: string; status: number };
      const err: Error = {
        msg: `${error2.name} (Status: ${error2.status})`,
        status: error2.status,
        hasError: true,
      };
      this.store.dispatch(
        new ReportLog(LOG_TYPES.MSG, 'Failed to create Tree', LOG_ICONS.error)
      );
      this.store.dispatch(new HasError(err));
    }
  }
}
