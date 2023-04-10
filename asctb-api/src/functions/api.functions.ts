import {
  arrayNameMap, arrayNameType, createObject, DELIMETER, ASCT_HEADER_FIRST_COLUMN,
  metadataArrayFields, metadataNameMap, objectFieldMap, Row, TITLE_ROW_INDEX,
  OMAP_HEADER_FIRST_COLUMN
} from '../models/api.model';
import { fixOntologyId } from './lookup.functions';
import { OmapDataTransformer } from './omap.functions';

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

function setData(column: string[], row: Row, value: string, warnings: Set<string>): void {
  if (column.length > 1) {
    const arrayName: arrayNameType = arrayNameMap[column[0]];
    const originalArrayName = column[0];
    const objectArray: any[] = row[arrayName] || [];

    if (!arrayName) {
      // arrayName = originalArrayName.toLowerCase();
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
    } else if (column.length === 3 && arrayName) {
      let arrayIndex = parseInt(column[1], 10) - 1;
      const fieldName = objectFieldMap[column[2]]; // || (column[2]?.toLowerCase() ?? '').trim();

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
          if (objectArray[arrayIndex]) {
            objectArray[arrayIndex][fieldName] = value;
          } else {
            warnings.add(`WARNING: bad column: ${column.join('/')}`);
          }
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
export const buildMetadata = (metadataRows: string[][], warnings: Set<string>): Record<string, string | string[]> => {
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
        warnings.add(`WARNING: unmapped metadata found ${metadataIdentifier}`);
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

export function findHeaderIndex(headerRow: number, data: string[][], firstColumnName: string): number {
  for (let i = headerRow; i < data.length; i++) {
    if (data[i][0] === firstColumnName) {
      return i;
    }
  }
  return headerRow;
}

export function getHeaderRow(data: String[][], omapHeader: String, asctbHeader: string): String[] | undefined {
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === omapHeader) {
      return data[i];
    }
    if (data[i][0] === asctbHeader) {
      return data[i];
    }
  }
  return undefined;
}

export function makeASCTBData(data: string[][]): ASCTBData | undefined {
  const header = getHeaderRow(data, OMAP_HEADER_FIRST_COLUMN, ASCT_HEADER_FIRST_COLUMN);

  if (header[0] === OMAP_HEADER_FIRST_COLUMN) {
    const omapTransformer = new OmapDataTransformer(data);
    const omapWarnings = omapTransformer.warnings;
    const asctbData = makeASCTBDataWork(omapTransformer.transformedData);
    return { ...asctbData, warnings: [...asctbData.warnings, ...omapWarnings] };
  } else if (header[0] === ASCT_HEADER_FIRST_COLUMN) {
    return makeASCTBDataWork(data);
  } else {
    throw new Error(`Header row, first column should be : ${ASCT_HEADER_FIRST_COLUMN} or ${OMAP_HEADER_FIRST_COLUMN}`);
  }
}

export function makeASCTBDataWork(data: string[][]): ASCTBData {
  const headerRow = findHeaderIndex(0, data, ASCT_HEADER_FIRST_COLUMN);
  const columns = data[headerRow].map((col: string) => col.toUpperCase().split('/').map(s => s.trim()));
  const warnings = new Set<string>();

  const results = data.slice(headerRow + 1).map((rowData: string[], rowNumber) => {
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
