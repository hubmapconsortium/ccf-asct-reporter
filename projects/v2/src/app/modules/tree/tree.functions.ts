import { Marker, Cell, AS, ASCTBConfig, CT, B } from '../../models/tree.model';

export async function makeMarkerDegree(data: any, currentSheet: any) {
  const markerDegrees = [];

  data.forEach((row) => {
    const markers = row[currentSheet.marker_col].split(',');
    const cells = row[currentSheet.cell_col]
      .split(',')
      .map((str) => str.trim())
      .filter((c) => c !== '');

    for (const i in markers) {
      if (markers[i] !== '' && !markers[i].startsWith('//')) {
        const foundMarker = markerDegrees.findIndex(
          (r) =>
            r.structure.toLowerCase().trim() ===
            markers[i].toLowerCase().trim()
        );
        if (foundMarker === -1) {
          const nm = new Marker(markers[i].trim(), cells.length);
          nm.parents.push(...cells.map((cell) => cell.toLowerCase()));
          nm.isNew = row[row.length - 2];
          nm.color = row[row.length - 1];
          markerDegrees.push(nm);
        } else {
          const m = markerDegrees[foundMarker];
          for (const c in cells) {
            if (cells[c] !== '' && !cells[c].startsWith('//')) {
              if (!m.parents.includes(cells[c].toLowerCase())) {
                m.count += 1;
                m.parents.push(cells[c].toLowerCase());
              }
            }
          }
        }
      }
    }
  });

  markerDegrees.sort((a, b) => b.parents.length - a.parents.length);
  return markerDegrees;
}

/**
 * Returns the array of cell types that are sorted have their degrees calculated.
 * @param data - Sheet data
 * @param treeData - Data from the tree visualization.
 * @param degree - Degree configuration. Can be Degree, Indegree and Outdegree
 */
export async function makeCellDegree(
  data,
  treeData,
  degree,
  currentSheet: any
): Promise<Array<Cell>> {
  return new Promise((res, rej) => {
    const cellDegrees: Array<Cell> = [];

    // calculating in degree (AS -> CT)
    if (degree === 'Degree' || degree === 'Indegree') {
      treeData.forEach((td) => {
        if (td.children === 0) {
          const leaf = td.name;

          data.forEach((row) => {
            let parent;
            for (const i in row) {
              if (typeof row[i] === 'string' && row[i] !== '') {
                if (row[i].toLowerCase() === leaf.toLowerCase()) {
                  parent = i;
                }
              }
            }

            if (parent) {
              const cells = row[currentSheet.cell_col].split(',');
              for (const i in cells) {
                if (cells[i] !== '' && !cells[i].startsWith('//')) {
                  const foundCell = cellDegrees.findIndex(
                    (c) =>
                      c.structure.toLowerCase().trim() ===
                      cells[i].toLowerCase().trim()
                  );
                  if (foundCell === -1) {
                    const nc = new Cell(
                      cells[i].trim(),
                      row[currentSheet.cell_col + currentSheet.uberon_col]
                    );
                    nc.isNew = row[row.length - 2];
                    nc.color = row[row.length - 1];
                    nc.parents.push(parent.toLowerCase());
                    cellDegrees.push(nc);
                  } else {
                    const c = cellDegrees[foundCell];
                    if (!c.parents.includes(parent.toLowerCase())) {
                      c.parents.push(parent.toLowerCase());
                    }
                  }
                }
              }
            }
          });
        }
      });
    }

    // calculating out degree (CT -> B)
    if (degree === 'Degree' || degree === 'Outdegree') {
      data.forEach((row) => {
        const markers = row[currentSheet.marker_col]
          .split(',')
          .map((str) => str.trim().toLowerCase())
          .filter((c) => c !== '');
        const cells = row[currentSheet.cell_col]
          .split(',')
          .map((str) => str.trim())
          .filter((c) => c !== '');

        for (const c in cells) {
          if (cells[c] !== '' && !cells[c].startsWith('//')) {
            const cd = cellDegrees.findIndex(
              (i) => i.structure.toLowerCase() === cells[c].toLowerCase()
            );
            if (cd !== -1) {
              for (const m in markers) {
                if (
                  !cellDegrees[cd].parents.includes(markers[m].toLowerCase())
                ) {
                  cellDegrees[cd].parents.push(markers[m]);
                }
              }
            } else {
              const nc = new Cell(
                cells[c].trim(),
                row[currentSheet.cell_col + currentSheet.uberon_col]
              );
              nc.isNew = row[row.length - 2];
              nc.color = row[row.length - 1];
              nc.parents.push(...markers);
              cellDegrees.push(nc);
            }
          }
        }
      });
    }
    cellDegrees.sort((a, b) => b.parents.length - a.parents.length);
    res(cellDegrees);
  });
}

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
            newStructure.indegree.add(row.cell_types[0].name) 

          bioMarkers.push(newStructure)
        } else {
          if (row.cell_types.length)
          bioMarkers[foundIndex].indegree.add(row.cell_types[0].name)
        }
      })
    })
    
    res(bioMarkers)
  });
}
