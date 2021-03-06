import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { } from './tree.service';
import { BMNode, Link, BimodalConfig } from '../../models/bimodal.model';
import { makeCellTypes, makeAS, makeBioMarkers } from './tree.functions';
import { CT_BLUE, B_GREEN, TNode } from '../../models/tree.model';
import { UpdateBimodal, UpdateVegaSpec, UpdateLinksData } from '../../actions/tree.actions';
import { CloseLoading, HasError } from '../../actions/ui.actions';
import { ReportLog } from '../../actions/logs.actions';
import { LOG_TYPES, LOG_ICONS } from '../../models/logs.model';
import { Error } from '../../models/response.model';
import { Row, Sheet, SheetConfig } from '../../models/sheet.model';

@Injectable({
  providedIn: 'root'
})
export class BimodalService {

  constructor(private store: Store) { }

  async makeBimodalData(
    sheetData: Row[],
    treeData: TNode[],
    bimodalConfig: BimodalConfig,
    currentSheet: Sheet,
    sheetConfig?: SheetConfig
  ) {

    try {

      const anatomicalStructuresData = makeAS(sheetData);
      const links = [];
      const nodes = [];
      let treeX = 0;
      let treeY = 50;
      let AS_CT_LINKS = 0;
      let CT_BM_LINKS = 0;
      const distance = sheetConfig.bimodal_distance_x;
      const distanceY = sheetConfig.bimodal_distance_y;
      let id = treeData.length + 1;
      let biomarkers = [];

      treeData.forEach((td) => {
        if (td.children === 0) {

          const leaf = td.name;
          const newLeaf = new BMNode(leaf, 1, td.x, td.y - 5, 14, td.ontologyId);
          newLeaf.id = id;
          newLeaf.problem = td.problem;
          newLeaf.pathColor = td.pathColor;
          newLeaf.isNew = td.isNew;
          newLeaf.color = td.color;
          newLeaf.ontologyId = td.ontologyId;
          newLeaf.indegree = anatomicalStructuresData.find(a => a.structure === leaf).indegree;
          newLeaf.outdegree = anatomicalStructuresData.find(a => a.structure === leaf).outdegree;
          newLeaf.label = anatomicalStructuresData.find(a => a.structure === leaf).label;
          nodes.push(newLeaf);
          id += 1;
          treeX = td.x;
        }
      });


      // adding x distance to build the next layer of bimodal
      treeX += distance;

      // making group 2: cell type
      const cellTypes = await makeCellTypes(sheetData);

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
          cellTypes.sort((a, b) => {
            return (b.outdegree.size + b.indegree.size) - (a.outdegree.size + a.indegree.size);
          });
          break;
      }


      switch (bimodalConfig.CT.size) {
        case 'None':
          break;
        case 'Degree':
          cellTypes.forEach(c => { c.nodeSize = (c.indegree.size + c.outdegree.size) * 25; });
          break;
        case 'Indegree':
          cellTypes.forEach(c => { c.nodeSize = (c.indegree.size) * 25; });
          break;
        case 'Outdegree':
          cellTypes.forEach(c => { c.nodeSize = (c.outdegree.size) * 25; });
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
        newNode.color = cell.color;
        newNode.indegree = cell.indegree;
        newNode.outdegree = cell.outdegree;
        newNode.label = cell.label;
        newNode.references = cell.references;

        nodes.push(newNode);
        treeY += distanceY;
        id += 1;
      });

      treeY = distanceY;
      treeX += distance;

