import { Injectable } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { VegaService } from './vega.service';
import {AS_RED, TNode, NODE_TYPE} from './../../models/tree.model';
import { TreeState, TreeStateModel } from '../../store/tree.state';
import { Observable } from 'rxjs';
import { validateWidth } from '../../static/util';
import { UIState, UIStateModel } from '../../store/ui.state';
import { ReportLog } from '../../actions/logs.actions';
import { LOG_TYPES, LOG_ICONS } from '../../models/logs.model';
import { UpdateVegaSpec } from '../../actions/tree.actions';
import { Sheet } from '../../models/sheet.model';

// Used in the tree visualization
// export class Tree {
//   nodes: Array<TNode>;
//   id: any;

//   constructor(id) {
//     this.nodes = [];
//     this.id = id;
//   }

//   public append(node) {
//     this.nodes.push(node);
//   }

//   public search(name, nodeParent) {
//     for (const i in this.nodes) {
//       if (this.nodes[i].name === name) {
//         const parent = this.nodes.findIndex(n => n.name === nodeParent.name);
//         if (this.nodes[parent].id !== this.nodes[i].parent) {
//           if (!this.nodes[i].parents.includes(this.nodes[parent].id) && this.nodes[parent].id !== 1) {
//             this.nodes[i].parents.push(this.nodes[parent].id);
//           }

//           this.nodes[i].problem = true;
//         }
//         this.nodes[i].found = true;
//         return this.nodes[i];
//       }
//     }
//     const emptyNode = new TNode(0, '', 0, '');
//     emptyNode.found = false;
//     return emptyNode;
//   }
// }


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

  public makeTreeData(currentSheet: Sheet, data, compareData?: any){

    
    let id = 1;
    const linkData = [];
    let parent: TNode;
    const nodes = []
    const root = new TNode(id, data[0].anatomical_structures[0].name, 0, '', AS_RED);
    root.comparator = root.name + root.ontology_id
    root.type = NODE_TYPE.R;
    delete root.parent;
    nodes.push(root);

    data.forEach(row => {
      parent = root;
      
      row.anatomical_structures.forEach(structure => {
        
        let s = nodes.findIndex(i => i.type !== 'root' && i.comparator === (parent.comparator + structure.name + structure.id));
        if(s === -1) {
          id += 1
          const newNode = new TNode(id, structure.name, parent.id, structure.id, AS_RED);
          newNode.comparator = parent.comparator + newNode.name + newNode.ontology_id;
          nodes.push(newNode);
          parent = newNode;
        } else {
          let node = nodes[s];
          // const nodeParent = nodes.findIndex(n => n.name == parent.name);
          // if (nodeParent !== -1 && nodes[nodeParent].id !== node.parent) {
          //   console.log(node, )
          //   if (!node.parents.includes(node[nodeParent].id) && nodes[nodeParent].id !== 1) {
          //     node.parents.push(nodes[nodeParent].id)
          //   }
          //   node.problem = true
          // }

          parent = node;
        }
      })
    });

    // delete duplicate organ element
    nodes.shift()
    delete nodes[0].parent
    
    try {
      console.log('TS:', currentSheet)
        const spec = this.vs.makeVegaConfig(currentSheet, currentSheet.config.bimodal_distance, this.height, validateWidth(this.screenWidth, this.controlPaneOpen), nodes, linkData);
        this.store.dispatch(new UpdateVegaSpec(spec));
        this.vs.renderGraph(spec);
      } catch(err) {
        console.log(err)
      }








      // for (const sheet of compareData) {
      //   for (const row of sheet.data) {
      //     data.push(row);
      //   }
      // }

      // const linkData = [];
      // const cols = currentSheet.tree_cols;
      // const id = 1;
      // let parent;
      // const tree = new Tree(id);
      // const uberon_col = currentSheet.uberon_col;

      // const root = new TNode(id, currentSheet.body, 0, 0, AS_RED);
      // delete root.parent; delete root.ontology_id;
      // tree.append(root);

      // try {
      //   data.forEach(row => {
      //     parent = root;
      //     for (const col in cols) {

      //       if (row[cols[col]] === '') {
      //         continue;
      //       }

      //       if (row[cols[col]].startsWith('//')) {
      //         continue;
      //       }

      //       const foundNodes = row[cols[col]].trim().split();
      //       for (const i in foundNodes) {
      //         if (foundNodes[i] !== '') {
      //           const searchedNode = tree.search(foundNodes[i], parent);
      //           searchedNode.pathColor = row[row.length - 1];

      //           if (searchedNode.found) {
      //             if (searchedNode.problem) {
      //               if (currentSheet.name !== 'ao') {
      //                 if (!searchedNode.parents.includes(searchedNode.id)) {
      //                   this.store.dispatch(new ReportLog(LOG_TYPES.MULTI_IN_LINKS, searchedNode.name, LOG_ICONS.warning))
      //                   // this.report.reportLog(`Nodes with multiple in-links`, 'warning', 'multi', searchedNode.name);
      //                 }
      //               }
      //             }
      //             parent = searchedNode;
      //           } else {
      //             tree.id += 1;
      //             const uberon =  row[cols[col] + uberon_col] !== foundNodes[i] ? row[cols[col] + uberon_col] : 'NONE';
      //             const newNode = new TNode(tree.id, foundNodes[i], parent.id, uberon, AS_RED);
      //             newNode.isNew = row[row.length - 2];
      //             if (newNode.isNew) {
      //               newNode.color = row[row.length - 1];
      //               newNode.pathColor = row[row.length - 1];
      //             }
      //             tree.append(newNode);
      //             parent = newNode;
      //           }
      //         }
      //       }
      //     }
      //   });
      // } catch (err) {
      //   console.log('Could not process tree data');
      // }

      // if (tree.nodes.length < 0) {
      //   console.log('Could not process tree data');
      // }

      // for (const node of tree.nodes) {
      //   if (node.problem) {
      //     for (const p of node.parents) {
      //       if (p === node.id) {
      //         this.store.dispatch(new ReportLog(LOG_TYPES.SELF_LINKS, node.name, LOG_ICONS.warning))
      //         // this.report.reportLog(`Nodes with self-links`, 'warning', 'multi', node.name);
      //       }
      //       linkData.push({
      //         s: p,
      //         t: node.id
      //       });
      //     }
      //   }
      // }

      // try {
      //   const spec = this.vs.makeVegaConfig(currentSheet, currentSheet.config.bimodal_distance, this.height, validateWidth(this.screenWidth, this.controlPaneOpen), tree.nodes, linkData);
      //   this.store.dispatch(new UpdateVegaSpec(spec));
      //   this.vs.renderGraph(spec);
      // } catch(err) {
      //   console.log(err)
      // }
  }
}


