import {AS, CT, B, AS_RED, CT_BLUE, B_GREEN, ST_ID } from '../../models/tree.model';
import { Row } from '../../models/sheet.model';


/**
 * Function to compute the Anatomical Structures from the given Data Table.
 *
 * @param data - Sheet data
 * @returns - Array of anatomical structures
 *
 */
export function makeAS(data: Row[]): Array<AS> {
  const anatomicalStructures: Array<AS> = [];
  let id = ST_ID;
  try {
    data.forEach(row => {
      row.anatomical_structures.forEach((str, i) => {
        const foundIndex = anatomicalStructures.findIndex(a => a.comparator === str.name + str.id);
        let newStructure: AS;
        if (foundIndex === -1) {
          newStructure = {
            structure: str.name,
            uberon: str.id,
            isNew: 'isNew' in str ? true : false,
            color: 'isNew' in str ? str.color : AS_RED,
            outdegree: new Set(),
            indegree: new Set(),
            comparator: str.name + str.id,
            label: str.rdfs_label,
            id
          };
          id += 1;

          if (row.cell_types.length) { newStructure.outdegree.add(`${row.cell_types[0].name}${row.cell_types[0].id}`); }
          if (i > 0) {
            // needed for the first element to not throw an error
            newStructure.indegree.add(row.anatomical_structures[i - 1].name);
          }

          anatomicalStructures.push(newStructure);
        } else {
          if (row.cell_types.length) {
            anatomicalStructures[foundIndex].outdegree.add(`${row.cell_types[0].name}${row.cell_types[0].id}`);
          }
          if (i > 0) {
            anatomicalStructures[foundIndex].indegree.add(row.anatomical_structures[i - 1].name);
          }
        }

      });
    });

    return anatomicalStructures;
  } catch (error) {
    throw new Error(`Could not process Anatomical Structures - ${error}`);
  }
}


/**
 * Function to compute the Cell Types from the given Data Table.
 *
 * @param data - Sheet data
 * @returns - Array of cell types
 */
export function makeCellTypes(data: Row[]): Array<CT> {
  const cellTypes = [];
  try {
    data.forEach(row => {
      row.cell_types.forEach(str => {
        const foundIndex = cellTypes.findIndex(cell => cell.comparator === (str.name + str.id));
        let newStructure: CT;
        if (foundIndex === -1) {
          newStructure = {
            structure: str.name,
            link: str.id,
            isNew: 'isNew' in str ? true : false,
            color: 'isNew' in str ? str.color : CT_BLUE,
            outdegree: new Set(),
            indegree: new Set(),
            comparator: `${str.name}${str.id}`,
            label: str.rdfs_label
          };

          if (row.anatomical_structures.length > 0) {
            const sn = row.anatomical_structures[row.anatomical_structures.length - 1].name;
            const sid = row.anatomical_structures[row.anatomical_structures.length - 1].id;
            newStructure.indegree.add(sn + sid);
          }

          // calculate outdegree (CT -> B)
          row.biomarkers.forEach(marker => {
            newStructure.outdegree.add(marker.name + marker.id);
          });
          cellTypes.push(newStructure);
        } else {
          if ('isNew' in str) {
            cellTypes[foundIndex].color = str.color;
            cellTypes[foundIndex].pathColor = str.color;
          }
          row.biomarkers.forEach(marker => {
            cellTypes[foundIndex].outdegree.add(marker.name + marker.id);
          });
          const sn = row.anatomical_structures[row.anatomical_structures.length - 1].name;
          const sid = row.anatomical_structures[row.anatomical_structures.length - 1].id;

          cellTypes[foundIndex].indegree.add(`${sn}${sid}`);
        }


      });

    });

    return cellTypes;
  } catch (error) {
    throw new Error(`Could not process Cell Types - ${error}`);
  }
}
/**
 * Function to compute the Cell Types from the given Data Table.
 *
 * @param data - Sheet data
 * @returns - Array of biomarkers
 */
export function makeBioMarkers(data: Row[]): Array<B> {
  const bioMarkers = [];
  try {
    data.forEach(row => {
      row.biomarkers.forEach(str => {
        const foundIndex = bioMarkers.findIndex(i => i.structure === str.name);
        let newStructure: B;
        if (foundIndex === -1) {
          newStructure = {
            structure: str.name,
            link: str.id,
            isNew: 'isNew' in str ? true : false,
            color: 'isNew' in str ? str.color : B_GREEN,
            outdegree: new Set(),
            indegree: new Set(),
            nodeSize: 300,
            bType: str.bType
          };

          if (row.cell_types.length) {
            newStructure.indegree.add(`${row.cell_types[0].name}${row.cell_types[0].id}`);
          }

          bioMarkers.push(newStructure);
        } else {
          if ('isNew' in str) {
            bioMarkers[foundIndex].color = str.color;
            bioMarkers[foundIndex].pathColor = str.color;
          }
          if (row.cell_types.length) {
            bioMarkers[foundIndex].indegree.add(`${row.cell_types[0].name}${row.cell_types[0].id}`);
          }
        }
      });
    });

    return bioMarkers;

  } catch (error) {
    throw new Error(`Could not process Biomarkers - ${error}`);
  }

}
