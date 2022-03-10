/* tslint:disable:variable-name */
import { arrayNameMap, objectFieldMap, Reference, Row, Structure } from '../models/api.model';
import { fixOntologyId } from './lookup.functions';

function setData(column: string[], row: any, value: any): void {
  if (column.length > 1) {
    const arrayName = arrayNameMap[column[0]];
    const originalArrayName = column[0];
    const objectArray: any[] = row[arrayName] || [];

    if (column.length === 2) {
      if (objectArray.length === 0) {
        row[arrayName] = objectArray;
      }
      if (originalArrayName === 'REF') {
        objectArray.push(new Reference(value));
      } else {
        objectArray.push(new Structure(value, originalArrayName));
      }
    } else if (column.length === 3) {
      const arrayIndex = parseInt(column[1], 10) - 1;
      const fieldName = objectFieldMap[column[2]] || column[2]?.toLowerCase();
      if (arrayIndex >= 0 && fieldName) {
        if (arrayIndex < objectArray.length) {
          switch (fieldName) {
          case 'id':
            value = fixOntologyId(value);
            break;
          }
          objectArray[arrayIndex][fieldName] = value;
        } else {
          // TODO: log warning blank fields found
        }
      }
    }
  }
}

function findHeaderIndex(headerRow: number, data: any[], firstColumnName: string): number {
  for (let i = headerRow; i < data.length; i++) {
    if (data[i][0] === firstColumnName) {
      return i;
    }
  }
  return headerRow;
}

export function makeASCTBData(data: any[]): Row[] {
  const headerRow = findHeaderIndex(0, data, 'AS/1');
  const columns = data[headerRow].map((col: string) => col.split('/'));

  return data.slice(headerRow + 1).map((rowData: any[]) => {
    const row = new Row();
    rowData.forEach((value, index) => {
      if (value !== '') {
        setData(columns[index], row, value);
      }
    });
    row.finalize();
    return row;
  });
}
