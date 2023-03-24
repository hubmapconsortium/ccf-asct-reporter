import {
  arrayNameMap, arrayNameType, createObject, DELIMETER, HEADER_FIRST_COLUMN,
  metadataArrayFields, metadataNameMap, objectFieldMap, Row, TITLE_ROW_INDEX
} from '../models/api.model';
import { fixOntologyId } from './lookup.functions';

import { ASCTBError } from '../utils/errors';
import { ErrorCode } from '../utils/errors';
export interface ASCTBData {
  data: Row[];
  metadata: Record<string, string | string[]>;
  warnings: ASCTBError[];
}

export function normalizeCsvUrl(url: string): string {
  if (url.startsWith('https://docs.google.com/spreadsheets/d/') && url.indexOf('export?format=csv') === -1) {
    const splitUrl = url.split('/');
    if (splitUrl.length === 7) {
      const sheetId = splitUrl[5];
      const gid = splitUrl[6].split('=')[1];
      return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    }
  }
  return url;
}

function setData(column: string[], columnNumber: number, row: Row, value: string, warnings: ASCTBError[]): void {
  if (column.length > 1) {
    const arrayName: arrayNameType = arrayNameMap[column[0]];
    const originalArrayName = column[0];
    const objectArray: any[] = row[arrayName] || [];

    // console.log('arrayname=========',arrayName);
    // console.log('original array name========',originalArrayName);
    if (!arrayName) {
      const colName = columnIndexToName(columnNumber);
      // arrayName = originalArrayName.toLowerCase();
      warnings.push({code: ErrorCode.UnmappedData, cNumber: columnNumber, cName:colName, originalArrayName: originalArrayName });
      // warnings.add(`WARNING: unmapped array found ${originalArrayName}`);
    }
    if (column.length === 3 && !objectFieldMap[column[2]]) {
      if ((column[2]?.toLowerCase() ?? '').trim().length === 0) {
        // warnings.add(`${ERROR_TYPE.INVALID_HEADER} : ${column.join('/')}`);
        warnings.push({code: ErrorCode.InvalidHeader,cNumber: columnNumber, rNumber: row.rowNumber, headerName: column.join('/') });
      }
      // else {
      //   // warnings.add(`WARNING: unmapped field found: ${column.join('/')}`);
      //   warnings.push({code: ErrorCode.UnmappedData, cNumber: columnNumber, headerName: column.join('/') });
      // }
    }

    if (column.length === 3) {
      if (!arrayNameMap[column[0].toUpperCase()]) {
        if ((column[0]?.toLowerCase() ?? '').trim().length === 0) {
          // warnings.add(`WARNING: blank field found: ${column.join('/')}`);
          // warnings.add(`${ERROR_TYPE.INVALID_HEADER} : ${column.join('/')}`);
          warnings.push({code: ErrorCode.InvalidHeader,cNumber: columnNumber,rNumber: row.rowNumber ,headerName: column.join('/') });
        } 
        // else {
        //   // warnings.add(`WARNING: unmapped field found: ${column.join('/')}`);
        //   warnings.push({code: ErrorCode.UnmappedData, cNumber: columnNumber, headerName: column.join('/') });
        // }
      }

      if (!parseInt(column[1])) {
        if (column[1].trim().length === 0) {
          // warnings.add(`WARNING: blank field found: ${column.join('/')}`);
          // warnings.add(`${ERROR_TYPE.INVALID_HEADER} : ${column.join('/')}`);
          warnings.push({code: ErrorCode.InvalidHeader,cNumber: columnNumber,rNumber:row.rowNumber, headerName: column.join('/') });
        } 
        // else {
        //   // warnings.add(`WARNING: unmapped field found: ${column.join('/')}`);
        //   warnings.push({code: ErrorCode.UnmappedData, cNumber: columnNumber, headerName: column.join('/') });
        // }
      }
      if (!objectFieldMap[column[2]]) {
        if ((column[2]?.toLowerCase() ?? '').trim().length === 0) {
          // warnings.add(`WARNING: blank field found: ${column.join('/')}`);
          // warnings.add(`${ERROR_TYPE.INVALID_HEADER} : ${column.join('/')}`);
          warnings.push({code: ErrorCode.InvalidHeader,cNumber: columnNumber, rNumber: row.rowNumber, headerName: column.join('/') });
        } 
        // else {
        //   // warnings.add(`WARNING: unmapped field found: ${column.join('/')}`);
        //   warnings.push({code: ErrorCode.UnmappedData, cNumber: columnNumber, headerName: column.join('/') });
        // }
      }
    }

    if (column.length === 2) {
      if (!arrayNameMap[column[0].toUpperCase()]) {
        if ((column[0]?.toLowerCase() ?? '').trim().length === 0) {
          // warnings.add(`WARNING: blank field found: ${column.join('/')}`);
          // warnings.add(`${ERROR_TYPE.INVALID_HEADER} : ${column.join('/')}`);
          warnings.push({code: ErrorCode.InvalidHeader, cNumber: columnNumber, rNumber: row.rowNumber, headerName: column.join('/') });
        } 
        // else {
        //   // warnings.add(`WARNING: unmapped field found: ${column.join('/')}`);
        //   warnings.push({code: ErrorCode.UnmappedData, cNumber: columnNumber, headerName: column.join('/') });
        // }
      }

      if (!Number.isNaN(parseInt(column[1]))) {
        if (column[1].trim().length === 0) {
          // warnings.add(`WARNING: blank field found: ${column.join('/')}`);
          // warnings.add(`${ERROR_TYPE.INVALID_HEADER} : ${column.join('/')}`);
          warnings.push({code: ErrorCode.InvalidHeader, cNumber: columnNumber, rNumber: row.rowNumber, headerName: column.join('/') });
        } 
        // else {
        //   // warnings.add(`WARNING: unmapped field found: ${column.join('/')}`);
        //   warnings.push({code: ErrorCode.UnmappedData, cNumber: columnNumber, headerName: column.join('/') });
        // }
      }
    }

    if (column.length === 2) {
      if (objectArray.length === 0 && arrayName) {
        row[arrayName] = objectArray;
      }
      objectArray.push(createObject(value, originalArrayName));
    } else if (column.length === 3 && arrayName) {
      let arrayIndex = parseInt(column[1], 10) - 1;
      const fieldName = objectFieldMap[column[2]]; // || (column[2]?.toLowerCase() ?? '').trim();

      if (arrayIndex >= 0 && fieldName) {
        if (arrayIndex >= objectArray.length) {
          // warnings.add(`WARNING: blank cells likely found in column: ${column.join('/')}, row: ${row.rowNumber}`);
          warnings.push({code: ErrorCode.MissingHeader, cNumber:
             columnNumber, rNumber: row.rowNumber});
        }
        // FIXME: Temporarily deal with blank columns since so many tables are non-conformant
        arrayIndex = objectArray.length - 1;
        if (arrayIndex < objectArray.length) {
          switch (fieldName) {
          case 'id':
            value = fixOntologyId(value);
            break;
          }
          if (objectArray[arrayIndex]) {
            objectArray[arrayIndex][fieldName] = value;
          } else {
            // warnings.add(`WARNING: bad column: ${column.join('/')}`);
            warnings.push({code: ErrorCode.BadColumn, headerName: column.join('/')});
          }
        }
      }
    }
  }
}

