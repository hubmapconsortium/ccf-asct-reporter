import { arrayNameMap, createObject, DELIMETER, HEADER_FIRST_COLUMN, metadataNameMap, objectFieldMap, Row, TITLE_ROW } from '../models/api.model';
import { fixOntologyId } from './lookup.functions';

export interface ASCTBData {
  data: Row[];
  metadata: Record<string, string | string[]>;
  warnings: string[];
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

function setData(column: string[], row: any, value: any, warnings: Set<string>): void {
  if (column.length > 1) {
    let arrayName = arrayNameMap[column[0]];
    const originalArrayName = column[0];
    const objectArray: any[] = row[arrayName] || [];

    if (!arrayName) {
      arrayName = originalArrayName.toLowerCase();
      warnings.add(`WARNING: unmapped array found ${originalArrayName}`);
    }
    if (column.length === 3 && !objectFieldMap[column[2]]) {
      if ((column[2]?.toLowerCase() ?? '').trim().length === 0) {
        warnings.add(`WARNING: blank field found: ${column.join('/')}`);
      } else {
        warnings.add(`WARNING: unmapped field found: ${column.join('/')}`);
      }
    }

    if (column.length === 2) {
      if (objectArray.length === 0 && arrayName) {
        row[arrayName] = objectArray;
      }
      objectArray.push(createObject(value, originalArrayName));
    } else if (column.length === 3) {
      let arrayIndex = parseInt(column[1], 10) - 1;
      const fieldName = objectFieldMap[column[2]] || (column[2]?.toLowerCase() ?? '').trim();

      if (arrayIndex >= 0 && fieldName) {
        if (arrayIndex >= objectArray.length) {
          warnings.add(`WARNING: blank cells likely found in column: ${column.join('/')}, row: ${row.rowNumber}`);
        }
        // FIXME: Temporarily deal with blank columns since so many tables are non-conformant
        arrayIndex = objectArray.length - 1;
        if (arrayIndex < objectArray.length) {
          switch (fieldName) {
          case 'id':
            value = fixOntologyId(value);
            break;
          }
          objectArray[arrayIndex][fieldName] = value;
        }
      }
    }
  }
}

/*
 * buildMetadata - build metadata key value store
 * @param metadataRows = rows from metadata to be extracted
 * @param warnings = warnings generated during the process are pushed to this set
 * @returns = returns key value pairs of metadata
 */
const buildMetadata = (metadataRows: string[][], warnings: Set<string>): Record<string, string | string[]> => {
  const [titleRow] = metadataRows.splice(TITLE_ROW, 1);
  const [title] = titleRow;

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
        warnings.add(`WARNING: unmapped metadata found ${metadataIdentifier}`);
      }
      if (metadataValue.includes(DELIMETER)) {
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
  const columns = data[headerRow].map((col: string) => col.split('/').map(s => s.trim()));
  const warnings = new Set<string>();

  const results = data.slice(headerRow + 1).map((rowData: any[], rowNumber) => {
    const row: Row = new Row(headerRow + rowNumber + 2);
    rowData.forEach((value, index) => {
      if (index < columns.length && columns[index].length > 1) {
        setData(columns[index], row, value, warnings);
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
    warnings: [...warnings]
  };
}
