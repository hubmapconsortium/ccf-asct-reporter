import { ErrorCode, ASCTBError } from '../utils/errors';
import { ASCTBData } from './api.functions';


// type ValidationResult =
//     | { status: 'passed' }
//     | { status: 'failed'; details: string[] };

// const errorCodeRegex = /Code\d+/;

// In namedErrorCodes -> storing the tuple where 1st value is Name of the error(declared in ErrorCode) 2nd value as a code for that error
const namedErrorCodes = (Object.entries(ErrorCode) as [string, ErrorCode][])
  .filter(([code]) => String(Number(code)) !== code);

export function makeValidationReport(data: ASCTBData): string[] {
  // Getting the warnings from the ASCTBData
  const warnings = data.warnings;
  // console.log('REACHED HERE');

  // Output lines/data will be added here
  const lines: string[] = [];

  // Grouping all the errors by its code
  const errorsByCode = namedErrorCodes.reduce((acc, [_name, code]) => {
    acc[code] = [];
    return acc;
  }, {} as Record<ErrorCode, ASCTBError[]>);

  warnings.forEach(err => errorsByCode[err.code].push(err));


  // Loop for checking the group of errors, and if length of the group errors is more then 0 then it has failed the validation and vise versa
  for (const [name, code] of namedErrorCodes) {
    const hasErrors = errorsByCode[code].length > 0;
    lines.push(`Validation ${name} ${hasErrors ? 'failed' : 'passed'}`);
  }

  // Adding extra lines for space
  lines.push('', '');

  for (const [name, code] of namedErrorCodes) {
    const errors = errorsByCode[code];
    if (errors.length === 0) {
      continue;
    }

    lines.push(`Validation feedback for ${name}`);
    errors.forEach(error => formatError(error, lines));
  }

  console.log(lines);

  // DOUBTS
  // 1. Do we have to reuse the evaluations that are stored as the warnings when we are running the api.funtion.ts file
  // if we are reusing it then how to identify that which warning is part of which validation test, 
  // because all the checks are accumalated in the single array 'warnings'


  // Build report from results

  return lines;
}

function formatError(error: ASCTBError, lines: string[]): void {
  switch (error.code) {
  case ErrorCode.InvalidCsvFile:
    lines.push(`This file is not a valid CSV File: ${error.filename} \n`);
    break;

  case ErrorCode.UnmappedMetadata:
    lines.push(`Unmapped/Missing Metadata field found for ${error.key} \n`);
    break;

  case ErrorCode.InvalidHeader:
    lines.push(`Invalid Header found at column: ${error.cNumber} where Header value: ${error.headerName} \n`);
    break;

  case ErrorCode.MissingHeader:
    lines.push(`Header Value Missing at column: ${error.cNumber}, row: ${error.rNumber} \n`);
    break;

  case ErrorCode.InvalidCharacter:
    lines.push(`Invalid Character found at column: ${error.cName}, row: ${error.rInd} \n`);
    break;

  case ErrorCode.UnmappedData:
    lines.push(`Unmapped data found at column: ${error.cNumber} and at Header Value: ${error.headerName} or ${error.originalArrayName}`);
    break;

  case ErrorCode.BadColumn:
    lines.push(`Bad column found at Header Name: ${error.headerName}`);
    break;

  default:
    break;
  }
}