const invalidCharacterRegex = /_/gi;
const isLinkRegex = /^http/gi;
const codepointUppercaseA = 65;
const alphabetLength = 26;

function columnIndexToName(index: number): string {
  index = index + 1;
  const name = [];
  while (index) {
    const mod = (index - 1) % alphabetLength;
    index = Math.floor(Number((index - mod) / alphabetLength));
    name.unshift(String.fromCharCode(codepointUppercaseA + Number(mod)));
  }
  return name.join('');
}

function validateDataCell(value: string, rowIndex: number, columnIndex: number, columnLabel: string, warnings: ASCTBError[]): void {
  if (!isLinkRegex.test(value) && invalidCharacterRegex.test(value)) {
    const columnName = columnIndexToName(columnIndex);
    warnings.push({code: ErrorCode.InvalidCharacter, rInd: rowIndex+1, cName: columnName});
    // warnings.add(`WARNING: Invalid characters in data cell ${rowIndex}:${columnName}(${columnName})`);
    // warnings.add(`${ERROR_TYPE.INVALID_CHARACTER} ${rowIndex}:${columnName}(${columnName})`);
  }
}

/*
 * buildMetadata - build metadata key value store
 * @param metadataRows = rows from metadata to be extracted
 * @param warnings = warnings generated during the process are pushed to this set
 * @returns = returns key value pairs of metadata
 */
const buildMetadata = (metadataRows: string[][], warnings: ASCTBError[]): Record<string, string | string[]> => {
  const [titleRow] = metadataRows.splice(TITLE_ROW_INDEX, 1);
  const [title] = titleRow.slice(0, 1);

  const result: Record<string, string | string[]> = {
    title
  };

  return metadataRows
    .reduce((metadata: Record<string, string | string[]>, rowData: string[], rowNumber: number,) => {
      const [metadataIdentifier, metadataValue, ..._] = rowData;
      if (!metadataIdentifier) {
        return metadata;
      }
      let metadataKey = metadataNameMap[metadataIdentifier];
      if (!metadataKey) {
        metadataKey = metadataIdentifier.toLowerCase();
        warnings.push({ code: ErrorCode.UnmappedMetadata, key: metadataIdentifier });
        // warnings.add(`WARNING: unmapped metadata found ${metadataIdentifier}`);
        // warnings.add(`${ERROR_TYPE.MISSING_METADATA} ${metadataIdentifier}`);
      }
      if (metadataArrayFields.includes(metadataKey)) {
        metadata[metadataKey] = metadataValue.split(DELIMETER).map(item => item.trim());
      } else {
        metadata[metadataKey] = metadataValue.trim();
      }
      return metadata;
    }, result
    );
};

function findHeaderIndex(headerRow: number, data: string[][], firstColumnName: string): number {
  for (let i = headerRow; i < data.length; i++) {
    if (data[i][0] === firstColumnName) {
      return i;
    }
  }
  return headerRow;
}

export function makeASCTBData(data: string[][]): ASCTBData {
  const headerRow = findHeaderIndex(0, data, HEADER_FIRST_COLUMN);
  const columns = data[headerRow].map((col: string) => col.toUpperCase().split('/').map(s => s.trim()));
  const warnings: ASCTBError[] = [];

  const results = data.slice(headerRow + 1).map((rowData: string[], rowNumber) => {
    const row: Row = new Row(headerRow + rowNumber + 2);
    rowData.forEach((value, index) => {
      if (index < columns.length && columns[index].length > 1) {
        validateDataCell(value, row.rowNumber, index, data[headerRow][index], warnings); 
        setData(columns[index], index, row, value, warnings);
      }
    });
    row.finalize();
    return row;
  });

  // build metadata key value store.
  const metadataRows = data.slice(0, headerRow);
  const metadata = buildMetadata(metadataRows, warnings);

  console.log([...warnings].sort().join('\n'));

  return {
    data: results,
    metadata: metadata,
    warnings
  };
}