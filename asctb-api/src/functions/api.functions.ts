/* tslint:disable:variable-name */
import { arrayNameMap, createObject, HEADER_FIRST_COLUMN, objectFieldMap, Row } from '../models/api.model';
import { fixOntologyId } from './lookup.functions';

function setData(column: string[], row: any, value: any): void {
  if (column.length > 1) {
    const arrayName = arrayNameMap[column[0]];
    const originalArrayName = column[0];
    const objectArray: any[] = row[arrayName] || [];

    if (column.length === 2) {
      if (objectArray.length === 0 && arrayName) {
        row[arrayName] = objectArray;
      }
      objectArray.push(createObject(value, originalArrayName));
    } else if (column.length === 3) {
      let arrayIndex = parseInt(column[1], 10) - 1;
      const fieldName = objectFieldMap[column[2]] || column[2]?.toLowerCase();
      if (arrayIndex >= 0 && fieldName) {
        // FIXME: Temporarily deal with blank columns since so many tables are non-conformant
        arrayIndex = objectArray.length - 1;
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
  const headerRow = findHeaderIndex(0, data, HEADER_FIRST_COLUMN);
  const columns = data[headerRow].map((col: string) => col.split('/').map(s => s.trim()));

  return data.slice(headerRow + 1).map((rowData: any[], rowNumber) => {
    const row = new Row(headerRow + rowNumber + 2);
    rowData.forEach((value, index) => {
      if (index < columns.length && columns[index].length > 1) {
        setData(columns[index], row, value);
      }
    });
    row.finalize();
    return row;
  });
}
