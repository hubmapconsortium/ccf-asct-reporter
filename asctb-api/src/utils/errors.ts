export enum ErrorCode {
  InvalidCsvFile = 1,
  UnmappedMetadata = 2,
  InvalidHeader = 3,
  MissingHeader = 4,
  InvalidCharacter = 5,
  MissingCTorAnatomy = 6,
  UnmappedData = 7,
  BadColumn = 8
  //
}

export interface InvalidCsvFileError {
  code: ErrorCode.InvalidCsvFile,
  filename: string;
}

export interface UnmappedMetadataError {
  code: ErrorCode.UnmappedMetadata;
  key: string;
}

export interface InvalidHeaderError {
  code: ErrorCode.InvalidHeader;
  cNumber: number;
  rNumber: number;
  headerName: string;
}

export interface MissingHeaderError {
  code: ErrorCode.MissingHeader;
  cNumber: number;
  rNumber: number;
}

export interface InvalidCharacterError {
  code: ErrorCode.InvalidCharacter;
  rInd: number;
  cName: string;
}

export interface UnmappedDataError {
  code: ErrorCode.UnmappedData;
  cNumber: number;
  cName: string;
  headerName?: string;
  originalArrayName?: string;
}

export interface BadColumnError {
  code: ErrorCode.BadColumn;
  headerName: string;
}
export type ASCTBError = InvalidCsvFileError | UnmappedMetadataError | InvalidHeaderError | InvalidCharacterError | UnmappedDataError | MissingHeaderError | BadColumnError;


