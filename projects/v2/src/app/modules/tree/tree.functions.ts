import { Marker, Cell, AS, ASCTBConfig, CT, B } from '../../models/tree.model';


  /**
   * Function to compute the Anatomical Structures from the given Data Table.
   *
   * @param data - Sheet data
   * @param config - Configurations that consist of the following params,
   *   1. report_cols - The cols that are to be considered to form the data. This includes AS, and CT col numbers.
   *   2. cell_col - The column number in which the cell types are present.
   *   3. marker_col - The column number in which the biomarkers are present.
   *   4. uberon_col - The number of columns after which the uberon column can be found.
   *
   * @returns - Array of anatomical structures
   *
   */
export function makeAS(
  data: any,
  config?
): Promise<Array<AS>> {
  return new Promise((res, rej) => {
    const anatomicalStructures: Array<AS> = [];
    // const cols = config.report_cols;

    // let newData = outputData.data
    data.forEach(row => {
      row.anatomical_structures.forEach((str, i) => {
        let foundIndex = anatomicalStructures.findIndex(i => i.comparator === str.name + str.id);
        let newStructure: AS;
        if (foundIndex === -1) {
          newStructure = {
            structure: str.name,
            uberon: str.id,
            outdegree: new Set(),
            indegree: new Set(),
            comparator: str.name + str.id,
            label: str.rdfs_label
          }

          if (row.cell_types.length) newStructure.outdegree.add(`${row.cell_types[0].name}${row.cell_types[0].id}`);
          if (i > 0) {
            // needed for the first element to not throw an error
            newStructure.indegree.add(row.anatomical_structures[i - 1].name);
          }
          
          anatomicalStructures.push(newStructure)
        } else {
          if (row.cell_types.length)
          anatomicalStructures[foundIndex].outdegree.add(`${row.cell_types[0].name}${row.cell_types[0].id}`)
          if (i > 0) {
            anatomicalStructures[foundIndex].indegree.add(row.anatomical_structures[i - 1].name);
          }
        }
      })
    })
    
    // console.log('origin: ', anatomicalStructures)
    if (anatomicalStructures.length > 0) {
      res(anatomicalStructures);
    } else {
      rej(['Could not process anatomical structures.']);
    }
  });
}


  /**
   * Function to compute the Cell Types from the given Data Table.
   *
   * @param data - Sheet data
   * @param - Configurations that consist of the following params,
   *   1. cell_col - The column number in which the cell types are present.
   *   2. uberon_col - The number of columns after which the uberon column can be found.
   *
   * @returns - Array of cell types
   */
export   async function makeCellTypes(
  data: any,
  config: ASCTBConfig
): Promise<Array<CT>> {
  const cellTypes = []
  
  return new Promise((res, rej) => {

    // let newData = outputData.data
    data.forEach(row => {
      row.cell_types.forEach(str => {
        let foundIndex = cellTypes.findIndex(cell => cell.comparator === (str.name + str.id))
        let newStructure: CT;
        if (foundIndex === -1) {
          newStructure = {
            structure: str.name,
            link: str.id,
            isNew: false,
            color: '#ccc',
            outdegree: new Set(),
            indegree: new Set(),
            comparator: `${str.name}${str.id}`,
            label: str.rdfs_label
          }

          if (row.anatomical_structures.length > 0) {
            let sn = row.anatomical_structures[row.anatomical_structures.length - 1].name;
            let sid = row.anatomical_structures[row.anatomical_structures.length - 1].id;
            newStructure.indegree.add(sn+sid)
          }
          
          // calculate outdegree (CT -> B)
          row.biomarkers.forEach(marker => {
            newStructure.outdegree.add(marker.name+marker.id)
          })
          cellTypes.push(newStructure)
        } else {
          row.biomarkers.forEach(marker => {
            cellTypes[foundIndex].outdegree.add(marker.name + marker.id)
            
          })
          let sn = row.anatomical_structures[row.anatomical_structures.length - 1].name;
          let sid = row.anatomical_structures[row.anatomical_structures.length - 1].id;

          cellTypes[foundIndex].indegree.add(`${sn}${sid}`)
          // newStructure.indegree.add(row.anatomical_structures[row.anatomical_structures.length - 1].id)
        }

        
      })
      
    })

    
    // console.log(cellTypes)
    if (cellTypes.length > 0) {
      res(cellTypes);
    } else {
      rej('Could not process cell types');
    }
  });
}
  /**
   * Function to compute the Cell Types from the given Data Table.
   *
   * @param data - Sheet data
   * @param - Configurations that consist of the following params,
   *   1. marker_col - The column number in which the biomarkers are present.
   *
   * @returns - Array of biomarkers
   */
export async function makeBioMarkers(
  data:any,
  config: ASCTBConfig
): Promise<Array<B>> {
  return new Promise((res, rej) => {
    const bioMarkers = [];

    // let newData = outputData.data
    data.forEach(row => {
      row.biomarkers.forEach(str => {
        let foundIndex = bioMarkers.findIndex(i => i.structure === str.name)
        let newStructure: B;
        if (foundIndex === -1) {
          newStructure = {
            structure: str.name,
            link: str.id,
            isNew: false,
            color: '#ccc',
            outdegree: new Set(),
            indegree: new Set(),
            nodeSize: 300
          }
          
          if (row.cell_types.length)
            newStructure.indegree.add(`${row.cell_types[0].name}${row.cell_types[0].id}`) 

          bioMarkers.push(newStructure)
        } else {
          if (row.cell_types.length)
          bioMarkers[foundIndex].indegree.add(`${row.cell_types[0].name}${row.cell_types[0].id}`)
        }
      })
    })
    
    res(bioMarkers)
  });
}
