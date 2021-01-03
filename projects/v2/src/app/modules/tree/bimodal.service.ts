import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { } from './tree.service';
import { BMNode, Link } from '../../models/bimodal.model';
import { makeCellDegree, makeMarkerDegree, makeCellTypes, makeAS, makeBioMarkers } from './tree.functions';
import { CT_BLUE, B_GREEN } from '../../models/tree.model';
import { UpdateBimodal, UpdateVegaSpec } from '../../actions/tree.actions';
import { CloseLoading, HasError } from '../../actions/ui.actions';
import { ReportLog } from '../../actions/logs.actions';
import { LOG_TYPES, LOG_ICONS } from '../../models/logs.model';
import { Error } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class BimodalService {

  constructor(private store: Store) { }

  async makeBimodalData(
    sheetData,
    treeData,
    bimodalConfig,
    currentSheet,
    compareData = []
  ) {

    
    // this.partonomyTreeData = treeData;
    let anatomicalStructuresData = await makeAS(sheetData)
    // let ASCTGraphData: ASCTD;
    const links = [];
    const nodes = [];
    let treeX = 0;
    let treeY = 50;
    const distance = currentSheet.config.bimodal_distance;
    let id = treeData.length + 1;
    let biomarkers = [];


    treeData.forEach((td) => {
      if (td.children === 0) {
        const leaf = td.name;
        const newLeaf = new BMNode(leaf, 1, td.x, td.y - 5, 14, td.ontology_id);
        newLeaf.id = id;
        newLeaf.problem = td.problem;
        newLeaf.pathColor = td.pathColor;
        newLeaf.isNew = td.isNew;
        newLeaf.color = td.color;
        newLeaf.ontology_id = anatomicalStructuresData.find(a => a.structure === leaf).uberon
        newLeaf.indegree = anatomicalStructuresData.find(a => a.structure === leaf).indegree
        newLeaf.outdegree = anatomicalStructuresData.find(a => a.structure === leaf).outdegree
        newLeaf.label = anatomicalStructuresData.find(a => a.structure === leaf).label
        nodes.push(newLeaf);
        id += 1;
        treeX = td.x;
      }
    });
    

    // adding x distance to build the next layer of bimodal
    treeX += distance;

    // making group 2: cell type
    let cellTypes  = await makeCellTypes(sheetData, {
          report_cols: currentSheet.report_cols,
          cell_col: currentSheet.cell_col,
          uberon_col: currentSheet.uberon_col,
          marker_col: currentSheet.marker_col,
        });

    switch (bimodalConfig.CT.sort) {
      case 'Alphabetically':
        cellTypes.sort((a, b) => {
          return a.structure.toLowerCase() > b.structure.toLowerCase()
            ? 1
            : b.structure.toLowerCase() > a.structure.toLowerCase()
              ? -1
              : 0;
        });
        break;
      
      case 'Degree':
        cellTypes.sort((a,b) => {
          return  (b.outdegree.size + b.indegree.size) - (a.outdegree.size + a.indegree.size)
        })
      break;
    }


    switch(bimodalConfig.CT.size) {
      case 'None':
        break;
      case 'Degree':
        console.log('here')
        cellTypes.forEach(c => {console.log(c); c.nodeSize = (c.indegree.size + c.outdegree.size) * 25 })
        break;
      case 'Indegree':
        cellTypes.forEach(c => {c.nodeSize = (c.indegree.size) * 25})
        break;
      case 'Outdegree':
        cellTypes.forEach(c => {c.nodeSize = (c.outdegree.size) * 25})
        break;

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
      newNode.indegree = cell.indegree;
      newNode.outdegree = cell.outdegree;
      newNode.label = cell.label;

      if (newNode.isNew) {
        newNode.color = cell.color;
      }
      nodes.push(newNode);
      treeY += 60;
      id += 1;
    });

    treeY = 60;
    treeX += distance;

    biomarkers = await makeBioMarkers(sheetData, {
      marker_col: currentSheet.marker_col,
      uberon_col: currentSheet.uberon_col
    });

    switch (bimodalConfig.BM.sort) {
      case 'Alphabetically':
        biomarkers.sort((a, b) => {
          return a.structure.toLowerCase() > b.structure.toLowerCase()
            ? 1
            : b.structure.toLowerCase() > a.structure.toLowerCase()
              ? -1
              : 0;
        });
        break;
      
      case 'Degree':
        biomarkers.sort((a,b) => {
          return  b.indegree.size - a.indegree.size
        })
      break;
    }

    switch(bimodalConfig.BM.size) {
      case 'None':
        break;
      case 'Degree':
        biomarkers.forEach(b => {b.nodeSize += (b.indegree.size + b.outdegree.size) * 25})
        break;
    }


    // making group 3: bio markers
    biomarkers.forEach((marker, i) => {
      const newNode = new BMNode(
        marker.structure,
        3,
        treeX,
        treeY,
        14,
        marker.link,
        B_GREEN,
        marker.nodeSize
      );
      newNode.id = id;
      newNode.isNew = marker.isNew;
      newNode.pathColor = marker.color;
      newNode.indegree = marker.indegree;
      newNode.outdegree = marker.outdegree;

      if (newNode.isNew) {
        newNode.color = marker.color;
      }
      nodes.push(newNode);
      treeY += 50;
      id += 1;
    });


    nodes.forEach((node, i) => {
      if (node.group == 1) {
        node.sources = [];
        node.outdegree.forEach(str => {
          let foundIndex = nodes.findIndex(i => `${i.name}${i.ontology_id}` === str)
          node.targets.push(nodes[foundIndex].id)
          links.push({s: node.id, t: nodes[foundIndex].id})
        })
      }

      if (node.group == 3) {
        node.indegree.forEach(str => {
          let foundIndex = nodes.findIndex(i => i.name === str)
          node.sources.push(nodes[foundIndex].id)
          links.push({s: nodes[foundIndex].id,t: node.id})
        }) 
      }
    })

    nodes.forEach((node, i) => {
      if (node.group == 2) {
        node.outdegree.forEach(str => {
          let tt = nodes.map((val, idx) => ({val, idx})).filter(({val, idx})=> `${val.name}${val.ontology_id}` === str).map(({val, idx}) => idx)
          let targets =[]
          tt.forEach(s => {targets.push(nodes[s].id)})
          
          // make targets only if there is a link from CT to B
          targets.forEach(s => {
            if (links.some(i => i.s === node.id && i.t === s)) {
              node.targets.push(s)
            }
          })
        })
          
         // make sources only if there is a link from AS to CT
        node.indegree.forEach(str => {

          let ss = nodes.map((val, idx) => ({val, idx})).filter(({val, idx})=>`${val.name}${val.ontology_id}`=== str).map(({val, idx}) => idx)
          let sources =[]
          ss.forEach(s => {sources.push(nodes[s].id)})
          sources.forEach(s => {
            if (links.some(i => i.s === s && i.t === node.id)) {
              node.sources.push(s)
            }
          })
        })
      }
    })

    console.log(nodes)
    
  this.store.dispatch(new UpdateBimodal(nodes, links)).subscribe(newData => {
        const view = newData.treeState.view;
        const u_nodes = newData.treeState.bimodal.nodes;
        const u_links = newData.treeState.bimodal.links;
        const spec = newData.treeState.spec;
        
        this.updateBimodalData(view, spec, u_nodes, u_links);
      });

    // try {
    //   const links = [];
    //   const nodes = [];
    //   let treeX = 0;
    //   let treeY = 50;
    //   const distance = currentSheet.config.bimodal_distance;
    //   let id = treeData.length + 1;
    //   let biomarkers = [];

    //   for (const sheet of compareData) {
    //     for (const row of sheet.data) {
    //       sheetData.push(row);
    //     }
    //   }

    //   // making anatomical structures (last layer of the tree)
    //   treeData.forEach((td) => {
    //     if (td.children === 0) {
    //       const leaf = td.name;
    //       const newLeaf = new BMNode(leaf, 1, td.x, td.y - 5, 14, td.ontology_id);
    //       newLeaf.id = id;
    //       newLeaf.problem = td.problem;
    //       newLeaf.pathColor = td.pathColor;
    //       newLeaf.isNew = td.isNew;
    //       newLeaf.color = td.color;
    //       nodes.push(newLeaf);
    //       id += 1;
    //       treeX = td.x;
    //     }
    //   });

    //   // adding x distance to build the next layer of bimodal
    //   treeX += distance;

    //   // making group 2: cell type
    //   let cellTypes = [];

    //   // sorting cells based on options
    //   if (bimodalConfig.CT.sort === 'Alphabetically') {
    //     cellTypes = await makeCellTypes(sheetData, {
    //       report_cols: currentSheet.report_cols,
    //       cell_col: currentSheet.cell_col,
    //       uberon_col: currentSheet.uberon_col,
    //       marker_col: currentSheet.marker_col,
    //     });
    //     cellTypes.sort((a, b) => {
    //       return a.structure.toLowerCase() > b.structure.toLowerCase()
    //         ? 1
    //         : b.structure.toLowerCase() > a.structure.toLowerCase()
    //           ? -1
    //           : 0;
    //     });
    //   } else {
    //     if (bimodalConfig.CT.size === 'None') {
    //       cellTypes = await makeCellDegree(
    //         sheetData,
    //         treeData,
    //         'Degree',
    //         currentSheet
    //       );
    //     } else {
    //       cellTypes = await makeCellDegree(
    //         sheetData,
    //         treeData,
    //         bimodalConfig.CT.size,
    //         currentSheet
    //       );
    //     }
    //   }

    //   if (bimodalConfig.CT.size !== 'None') {
    //     // put sort size by degree function here
    //     const tempCellTypes = await makeCellDegree(
    //       sheetData,
    //       treeData,
    //       bimodalConfig.CT.size,
    //       currentSheet
    //     );
    //     cellTypes.forEach((c) => {
    //       const idx = tempCellTypes.findIndex(
    //         (i) => i.structure.toLowerCase() === c.structure.toLowerCase()
    //       );
    //       if (idx !== -1) {
    //         c.nodeSize = tempCellTypes[idx].parents.length * 75;
    //       } else {
    //         this.store.dispatch(new ReportLog(LOG_TYPES.MSG, `Parent not found for cell - ${c.structure}`, LOG_ICONS.warning));

    //         // this.report.reportLog(
    //         //   `Parent not found for cell - ${c.structure}`,
    //         //   'warning',
    //         //   'msg'
    //         // );
    //       }
    //     });
    //   }

    //   cellTypes.forEach((cell) => {
    //     const newNode = new BMNode(
    //       cell.structure,
    //       2,
    //       treeX,
    //       treeY,
    //       14,
    //       cell.link,
    //       CT_BLUE,
    //       cell.nodeSize
    //     );
    //     newNode.id = id;
    //     newNode.isNew = cell.isNew;
    //     newNode.pathColor = cell.color;

    //     if (newNode.isNew) {
    //       newNode.color = cell.color;
    //     }
    //     nodes.push(newNode);
    //     treeY += 50;
    //     id += 1;
    //   });

    //   treeY = 50;
    //   treeX += distance;

    //   // based on select input, sorting markers
    //   if (bimodalConfig.BM.sort === 'Alphabetically') {
    //     biomarkers = await makeBioMarkers(sheetData, {
    //       marker_col: currentSheet.marker_col,
    //       uberon_col: currentSheet.uberon_col
    //     });
    //     biomarkers.sort((a, b) => {
    //       return a.structure.toLowerCase() > b.structure.toLowerCase()
    //         ? 1
    //         : b.structure.toLowerCase() > a.structure.toLowerCase()
    //           ? -1
    //           : 0;
    //     });
    //   } else {
    //     biomarkers = await makeMarkerDegree(sheetData, currentSheet);
    //   }

    //   if (bimodalConfig.BM.size === 'Degree') {
    //     const tempBiomarkers = await makeMarkerDegree(
    //       sheetData,
    //       currentSheet
    //     );
    //     biomarkers.forEach((b) => {
    //       const idx = tempBiomarkers.findIndex(
    //         (i) => i.structure === b.structure
    //       );
    //       if (idx !== -1) {
    //         b.nodeSize = tempBiomarkers[idx].parents.length * 75;
    //       } else {
    //         this.store.dispatch(new ReportLog(LOG_TYPES.MSG, `Parent not found for biomarker - ${b.structure}`, LOG_ICONS.warning));
    //         // this.report.reportLog(
    //         //   `Parent not found for biomarker - ${b.structure}`,
    //         //   'warning',
    //         //   'msg'
    //         // );
    //       }
    //     });
    //   }

    //   // making group 3: bio markers
    //   biomarkers.forEach((marker, i) => {
    //     const newNode = new BMNode(
    //       biomarkers[i].structure,
    //       3,
    //       treeX,
    //       treeY,
    //       14,
    //       biomarkers[i].link,
    //       B_GREEN,
    //       biomarkers[i].nodeSize
    //     );
    //     newNode.id = id;
    //     newNode.isNew = marker.isNew;
    //     newNode.pathColor = marker.color;

    //     if (newNode.isNew) {
    //       newNode.color = marker.color;
    //     }
    //     nodes.push(newNode);
    //     treeY += 40;
    //     id += 1;
    //   });

    //   // AS to CT
    //   let parent = 0;

    //   for (const i in treeData) {
    //     if (treeData[i].children === 0) {
    //       parent = nodes.findIndex(
    //         (r) => r.name.toLowerCase() === treeData[i].name.toLowerCase()
    //       );

    //       sheetData.forEach((row) => {
    //         for (const j in row) {
    //           if (row[j] === treeData[i].name) {
    //             const cells = row[currentSheet.cell_col].split(',');
    //             for (const c in cells) {
    //               if (cells[c] !== '') {
    //                 const found = nodes.findIndex(
    //                   (r) =>
    //                     r.name.toLowerCase().trim() ===
    //                     cells[c].toLowerCase().trim()
    //                 );

    //                 if (found !== -1) {
    //                   if (nodes[parent].targets.indexOf(nodes[found].id) === -1) {
    //                     nodes[parent].targets.push(nodes[found].id);
    //                   }
    //                   if (nodes[found].sources.indexOf(nodes[parent].id) === -1) {
    //                     nodes[found].sources.push(nodes[parent].id);
    //                   }

    //                   nodes[found].pathColor = nodes[parent].pathColor;
    //                   // nodes[found].isNew = nodes[parent].isNew;

    //                   if (!links.some((n) => n.s === nodes[parent].id && n.t === nodes[found].id)) {
    //                     links.push({
    //                       s: nodes[parent].id,
    //                       t: nodes[found].id,
    //                     });
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       });
    //     }
    //   }

    //   // CT to B
    //   sheetData.forEach((row) => {
    //     const markers = row[currentSheet.marker_col].trim().split(',');
    //     const cells = row[currentSheet.cell_col].trim().split(',');

    //     for (const c in cells) {
    //       if (cells[c] !== '') {
    //         const cell = nodes.findIndex(
    //           (r) => r.name.toLowerCase().trim() === cells[c].toLowerCase().trim()
    //         );

    //         if (cell !== -1) {
    //           for (const m in markers) {
    //             if (markers[m] !== '') {
    //               const marker = nodes.findIndex(
    //                 (r) =>
    //                   r.name.toLowerCase().trim() ===
    //                   markers[m].toLowerCase().trim()
    //               );
    //               if (!links.some((n) => n.s === nodes[cell].id && n.t === nodes[marker].id)) {
    //                 if (nodes[cell].targets.indexOf(nodes[marker].id) === -1) {
    //                   nodes[cell].targets.push(nodes[marker].id);
    //                 }
    //                 if (nodes[marker].sources.indexOf(nodes[cell].id) === -1) {
    //                   nodes[marker].sources.push(nodes[cell].id);
    //                 }
    //                 nodes[marker].pathColor = nodes[cell].pathColor;

    //                 links.push({
    //                   s: nodes[cell].id,
    //                   t: nodes[marker].id,
    //                 });
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   });


    //   this.store.dispatch(new UpdateBimodal(nodes, links)).subscribe(newData => {
    //     const view = newData.treeState.view;
    //     const u_nodes = newData.treeState.bimodal.nodes;
    //     const u_links = newData.treeState.bimodal.links;
    //     const spec = newData.treeState.spec;
        
    //     this.updateBimodalData(view, spec, u_nodes, u_links);
    //   });
    // } catch(err) {
    //   console.log(err)
    //   const error: Error = {
    //     hasError: true,
    //     msg: err,
    //     status: 500,
    //   }

    //   this.store.dispatch(new HasError(error))
    // }
  }

  updateBimodalData(view: any, spec: any, nodes: BMNode[], links: Link[]) {
    view._runtime.signals.node__click.value = null; // removing clicked highlighted nodes if at all
    view._runtime.signals.sources__click.value = []; // removing clicked bold source nodes if at all
    view._runtime.signals.targets__click.value = [];
    view.data('nodes', nodes).data('edges', links).resize().runAsync();

    this.updateSpec(spec, nodes, links);
    // this.addSignalListeners(view);
    
    this.store.dispatch(new CloseLoading('Visualization Rendered'));
    this.store.dispatch(new ReportLog(LOG_TYPES.MSG, 'Visualization successfully rendered', LOG_ICONS.success))

  }

  

  updateSpec(spec: any, nodes: BMNode[], links: Link[]) {
    spec.data[
      spec.data.findIndex((i) => i.name === 'nodes')
    ].values = nodes;
    spec.data[
      spec.data.findIndex((i) => i.name === 'edges')
    ].values = links;

    this.store.dispatch(new UpdateVegaSpec(spec));
  }

  checkLinks(data) {
    data.forEach(node => {
      if (node.targets.length === 0 && node.group === 2) {
        this.store.dispatch(new ReportLog(LOG_TYPES.NO_OUT_LINKS, node.name, LOG_ICONS.warning))
      }

      if (node.sources.length === 0 && node.group === 2) {
        this.store.dispatch(new ReportLog(LOG_TYPES.NO_IN_LINKS, node.name, LOG_ICONS.warning))
      }

      if (node.sources.length === 0 && node.group === 3) {
        this.store.dispatch(new ReportLog(LOG_TYPES.NO_IN_LINKS, node.name, LOG_ICONS.warning))
      }
    });
  }
}
