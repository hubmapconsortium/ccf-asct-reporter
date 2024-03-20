import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Spec, ValuesData, View } from 'vega';
import { ReportLog } from '../../actions/logs.actions';
import {
  UpdateBimodal,
  UpdateLinksData,
  UpdateVegaSpec,
} from '../../actions/tree.actions';
import { CloseLoading, HasError } from '../../actions/ui.actions';
import { BMNode, BimodalConfig, Link } from '../../models/bimodal.model';
import { LOG_ICONS, LOG_TYPES } from '../../models/logs.model';
import { OmapConfig } from '../../models/omap.model';
import { Error } from '../../models/response.model';
import { PROTEIN_PRESENCE, Row, SheetConfig } from '../../models/sheet.model';
import { AS, B, B_GREEN, CT, CT_BLUE, TNode } from '../../models/tree.model';
import { TreeState } from '../../store/tree.state';
import { makeAS, makeBioMarkers, makeCellTypes } from './tree.functions';

@Injectable({
  providedIn: 'root',
})
export class BimodalService {
  constructor(private readonly store: Store) {}

  /**
   * Function to create the bimodal network
   * @param sheetData current sheet data
   * @param treeData data from the vega tree. the coordinates from the
   * last layer is used to create the CT layer
   * @param bimodalConfig bimodal configuration for x and y distances
   * @param sheetConfig sheet configuration for height and width
   */
  async makeBimodalData(
    sheetData: Row[],
    treeData: TNode[],
    bimodalConfig: BimodalConfig,
    isReport = false,
    sheetConfig?: SheetConfig,
    omapConfig?: OmapConfig,
    filteredProtiens?: string[]
  ) {
    try {
      filteredProtiens =
        filteredProtiens?.map((word) => word.toLowerCase()) ?? [];
      const anatomicalStructuresData = makeAS(sheetData);
      const links: { s: number; t: number; pathColor?: string }[] = [];
      const nodes: BMNode[] = [];
      let treeX = 0;
      let treeY = 50;
      let AS_CT_LINKS = 0;
      let CT_BM_LINKS = 0;
      const CT_BM: Record<string, number> = {};
      const AS_CT: Record<string, number> = {};
      const distance = sheetConfig?.bimodal_distance_x ?? 0;
      const distanceY = sheetConfig?.bimodal_distance_y ?? 0;
      let id = treeData.length + 1;
      let biomarkers = [];
      treeData.forEach((td) => {
        if (td.children === 0 || isReport) {
          const leaf = td.name;
          const newLeaf = new BMNode(
            leaf,
            1,
            td.x,
            td.y - 5,
            14,
            td.notes,
            td.organName,
            td.ontologyId
          );
          newLeaf.id = id;
          newLeaf.problem = td.problem;
          newLeaf.pathColor = td.pathColor;
          newLeaf.isNew = td.isNew;
          newLeaf.color = td.color;
          newLeaf.ontologyId = td.ontologyId;
          if (td.ontologyId && td.ontologyId.toLowerCase() !== 'not found') {
            newLeaf.indegree = anatomicalStructuresData.find((a: AS) => {
              return a.comparatorId === td.ontologyId;
            })?.indegree;
            newLeaf.outdegree = anatomicalStructuresData.find((a: AS) => {
              return a.comparatorId === td.ontologyId;
            })?.outdegree;
            newLeaf.label = anatomicalStructuresData.find((a: AS) => {
              return a.comparatorId === td.ontologyId;
            })?.label;
          } else {
            newLeaf.indegree = anatomicalStructuresData.find((a: AS) => {
              return a.comparatorName === td.name;
            })?.indegree;
            newLeaf.outdegree = anatomicalStructuresData.find((a: AS) => {
              return a.comparatorName === td.name;
            })?.outdegree;
            newLeaf.label = anatomicalStructuresData.find((a: AS) => {
              return a.comparatorName === td.name;
            })?.label;
          }
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
            return (
              (b.outdegree?.size ?? 0) +
              (b.indegree?.size ?? 0) -
              ((a.outdegree?.size ?? 0) + (a.indegree?.size ?? 0))
            );
          });
          break;
      }

      switch (bimodalConfig.CT.size) {
        case 'None':
          break;
        case 'Degree':
          cellTypes.forEach((c) => {
            c.nodeSize =
              ((c.indegree?.size ?? 0) + (c.outdegree?.size ?? 0)) * 25;
          });
          break;
        case 'Indegree':
          cellTypes.forEach((c) => {
            c.nodeSize = (c.indegree?.size ?? 0) * 25;
          });
          break;
        case 'Outdegree':
          cellTypes.forEach((c) => {
            c.nodeSize = (c.outdegree?.size ?? 0) * 25;
          });
          break;
      }

      cellTypes.forEach((cell: CT) => {
        const newNode = new BMNode(
          cell.structure,
          2,
          treeX,
          treeY,
          14,
          cell.notes,
          cell.organName,
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
      if (omapConfig?.proteinsOnly) {
        biomarkers = biomarkers.filter((elem) =>
          filteredProtiens?.includes(elem.comparatorName?.toLowerCase() ?? '')
        );
      }
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
            return (b.indegree?.size ?? 0) - (a.indegree?.size ?? 0);
          });
          break;
      }

      switch (bimodalConfig.BM.size) {
        case 'None':
          break;
        case 'Degree':
          biomarkers.forEach((b) => {
            b.nodeSize =
              (b.nodeSize ?? 0) +
              ((b.indegree?.size ?? 0) + (b.outdegree?.size ?? 0)) * 25;
          });
          break;
      }

      switch (bimodalConfig.BM.type) {
        case 'All':
          break;
        case 'Gene':
          biomarkers = biomarkers.filter((b) => b.bType === 'gene');
          break;
        case 'Protein':
          biomarkers = biomarkers.filter((b) => b.bType === 'protein');
          break;
        case 'Lipids':
          biomarkers = biomarkers.filter((b) => b.bType === 'lipids');
          break;
        case 'Metabolites':
          biomarkers = biomarkers.filter((b) => b.bType === 'metabolites');
          break;
        case 'Proteoforms':
          biomarkers = biomarkers.filter((b) => b.bType === 'proteoforms');
          break;
      }

      // making group 3: bio markers
      biomarkers.forEach((marker: B) => {
        const newNode = new BMNode(
          marker.structure,
          3,
          treeX,
          treeY,
          14,
          marker.notes,
          marker.organName,
          marker.link,
          B_GREEN,
          marker.nodeSize,
          marker.proteinPresence
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

      nodes.forEach((node) => {
        if (node.group === 1) {
          node.sources = [];
          node.outdegree?.forEach((str) => {
            let foundIndex: number;
            if (str.id && str.id.toLowerCase() !== 'not found') {
              foundIndex = nodes.findIndex(
                (i: BMNode) => i.ontologyId === str.id && i.group !== 1
              );
            } else {
              foundIndex = nodes.findIndex(
                (i: BMNode) => i.name === str.name && i.group !== 1
              );
            }
            if (
              node.targets.findIndex((l) => l === nodes[foundIndex].id) === -1
            ) {
              node.targets.push(nodes[foundIndex].id);
            }
            links.push({ s: node.id, t: nodes[foundIndex].id });
          });
        }

        if (node.group === 3) {
          node.indegree?.forEach((str) => {
            let pathColor = '';
            let foundIndex: number;
            if (str.id) {
              foundIndex = nodes.findIndex(
                (i: BMNode) => i.ontologyId === str.id
              );
            } else {
              foundIndex = nodes.findIndex((i: BMNode) => i.name === str.name);
            }
            if (
              node.sources.findIndex((l) => l === nodes[foundIndex].id) === -1
            ) {
              node.sources.push(nodes[foundIndex].id);
            }
            nodes[foundIndex].outdegree?.forEach((cellOut) => {
              if (cellOut.name === node.name) {
                if (cellOut.proteinPresence === PROTEIN_PRESENCE.POS) {
                  pathColor = '#00008B';
                } else if (cellOut.proteinPresence === PROTEIN_PRESENCE.NEG) {
                  pathColor = '#E16156';
                } else if (
                  cellOut.proteinPresence === PROTEIN_PRESENCE.INTERMEDIATE
                ) {
                  pathColor = '#4B2079';
                }
              }
            });
            links.push({ s: nodes[foundIndex].id, t: node.id, pathColor });
          });
        }
      });

      nodes.forEach((node: BMNode) => {
        if (node.group === 2) {
          node.outdegree?.forEach((str) => {
            const tt = nodes
              .map((val, idx) => ({ val, idx }))
              .filter(({ val }) => {
                if (str.id) {
                  return val.ontologyId === str.id;
                } else {
                  return val.name === str.name;
                }
              })
              .map(({ idx }) => idx);
            const targets: number[] = [];
            tt.forEach((s) => {
              targets.push(nodes[s].id);
            });

            // make targets only if there is a link from CT to B
            targets.forEach((s) => {
              if (links.some((l) => l.s === node.id && l.t === s)) {
                if (node.targets.findIndex((l) => l === s) === -1) {
                  if (
                    Object.prototype.hasOwnProperty.call(CT_BM, node.organName)
                  ) {
                    CT_BM[node.organName] += 1;
                  } else {
                    CT_BM[node.organName] = 1;
                  }
                  CT_BM_LINKS += 1;
                  node.targets.push(s);
                }
              }
            });
          });
          // make sources only if there is a link from AS to CT
          node.indegree?.forEach((str) => {
            const ss = nodes
              .map((val, idx) => ({ val, idx }))
              .filter(({ val }) => {
                if (str.id && str.id.toLowerCase() !== 'not found') {
                  return val.ontologyId === str.id;
                } else {
                  return val.name === str.name;
                }
              })
              .map(({ idx }) => idx);
            const sources: number[] = [];
            ss.forEach((s) => {
              sources.push(nodes[s].id);
            });
            sources.forEach((s) => {
              if (links.some((l) => l.s === s && l.t === node.id)) {
                if (node.sources.findIndex((l) => l === s) === -1) {
                  if (
                    Object.prototype.hasOwnProperty.call(AS_CT, node.organName)
                  ) {
                    AS_CT[node.organName] += 1;
                  } else {
                    AS_CT[node.organName] = 1;
                  }
                  AS_CT_LINKS += 1;
                  node.sources.push(s);
                }
              }
            });
          });
        }
      });

      if (!isReport) {
        this.store.dispatch(
          new UpdateLinksData(AS_CT_LINKS, CT_BM_LINKS, AS_CT, CT_BM)
        );

        this.store.dispatch(new UpdateBimodal(nodes, links)).subscribe(() => {
          const state = this.store.selectSnapshot(TreeState);
          const view = TreeState.getVegaView(state);
          const updatedNodes = state.bimodal.nodes;
          const updatedLinks = state.bimodal.links;
          const spec = state.spec;
          this.updateBimodalData(view, spec, updatedNodes, updatedLinks);
        });
      } else {
        this.store.dispatch(
          new UpdateLinksData(
            AS_CT_LINKS,
            CT_BM_LINKS,
            AS_CT,
            CT_BM,
            0,
            undefined,
            true
          )
        );
      }
    } catch (error) {
      console.log(error);
      const status = (error as { status: number }).status;
      const err: Error = {
        msg: `${error} (Status: ${status})`,
        status: status,
        hasError: true,
      };
      this.store.dispatch(
        new ReportLog(LOG_TYPES.MSG, 'Failed to create Tree', LOG_ICONS.error)
      );
      this.store.dispatch(new HasError(err));
    }
  }

  /**
   * Function to reset the signals and data of the visualization
   *
   * @param view vega view
   * @param spec vega spec
   * @param nodes bimodal network nodes
   * @param links bimodal network links
   */
  updateBimodalData(view: View, spec: Spec, nodes: BMNode[], links: Link[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyView: any = view;
    anyView._runtime.signals.node__click.value = null; // removing clicked highlighted nodes if at all
    anyView._runtime.signals.sources__click.value = []; // removing clicked bold source nodes if at all
    anyView._runtime.signals.targets__click.value = [];
    view.data('nodes', nodes).data('edges', links).resize().runAsync();

    this.updateSpec(spec, nodes, links);

    this.store.dispatch(new CloseLoading('Visualization Rendered'));
    this.store.dispatch(
      new ReportLog(
        LOG_TYPES.MSG,
        'Visualization successfully rendered',
        LOG_ICONS.success
      )
    );
  }

  /**
   * Function to update the spec with bimodal data
   *
   * @param spec vega spec
   * @param nodes bimodal network nodes
   * @param links bimodal network links
   */
  updateSpec(spec: Spec, nodes: BMNode[], links: Link[]) {
    const data = spec.data ?? [];
    const nodeData = data[
      data.findIndex((i) => i.name === 'nodes')
    ] as ValuesData;
    const edgeData = data[
      data.findIndex((i) => i.name === 'edges')
    ] as ValuesData;
    nodeData.values = nodes;
    edgeData.values = links;

    this.store.dispatch(new UpdateVegaSpec(spec));
  }
}
