import { Injectable } from '@angular/core';
import { makeCellDegree, makeMarkerDegree, Cell, Marker, makeCellTypes, makeAS, makeBioMarkers} from './tree.functions';
import { Store } from '@ngxs/store';
import { updateVegaSpec, updateBimodal } from '../../actions/sheet.actions';
import { VegaService } from './vega.service';
import * as vega from 'vega'

export class TNode {
  id: any;
  name: string;
  parent: string;
  uberonId: string;
  color: string;
  problem: boolean;
  found: boolean;
  groupName: string;
  isNew: boolean;
  pathColor: string;
  parents: Array<number>;

  constructor(id, name, parent, uId, color = '#808080') {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.uberonId = uId;
    this.color = color;
    this.problem = false;
    this.groupName = 'Multi-parent Nodes';
    this.isNew = false;
    this.pathColor = '#ccc';
    this.parents = [];
  }
}

export class TreeAndMultiParent {
  tree: Array<TNode>;
  multiParentLinks: any;

}

const CT_BLUE = '#377EB8';
const B_GREEN = '#4DAF4A';
const groupNameMapper = {
  1: 'Anatomical Structures',
  2: 'Cell Types',
  3: 'Biomarkers',
};

export class BMNode {
  name: string;
  group: number;
  groupName: string;
  fontSize: number;
  x: number;
  y: number;
  id: number;
  color: string;
  nodeSize: number;
  targets: Array<number>;
  sources: Array<number>;
  uberonId: string;
  problem: boolean;
  pathColor: string;
  isNew: boolean;

  constructor(
    name,
    group,
    x,
    y,
    fontSize,
    uberonId = '',
    color = '#E41A1C',
    nodeSize = 300
  ) {
    this.name = name;
    this.group = group;
    this.fontSize = fontSize;
    this.x = x;
    this.y = y;
    this.color = color;
    this.nodeSize = nodeSize === 0 ? 50 : nodeSize;
    this.targets = [];
    this.sources = [];
    this.groupName = groupNameMapper[group];
    this.uberonId = uberonId;
    this.pathColor = '#ccc';
    this.isNew = false;
  }
}

export interface Link {
  s: number;
  t: number;
}

export interface DD {
  name: string;
}
export interface ASCTD {
  nodes: Array<BMNode>;
  links: Array<Link>;
  compareDD?: Array<DD>;
  searchIds?: Array<number>;
}

// Used in the tree visualization
export class Tree {
  nodes: Array<TNode>;
  id: any;

  constructor(id) {
    this.nodes = [];
    this.id = id;
  }

  public append(node) {
    this.nodes.push(node);
  }

  public search(name, nodeParent) {
    for (const i in this.nodes) {
      if (this.nodes[i].name === name) {
        const parent = this.nodes.findIndex(n => n.name === nodeParent.name);
        if (this.nodes[parent].id !== this.nodes[i].parent) {
          if (!this.nodes[i].parents.includes(this.nodes[parent].id) && this.nodes[parent].id !== 1) {
            this.nodes[i].parents.push(this.nodes[parent].id);
          }

          this.nodes[i].problem = true;
        }
        this.nodes[i].found = true;
        return this.nodes[i];
      }
    }
    const emptyNode = new TNode(0, '', 0, '');
    emptyNode.found = false;
    return emptyNode;
  }
}

