import { BM_TYPE, headerMap, Reference, Row, Structure } from "./api.model";

export function buildASCTApiUrl(id: string) {
    return `http://www.ebi.ac.uk/ols/api/terms/findByIdAndIsDefiningOntology?obo_id=${id}`;
}

export function buildHGNCApiUrl(id: string) {
    return `https://rest.genenames.org/fetch/hgnc_id/${id}`;
}

export function buildHGNCLink(id: string) {
    return `https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${id}`;
}

function addBiomarker(rowHeader: any, s: any) {
  if (rowHeader[0] === 'BGene' || rowHeader[0] === 'BG') {
    s.b_type = BM_TYPE.G;
  }
  if (rowHeader[0] === 'BProtein' || rowHeader[0] === 'BP') {
    s.b_type = BM_TYPE.P;
  }
  if (rowHeader[0] === 'BLipid' || rowHeader[0] === 'BL') {
    s.b_type = BM_TYPE.BL;
  }
  if (rowHeader[0] === 'BMetabolites' || rowHeader[0] === 'BM') {
    s.b_type = BM_TYPE.BM;
  }
  if (rowHeader[0] === 'BProteoform' || rowHeader[0] === 'BF') {
    s.b_type = BM_TYPE.BF;
  }
  return s
}

function addingIDNotesLabels(rowHeader: any, newRow: any, key: any, data: any, i: number, j: number) {
  if (rowHeader.length === 3 && rowHeader[2] === 'ID') {
    const n = newRow[key][parseInt(rowHeader[1]) - 1];
    if (n) {
      n.id = data[i][j];
    }
  } else if (rowHeader.length === 3 && rowHeader[2] === 'LABEL') {
    const n = newRow[key][parseInt(rowHeader[1]) - 1];
    if (n) {
      n.rdfs_label = data[i][j];
    }
  } else if (rowHeader.length === 3 && rowHeader[2] === 'DOI') {
    const n: Reference = newRow[key][parseInt(rowHeader[1]) - 1];
    if (n) {
      n.doi = data[i][j];
    }
  } else if (rowHeader.length === 3 && rowHeader[2] === 'NOTES') {
    const n: Reference = newRow[key][parseInt(rowHeader[1]) - 1];
    if (n) {
      n.notes = data[i][j];
    }
  }

}

function checkForHeader(headerRow: number, dataLength: number, data: any) {
  for (let i = headerRow; i < dataLength; i++) {
    if (data[i][0] !== 'AS/1') {
      continue;
    }
    headerRow = i + 1;
    break;
  }
  return headerRow
} 

function addAllBiomarkersToRow(rows: any) {
  for (const row of rows) {
    row.biomarkers = row.biomarkers_gene
      .concat(row.biomarkers_protein)
      .concat(row.biomarkers_lipids)
      .concat(row.biomarkers_meta)
      .concat(row.biomarkers_prot);
  }
}

export function makeASCTBData(data: any) {
    return new Promise((res, rej) => {
      const rows = [];
      let headerRow = 0;
      const dataLength = data.length;
  
      try {
        headerRow = checkForHeader(headerRow, dataLength, data);
  
        for (let i = headerRow; i < dataLength; i++) {
          const newRow: { [key: string]: any } = new Row();
  
          for (let j = 0; j < data[0].length; j++) {
            if (data[i][j] === '') {
              continue;
            }
  
            const rowHeader = data[headerRow - 1][j].split('/');
            const key = headerMap[rowHeader[0]];
  
            if (key === undefined) {
              continue;
            }
  
            if (rowHeader.length === 2 && Number(rowHeader[1])) {
              if (rowHeader[0] === 'REF') {
                const ref: Reference = { id: data[i][j] };
                newRow[key].push(ref);
              } else {
                let s = new Structure(data[i][j]);
                s = addBiomarker(rowHeader, s);
                newRow[key].push(s);
              }
            }
            addingIDNotesLabels(rowHeader, newRow, key, data, i, j);
            
          }
          rows.push(newRow);
        }
  
       addAllBiomarkersToRow(rows);
        res(rows);
      } catch (err) {
        rej(err);
      }
    });
  }
