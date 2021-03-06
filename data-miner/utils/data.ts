enum BM_TYPE {
  G = 'gene',
  P = 'protein'
}

interface Reference {
  id?: string;
  doi?: string;
  notes?: string;
}

class Structure {
  name?: string;
  id?: string;
  rdfs_label?: string;
  b_type?: BM_TYPE;

  constructor(name: string) {
    this.name = name;
    this.id = '';
    this.rdfs_label = '';
  }
}

class Row {
  anatomical_structures: Array<Structure>;
  cell_types: Array<Structure>;
  biomarkers: Array<Structure>;
  references: Reference[];

  constructor() {
    this.anatomical_structures = []
    this.cell_types = []
    this.biomarkers = []
    this.references = [];
  }
}

let headerMap: any = {
 'AS':'anatomical_structures', 'CT': 'cell_types', 'BG': 'biomarkers', 'BP': 'biomarkers',
 'REF': 'references'
}


export function makeASCTBData(data: any) {
  return new Promise((res, rej) => {
    let rows = [];
    let headerRow = 11
    let dataLength = data.length
  
    try {
      for (let i = headerRow ; i < dataLength; i ++ ) {
        let newRow: {[key: string]: any} = new Row()
  
        for (let j = 0 ; j < data[0].length; j ++) {
          if (data[i][j] === '') continue;
    
          let rowHeader = data[headerRow - 1][j].split('/');
          let key = headerMap[rowHeader[0]]
          
          if (key === undefined) continue;
  
          if (rowHeader.length === 2 && Number(rowHeader[1])) {
            if(rowHeader[0] === 'REF') {
              let ref: Reference = {id: data[i][j]}
              newRow[key].push(ref)
            } else {
              let s = new Structure(data[i][j])
              if (rowHeader[0] === 'BG') s.b_type = BM_TYPE.G
              if (rowHeader[0] === 'BP') s.b_type = BM_TYPE.P
              newRow[key].push(s)
            }
          } 
          
          if (rowHeader.length === 3 && rowHeader[2] === 'ID') {
            let n = newRow[key][parseInt(rowHeader[1]) - 1]
            if (n) n.id = data[i][j]
          } else if(rowHeader.length === 3 && rowHeader[2] === 'LABEL') {
            let n = newRow[key][parseInt(rowHeader[1]) - 1];
            if (n) n.rdfs_label = data[i][j]
          } else if(rowHeader.length === 3 &&rowHeader[2] === 'DOI') {
            let n: Reference = newRow[key][parseInt(rowHeader[1]) - 1]
            if (n) n.doi = data[i][j]
          } else if(rowHeader.length === 3 &&rowHeader[2] === 'NOTES') {
            let n: Reference = newRow[key][parseInt(rowHeader[1]) - 1]
            if (n) n.notes = data[i][j]
          }
          
        }
        rows.push(newRow)
        
      } 
      res(rows)
    } catch(err) {
      rej(err)
    }

  })
}