const AS_RED = '#E41A1C';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  makeCellDegree = makeCellDegree;
  makeMarkerDegree = makeMarkerDegree;

  constructor(public store: Store, public vs: VegaService) { }

  public makeTreeData(currentSheet, data, compareData?: any){

    // return new Promise(async (res, rej) => {

      for (const sheet of compareData) {
        for (const row of sheet.data) {
          data.push(row);
        }
      }

      const linkData = [];
      const cols = currentSheet.tree_cols;
      const id = 1;
      let parent;
      const tree = new Tree(id);
      const uberon_col = currentSheet.uberon_col;

      const root = new TNode(id, currentSheet.body, 0, 0, AS_RED);
      delete root.parent; delete root.uberonId;
      tree.append(root);

      try {
        data.forEach(row => {
          parent = root;
          for (const col in cols) {

            if (row[cols[col]] === '') {
              continue;
            }

            if (row[cols[col]].startsWith('//')) {
              continue;
            }

            const foundNodes = row[cols[col]].trim().split();
            for (const i in foundNodes) {
              if (foundNodes[i] !== '') {
                const searchedNode = tree.search(foundNodes[i], parent);
                searchedNode.pathColor = row[row.length - 1];

                if (searchedNode.found) {
                  if (searchedNode.problem) {
                    if (currentSheet.name !== 'ao') {
                      if (!searchedNode.parents.includes(searchedNode.id)) {
                        // this.report.reportLog(`Nodes with multiple in-links`, 'warning', 'multi', searchedNode.name);
                      }
                    }
                  }
                  parent = searchedNode;
                } else {
                  tree.id += 1;
                  const uberon =  row[cols[col] + uberon_col] !== foundNodes[i] ? row[cols[col] + uberon_col] : 'NONE';
                  const newNode = new TNode(tree.id, foundNodes[i], parent.id, uberon, AS_RED);
                  newNode.isNew = row[row.length - 2];
                  if (newNode.isNew) {
                    newNode.color = row[row.length - 1];
                    newNode.pathColor = row[row.length - 1];
                  }
                  tree.append(newNode);
                  parent = newNode;
                }
              }
            }
          }
        });
      } catch (err) {
        console.log('Could not process tree data');
      }

      if (tree.nodes.length < 0) {
        console.log('Could not process tree data');
      }

      for (const node of tree.nodes) {
        if (node.problem) {
          for (const p of node.parents) {
            if (p === node.id) {
              // this.report.reportLog(`Nodes with self-links`, 'warning', 'multi', node.name);
            }
            linkData.push({
              s: p,
              t: node.id
            });
          }
        }
      }
      
      const spec = this.vs.makeVegaConfig(currentSheet, currentSheet.config.bimodal_distance, 1000, 2000, tree.nodes, linkData)
      // this.store.dispatch(new updateVegaSpec(spec))
      this.vs.renderGraph(spec)
      
      // const bimodal = this.makeASCTData()

      
  }

  async makeASCTData(
    sheetData,
    treeData,
    bimodalConfig,
    currentSheet,
    compareData = []
  ) {
    // this.partonomyTreeData = treeData;

    // console.log(sheetData, treeData)
    // return {}
    let ASCTGraphData: ASCTD;
    const links = [];
    const nodes = [];
    let treeX = 0;
    let treeY = 50;
    const distance = currentSheet.config.bimodal_distance;
    let id = treeData.length + 1;
    let biomarkers = [];

    for (const sheet of compareData) {
      for (const row of sheet.data) {
        sheetData.push(row);
      }
    }

    // making anatomical structures (last layer of the tree)
    treeData.forEach((td) => {
      if (td.children === 0) {
        const leaf = td.name;
        const newLeaf = new BMNode(leaf, 1, td.x, td.y - 5, 14, td.uberonId);
        newLeaf.id = id;
        newLeaf.problem = td.problem;
        newLeaf.pathColor = td.pathColor;
        newLeaf.isNew = td.isNew;
        newLeaf.color = td.color;
        nodes.push(newLeaf);
        id += 1;
        treeX = td.x;
      }
    });

    // adding x distance to build the next layer of bimodal
    treeX += distance;

    // making group 2: cell type
    let cellTypes = [];

    // sorting cells based on options
    if (bimodalConfig.CT.sort === 'Alphabetically') {
      cellTypes = await makeCellTypes(sheetData, {
        report_cols: currentSheet.report_cols,
        cell_col: currentSheet.cell_col,
        uberon_col: currentSheet.uberon_col,
        marker_col: currentSheet.marker_col,
      });
      cellTypes.sort((a, b) => {
        return a.structure.toLowerCase() > b.structure.toLowerCase()
          ? 1
          : b.structure.toLowerCase() > a.structure.toLowerCase()
          ? -1
          : 0;
      });
    } else {
      if (bimodalConfig.CT.size === 'None') {
        cellTypes = await this.makeCellDegree(
          sheetData,
          treeData,
          'Degree',
          currentSheet
        );
      } else {
        cellTypes = await this.makeCellDegree(
          sheetData,
          treeData,
          bimodalConfig.CT.size,
          currentSheet
        );
      }
    }

    if (bimodalConfig.CT.size !== 'None') {
      // put sort size by degree function here
      const tempCellTypes = await this.makeCellDegree(
        sheetData,
        treeData,
        bimodalConfig.CT.size,
        currentSheet
      );
      cellTypes.forEach((c) => {
        const idx = tempCellTypes.findIndex(
          (i) => i.structure.toLowerCase() === c.structure.toLowerCase()
        );
        if (idx !== -1) {
          c.nodeSize = tempCellTypes[idx].parents.length * 75;
        } else {
          // this.report.reportLog(
          //   `Parent not found for cell - ${c.structure}`,
          //   'warning',
          //   'msg'
          // );
        }
      });
    }

    cellTypes.forEach((cell) => {
      const newNode = new BMNode(
        cell.structure,
        2,
        treeX,
        treeY,
        14,
        cell.link,
        CT_BLUE,
        cell.nodeSize
      );
      newNode.id = id;
      newNode.isNew = cell.isNew;
      newNode.pathColor = cell.color;

      if (newNode.isNew) {
        newNode.color = cell.color;
      }
      nodes.push(newNode);
      treeY += 50;
      id += 1;
    });

    treeY = 50;
    treeX += distance;

    // based on select input, sorting markers
    if (bimodalConfig.BM.sort === 'Alphabetically') {
      biomarkers = await makeBioMarkers(sheetData, {
        marker_col: currentSheet.marker_col,
        uberon_col: currentSheet.uberon_col
      });
      biomarkers.sort((a, b) => {
        return a.structure.toLowerCase() > b.structure.toLowerCase()
          ? 1
          : b.structure.toLowerCase() > a.structure.toLowerCase()
          ? -1
          : 0;
      });
    } else {
      biomarkers = await this.makeMarkerDegree(sheetData, currentSheet);
    }

    if (bimodalConfig.BM.size === 'Degree') {
      const tempBiomarkers = await this.makeMarkerDegree(
        sheetData,
        currentSheet
      );
      biomarkers.forEach((b) => {
        const idx = tempBiomarkers.findIndex(
          (i) => i.structure === b.structure
        );
        if (idx !== -1) {
          b.nodeSize = tempBiomarkers[idx].parents.length * 75;
        } else {
          // this.report.reportLog(
          //   `Parent not found for biomarker - ${b.structure}`,
          //   'warning',
          //   'msg'
          // );
        }
      });
    }

    // making group 3: bio markers
    biomarkers.forEach((marker, i) => {
      const newNode = new BMNode(
        biomarkers[i].structure,
        3,
        treeX,
        treeY,
        14,
        biomarkers[i].link,
        B_GREEN,
        biomarkers[i].nodeSize
      );
      newNode.id = id;
      newNode.isNew = marker.isNew;
      newNode.pathColor = marker.color;

      if (newNode.isNew) {
        newNode.color = marker.color;
      }
      nodes.push(newNode);
      treeY += 40;
      id += 1;
    });

    // AS to CT
    let parent = 0;

    for (const i in treeData) {
      if (treeData[i].children === 0) {
        parent = nodes.findIndex(
          (r) => r.name.toLowerCase() === treeData[i].name.toLowerCase()
        );

        sheetData.forEach((row) => {
          for (const j in row) {
            if (row[j] === treeData[i].name) {
              const cells = row[currentSheet.cell_col].split(',');
              for (const c in cells) {
                if (cells[c] !== '') {
                  const found = nodes.findIndex(
                    (r) =>
                      r.name.toLowerCase().trim() ===
                      cells[c].toLowerCase().trim()
                  );

                  if (found !== -1) {
                    if (nodes[parent].targets.indexOf(nodes[found].id) === -1) {
                      nodes[parent].targets.push(nodes[found].id);
                    }
                    if (nodes[found].sources.indexOf(nodes[parent].id) === -1) {
                      nodes[found].sources.push(nodes[parent].id);
                    }

                    nodes[found].pathColor = nodes[parent].pathColor;
                    // nodes[found].isNew = nodes[parent].isNew;

                    if (!links.some((n) => n.s === nodes[parent].id && n.t === nodes[found].id)) {
                      links.push({
                        s: nodes[parent].id,
                        t: nodes[found].id,
                      });
                    }
                  }
                }
              }
            }
          }
        });
      }
    }

    // CT to B
    sheetData.forEach((row) => {
      const markers = row[currentSheet.marker_col].trim().split(',');
      const cells = row[currentSheet.cell_col].trim().split(',');

      for (const c in cells) {
        if (cells[c] !== '') {
          const cell = nodes.findIndex(
            (r) => r.name.toLowerCase().trim() === cells[c].toLowerCase().trim()
          );

          if (cell !== -1) {
            for (const m in markers) {
              if (markers[m] !== '') {
                const marker = nodes.findIndex(
                  (r) =>
                    r.name.toLowerCase().trim() ===
                    markers[m].toLowerCase().trim()
                );
                if (!links.some((n) => n.s === nodes[cell].id && n.t === nodes[marker].id)) {
                  if (nodes[cell].targets.indexOf(nodes[marker].id) === -1) {
                    nodes[cell].targets.push(nodes[marker].id);
                  }
                  if (nodes[marker].sources.indexOf(nodes[cell].id) === -1) {
                    nodes[marker].sources.push(nodes[cell].id);
                  }
                  nodes[marker].pathColor = nodes[cell].pathColor;

                  links.push({
                    s: nodes[cell].id,
                    t: nodes[marker].id,
                  });
                }
              }
            }
          }
        }
      }
    });

    ASCTGraphData = {
      nodes,
      links,
    };
    
    this.store.dispatch(new updateBimodal(nodes, links)).subscribe(newData => {
      console.log('NEW DATA ', newData.treeState)
      const view  = newData.treeState.view
      const nodes =  newData.treeState.bimodal.nodes
      const links = newData.treeState.bimodal.links

      this.updateBimodalData(view, nodes, links)
    })
    // this.asctData = ASCTGraphData;

    // this.report.checkLinks(ASCTGraphData.nodes); // check for missing links to submit to the Log
    // return ASCTGraphData;
  }

  updateBimodalData(view, nodes, links) {
      view._runtime.signals.node__click.value = null; // removing clicked highlighted nodes if at all
      view._runtime.signals.sources__click.value = []; // removing clicked bold source nodes if at all
      view._runtime.signals.targets__click.value = [];

      view.data('nodes', nodes).data('edges', links).resize().runAsync()
      
      
      // view
      // .change(
      //   'nodes',
      //   vega.changeset().remove([]).insert(nodes)
      // )
      // .runAsync();
      // view
      // .change(
      //   'edges',
      //   vega.changeset().remove([]).insert(links)
      // )
      // .runAsync();
  
  }
}


