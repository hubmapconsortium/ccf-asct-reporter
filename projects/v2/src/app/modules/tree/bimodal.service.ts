import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {  } from './tree.service';
import { BMNode } from '../../models/bimodal.model';
import { makeCellDegree, makeMarkerDegree, makeCellTypes, makeAS, makeBioMarkers} from './tree.functions';
import { CT_BLUE, B_GREEN } from '../../models/tree.model';
import { UpdateBimodal } from '../../actions/tree.actions';
import { CloseLoading } from '../../actions/ui.actions';

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

    // console.log(sheetData, treeData)
    // return {}
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
        cellTypes = await makeCellDegree(
          sheetData,
          treeData,
          'Degree',
          currentSheet
        );
      } else {
        cellTypes = await makeCellDegree(
          sheetData,
          treeData,
          bimodalConfig.CT.size,
          currentSheet
        );
      }
    }

    if (bimodalConfig.CT.size !== 'None') {
      // put sort size by degree function here
      const tempCellTypes = await makeCellDegree(
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
      biomarkers = await makeMarkerDegree(sheetData, currentSheet);
    }

    if (bimodalConfig.BM.size === 'Degree') {
      const tempBiomarkers = await makeMarkerDegree(
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


    this.store.dispatch(new UpdateBimodal(nodes, links)).subscribe(newData => {
      const view  = newData.treeState.view;
      const u_nodes =  newData.treeState.bimodal.nodes;
      const u_links = newData.treeState.bimodal.links;

      this.updateBimodalData(view, u_nodes, u_links);
    });
  }

  updateBimodalData(view, nodes, links) {
      view._runtime.signals.node__click.value = null; // removing clicked highlighted nodes if at all
      view._runtime.signals.sources__click.value = []; // removing clicked bold source nodes if at all
      view._runtime.signals.targets__click.value = [];
      view.data('nodes', nodes).data('edges', links).resize().runAsync();

      this.store.dispatch(new CloseLoading('Visualization Rendered'));

  }
}
