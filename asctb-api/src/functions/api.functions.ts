/* tslint:disable:variable-name */
import { BM_TYPE, headerMap, Reference, Row, Structure, PROTEIN_PRESENCE } from '../models/api.model';
import { fixOntologyId } from './lookup.functions';


function addBiomarker(rowHeader: any, s: any) {
  if (rowHeader[0] === 'BGene' || rowHeader[0] === 'BG') {
    s.b_type = BM_TYPE.G;
  }
  if (rowHeader[0] === 'BProtein' || rowHeader[0] === 'BP') {
    s.name = s.name.replace('Protein', '');
    if (s.name.indexOf('+') > -1){
      s.name = s.name.replace('+', '');
      s.proteinPresence = PROTEIN_PRESENCE.POS;
    } else if (s.name.indexOf('-') > -1){
      s.name = s.name.replace('-', '');
      s.proteinPresence = PROTEIN_PRESENCE.NEG;
    } else {
      s.proteinPresence = PROTEIN_PRESENCE.UNKNOWN;
    }
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
  return s;
}

function addingIDNotesLabels(rowHeader: any, newRow: any, key: any, data: any, i: number, j: number) {
  if (rowHeader.length === 3 && rowHeader[2] === 'ID') {
    const n = newRow[key][parseInt(rowHeader[1]) - 1];
    assignNotesDOIData(n, data[i][j], 'id');
  } else if (rowHeader.length === 3 && rowHeader[2] === 'LABEL') {
    const n = newRow[key][parseInt(rowHeader[1]) - 1];
    assignNotesDOIData(n, data[i][j], 'rdfs_label');
  } else if (rowHeader.length === 3 && rowHeader[2] === 'DOI') {
    const n: Reference = newRow[key][parseInt(rowHeader[1]) - 1];
    assignNotesDOIData(n, data[i][j], 'doi');
  } else if (rowHeader.length === 3 && rowHeader[2] === 'NOTES') {
    const n: Reference = newRow[key][parseInt(rowHeader[1]) - 1];
    assignNotesDOIData(n, data[i][j], 'notes');
  }
}

function assignNotesDOIData(n:any, data: any, type: string) {
  if (type === 'id') {
    data = fixOntologyId(data);
  }

  if (n) {
    n[type] = data;
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
  return headerRow;
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

function addREF(rowHeader: any, newRow: any, key: any, data: any) {
  if (rowHeader[0] === 'REF') {
    const ref: Reference = { id: data };
    newRow[key].push(ref);
  } else {
    let s = new Structure(data);
    s = addBiomarker(rowHeader, s);
    newRow[key].push(s);
  }
}

export function makeASCTBData(data: any[]): Promise<Row[]> {
  return new Promise((res, rej) => {
    const rows = [];
    let headerRow = 0;
    const dataLength = data.length;

    try {
      headerRow = checkForHeader(headerRow, dataLength, data);

      for (let i = headerRow; i < dataLength; i++) {
        const newRow = new Row();

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
            addREF(rowHeader, newRow, key, data[i][j]);
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
