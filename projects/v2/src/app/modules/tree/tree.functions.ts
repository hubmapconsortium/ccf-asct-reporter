import {
  AS,
  CT,
  B,
  AS_RED,
  CT_BLUE,
  B_GREEN,
  ST_ID,
} from '../../models/tree.model';
import { Row, Structure } from '../../models/sheet.model';
type TypeStructue = AS | CT | B;

/**
 * Function to compute the Anatomical Structures from the given Data Table.
 *
 * @param data - Sheet data
 * @returns - Array of anatomical structures
 *
 */
export function makeAS(data: Row[], isForReport = false): Array<AS> {
  const anatomicalStructures: Array<AS> = [];
  let id = ST_ID;
  try {
    data.forEach((row) => {
      row.anatomical_structures.forEach((str, i) => {
        if (
          i === row.anatomical_structures.length - 1 ||
          (isForReport && str.name !== 'Body')
        ) {
          const foundIndex = getFoundIndex(str, anatomicalStructures, isForReport, row);
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
              comparatorId: str.id,
              comparatorName: str.name,
              label: str.rdfs_label,
              id,
              organName: row.organName,
            };
            id += 1;

            if (row.cell_types.length) {
              row.cell_types.forEach((cell) => {
                newStructure.outdegree.add({
                  id: cell.id,
                  name: cell.name,
                });
              });
            }
            if (i > 0) {
              // needed for the first element to not throw an error

              newStructure.indegree.add({
                id: row.anatomical_structures[i - 1].id,
                name: row.anatomical_structures[i - 1].name,
              });
            }

            anatomicalStructures.push(newStructure);
          } else {
            if (row.cell_types.length) {
              row.cell_types.forEach((cell) => {
                anatomicalStructures[foundIndex].outdegree.add({
                  id: cell.id,
                  name: cell.name,
                });
              });
            }
            if (i > 0) {
              anatomicalStructures[foundIndex].indegree.add({
                id: row.anatomical_structures[i - 1].id,
                name: row.anatomical_structures[i - 1].name,
              });
            }
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
export function makeCellTypes(data: Row[], isForReport = false): Array<CT> {
  const cellTypes = [];
  try {
    data.forEach((row) => {
      row.cell_types.forEach((str) => {
        const foundIndex = getFoundIndex(str, cellTypes, isForReport, row);
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
            comparatorId: str.id,
            comparatorName: str.name,
            label: str.rdfs_label,
            references: row.references,
            organName: row.organName,
          };

          if (row.anatomical_structures.length > 0) {
            const sn =
              row.anatomical_structures[row.anatomical_structures.length - 1]
                .name;
            const sid =
              row.anatomical_structures[row.anatomical_structures.length - 1]
                .id;
            newStructure.indegree.add({
              id: sid,
              name: sn,
            });
          }

          // calculate outdegree (CT -> B)
          row.biomarkers.forEach((marker) => {
            newStructure.outdegree.add({
              id: marker.id,
              name: marker.name,
            });
          });
          cellTypes.push(newStructure);
        } else {
          if ('isNew' in str) {
            cellTypes[foundIndex].color = str.color;
            cellTypes[foundIndex].pathColor = str.color;
          }
          row.biomarkers.forEach((marker) => {
            cellTypes[foundIndex].outdegree.add({
              id: marker.id,
              name: marker.name,
            });
          });
          const sn =
            row.anatomical_structures[row.anatomical_structures.length - 1]
              .name;
          const sid =
            row.anatomical_structures[row.anatomical_structures.length - 1].id;

          cellTypes[foundIndex].indegree.add({
            id: sid,
            name: sn,
          });
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
export function makeBioMarkers(
  data: Row[],
  type?: string,
  isForReport = false
): Array<B> {
  const bioMarkers = [];
  try {
    data.forEach((row) => {
      let currentBiomarkers = [];
      switch (type) {
      case 'All':
        currentBiomarkers = row.biomarkers;
        break;
      case 'Gene':
        currentBiomarkers = row.biomarkers_gene;
        break;
      case 'Protein':
        currentBiomarkers = row.biomarkers_protein;
        break;
      case 'Lipids':
        currentBiomarkers = row.biomarkers_lipids;
        break;
      case 'Metalloids':
        currentBiomarkers = row.biomarkers_meta;
        break;
      case 'Proteoforms':
        currentBiomarkers = row.biomarkers_prot;
        break;
      default:
        currentBiomarkers = row.biomarkers;
      }
      currentBiomarkers.forEach((str) => {
        const foundIndex = getFoundIndex(str, bioMarkers, isForReport, row);
        let newStructure: B;
        if (foundIndex === -1) {
          newStructure = {
            structure: str.name,
            link: str.id,
            isNew: 'isNew' in str ? true : false,
            color: 'isNew' in str ? str.color : B_GREEN,
            outdegree: new Set(),
            indegree: new Set(),
            comparator: `${str.name}${str.id}`,
            comparatorId: str.id,
            comparatorName: str.name,
            nodeSize: 300,
            bType: str.b_type,
            organName: row.organName,
          };

          if (row.cell_types.length) {
            row.cell_types.forEach((cell) => {
              newStructure.indegree.add({
                id: cell.id,
                name: cell.name,
              });
            });
          }

          bioMarkers.push(newStructure);
        } else {
          if ('isNew' in str) {
            bioMarkers[foundIndex].color = str.color;
            bioMarkers[foundIndex].pathColor = str.color;
          }
          if (row.cell_types.length) {
            row.cell_types.forEach((cell) => {
              bioMarkers[foundIndex].indegree.add({
                id: cell.id,
                name: cell.name,
              });
            });
          }
        }
      });
    });
    return bioMarkers;
  } catch (error) {
    throw new Error(`Could not process Biomarkers - ${error}`);
  }
}

/**
 * Function to compute or find the index of the given object in the given array.
 *
 * @param str - Structure of the object
 * @param typeData - Array of structures to search in Anatomical Structures or Cell Types or Biomarkers
 * @param isForReport - Flag to indicate if the object is for report or not
 * @param row - Row of the sheet
 * @returns - Index of the object in the array
 */
function getFoundIndex(str: Structure, typeData: Array<TypeStructue>, isForReport: boolean, row: Row) {
  let foundIndex: number;
  if (str.id  && str.id.toLowerCase() !== 'not found') {
    foundIndex = typeData.findIndex((i: TypeStructue) => {
      if (!isForReport) {
        return i.comparatorId === str.id;
      } else {
        return i.comparatorId === str.id && i.organName === row.organName;
      }
    });
  } else {
    foundIndex = typeData.findIndex((i: TypeStructue) => {
      if (!isForReport) {
        return i.comparatorName === str.name;
      } else {
        return (
          i.comparatorName === str.name && i.organName === row.organName
        );
      }
    });
  }
  return foundIndex;
}