      biomarkers = await makeBioMarkers(sheetData);

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
          biomarkers.sort((a, b) => {
            return b.indegree.size - a.indegree.size;
          });
          break;
      }

      switch (bimodalConfig.BM.size) {
        case 'None':
          break;
        case 'Degree':
          biomarkers.forEach(b => { b.nodeSize += (b.indegree.size + b.outdegree.size) * 25; });
          break;
      }

      switch (bimodalConfig.BM.type) {
        case 'All':
          break;
        case 'Gene':
          biomarkers = biomarkers.filter(b => b.bType === 'gene');
          break;
        case 'Protein':
          biomarkers = biomarkers.filter(b => b.bType === 'protein');
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
        newNode.color = marker.color;
        newNode.indegree = marker.indegree;
        newNode.outdegree = marker.outdegree;
        newNode.bType = marker.bType;

        nodes.push(newNode);
        treeY += distanceY;
        id += 1;
      });


      nodes.forEach((node, i) => {
        if (node.group === 1) {
          node.sources = [];
          node.outdegree.forEach(str => {
            const foundIndex = nodes.findIndex(n => `${n.name}${n.ontologyId}` === str);
            node.targets.push(nodes[foundIndex].id);
            links.push({ s: node.id, t: nodes[foundIndex].id });
          });
        }

        if (node.group === 3) {
          node.indegree.forEach(str => {

            const foundIndex = nodes.findIndex(n => `${n.name}${n.ontologyId}` === str);
            node.sources.push(nodes[foundIndex].id);
            links.push({ s: nodes[foundIndex].id, t: node.id });
          });
        }
      });

      nodes.forEach((node, i) => {
        if (node.group === 2) {
          node.outdegree.forEach((str) => {
            const tt = nodes
              .map((val, idx) => ({ val, idx }))
              .filter(({ val, idx }) => `${val.name}${val.ontologyId}` === str)
              .map(({ val, idx }) => idx);
            const targets = [];
            tt.forEach((s) => {
              targets.push(nodes[s].id);
            });

            // make targets only if there is a link from CT to B
            targets.forEach((s) => {
              if (links.some((l) => l.s === node.id && l.t === s)) {
                CT_BM_LINKS += 1;
                node.targets.push(s);
              }
            });
          });

          // make sources only if there is a link from AS to CT
          node.indegree.forEach((str) => {
            const ss = nodes
              .map((val, idx) => ({ val, idx }))
              .filter(({ val, idx }) => `${val.name}${val.ontologyId}` === str)
              .map(({ val, idx }) => idx);
            const sources = [];
            ss.forEach((s) => {
              sources.push(nodes[s].id);
            });
            sources.forEach((s) => {
              if (links.some((l) => l.s === s && l.t === node.id)) {
                AS_CT_LINKS += 1;
                node.sources.push(s);
              }
            });
          });
        }
      });

      this.store.dispatch(new UpdateLinksData(AS_CT_LINKS, CT_BM_LINKS));

      this.store.dispatch(new UpdateBimodal(nodes, links)).subscribe(newData => {
        const view = newData.treeState.view;
        const updatedNodes = newData.treeState.bimodal.nodes;
        const updatedLinks = newData.treeState.bimodal.links;
        const spec = newData.treeState.spec;

        this.updateBimodalData(view, spec, updatedNodes, updatedLinks);
      });

    } catch (error) {
      console.log(error);
      const err: Error = {
        msg: `${error} (Status: ${error.status})`,
        status: error.status,
        hasError: true
      };
      this.store.dispatch(new ReportLog(LOG_TYPES.MSG, 'Failed to create Tree', LOG_ICONS.error));
      this.store.dispatch(new HasError(err));
    }

  }

  updateBimodalData(view: any, spec: any, nodes: BMNode[], links: Link[]) {
    view._runtime.signals.node__click.value = null; // removing clicked highlighted nodes if at all
    view._runtime.signals.sources__click.value = []; // removing clicked bold source nodes if at all
    view._runtime.signals.targets__click.value = [];
    view.data('nodes', nodes).data('edges', links).resize().runAsync();

    this.updateSpec(spec, nodes, links);
    // this.addSignalListeners(view);

    this.store.dispatch(new CloseLoading('Visualization Rendered'));
    this.store.dispatch(new ReportLog(LOG_TYPES.MSG, 'Visualization successfully rendered', LOG_ICONS.success));

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
        this.store.dispatch(new ReportLog(LOG_TYPES.NO_OUT_LINKS, node.name, LOG_ICONS.warning));
      }

      if (node.sources.length === 0 && node.group === 2) {
        this.store.dispatch(new ReportLog(LOG_TYPES.NO_IN_LINKS, node.name, LOG_ICONS.warning));
      }

      if (node.sources.length === 0 && node.group === 3) {
        this.store.dispatch(new ReportLog(LOG_TYPES.NO_IN_LINKS, node.name, LOG_ICONS.warning));
      }
    });
  }
}
