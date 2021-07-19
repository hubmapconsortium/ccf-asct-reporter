/* tslint:disable:variable-name */
import { GraphData, GNode, Node_type } from '../models/graph.model';
import { Row } from '../models/api.model';

export function buildgraphAS(data: Row[], graphData: GraphData) {
  let id = -1;
  let parent: GNode;
  const root = new GNode(
    id,
    data[0].anatomical_structures[0].name,
    0,
    data[0].anatomical_structures[0].id,
    data[0].anatomical_structures[0].rdfs_label,
    Node_type.R
  );
  root.comparator = root.metadata.name;
  root.comparatorName = root.metadata.name;
  root.comparatorId = root.metadata.ontologyId;
  delete root.parent;
  graphData.nodes.push(root);

  data.forEach((row: Row) => {
    parent = root;

    row.anatomical_structures.forEach((structure) => {
      let s: number;
      if (structure.id) {
        s = graphData.nodes.findIndex(
          (i: any) =>
            i.type !== 'root' &&
            i.comparatorId === parent.comparatorId + structure.id
        );
      } else {
        s = graphData.nodes.findIndex(
          (i: any) =>
            i.type !== 'root' &&
            i.comparatorName === parent.comparatorName + structure.name
        );
      }
      if (s === -1) {
        id += 1;
        const newNode = new GNode(
          id,
          structure.name,
          parent.id,
          structure.id,
          structure.rdfs_label,
          Node_type.AS
        );
        newNode.comparatorName = parent.comparatorName + newNode.metadata.name;
        newNode.comparatorId =
          parent.comparatorId + newNode.metadata.ontologyId;

        graphData.nodes.push(newNode);
        graphData.edges.push({ source: parent.id, target: id });
        parent = newNode;
      } else {
        const node = graphData.nodes[s];
        parent = node;
      }
    });
  });
  graphData.nodes.shift();
  delete graphData.nodes[0].parent;
  return id;
}
export function buildgraphCT(data: Row[], graphData: GraphData, id: number) {
  data.forEach((row: Row) => {
    const parentIndex = graphData.nodes.findIndex(
      (i: any) =>
        i.metadata.name ===
        row.anatomical_structures[row.anatomical_structures.length - 1].name
    );
    if (parentIndex !== -1) {
      const parent = graphData.nodes[parentIndex];

      row.cell_types.forEach((structure) => {
        let s: number;
        if (structure.id) {
          s = graphData.nodes.findIndex(
            (i: any) => i.comparatorId === structure.id
          );
        } else {
          s = graphData.nodes.findIndex(
            (i: any) => i.comparatorName === structure.name
          );
        }
        if (s === -1) {
          id += 1;
          const newNode = new GNode(
            id,
            structure.name,
            parent.id,
            structure.id,
            structure.rdfs_label,
            Node_type.CT
          );
          newNode.comparatorName = newNode.metadata.name;
          newNode.comparatorId = newNode.metadata.ontologyId;

          graphData.nodes.push(newNode);
          graphData.edges.push({ source: parent.id, target: id });
        } else {
          graphData.edges.push({
            source: parent.id,
            target: graphData.nodes[s].id,
          });
        }
      });
    }
  });
  return id;
}

export function buildgraphBM(data: Row[], graphData: GraphData, id: number) {
  data.forEach((row: Row) => {
    row.cell_types.forEach((structure) => {
      const parentIndex = graphData.nodes.findIndex(
        (i: any) => i.metadata.name === structure.name
      );
      if (parentIndex !== -1) {
        const parent = graphData.nodes[parentIndex];

        row.biomarkers.forEach((biomarker) => {
          let s: number;
          if (structure.id) {
            s = graphData.nodes.findIndex(
              (i: any) => i.comparatorId === biomarker.id
            );
          } else {
            s = graphData.nodes.findIndex(
              (i: any) => i.comparatorName === biomarker.name
            );
          }
          if (s === -1) {
            id += 1;
            const newNode = new GNode(
              id,
              biomarker.name,
              parent.id,
              biomarker.id,
              biomarker.rdfs_label,
              Node_type.BM
            );
            newNode.comparatorName = newNode.metadata.name;
            newNode.comparatorId = newNode.metadata.ontologyId;
            graphData.nodes.push(newNode);
            graphData.edges.push({ source: parent.id, target: id });
          } else {
            graphData.edges.push({
              source: parent.id,
              target: graphData.nodes[s].id,
            });
          }
        });
      }
    });
  });
  return id;
}

export function makeGraphData(data: any) {
  const graphData: GraphData = { nodes: [], edges: [] };

  for (const row of data) {
    const organ: any = {
      name: 'Body',
      id: 'UBERON:0013702',
      rdfs_label: 'body proper',
    };
    row.anatomical_structures.unshift(organ);
  }

  let id = buildgraphAS(data, graphData);
  id = buildgraphCT(data, graphData, id);
  buildgraphBM(data, graphData, id);
  graphData.edges.shift();
  graphData.nodes.forEach((node: GNode) => {
    delete node.parent;
    delete node.comparatorName;
    delete node.comparatorId;
    delete node.comparator;
  });

  return graphData;
}
