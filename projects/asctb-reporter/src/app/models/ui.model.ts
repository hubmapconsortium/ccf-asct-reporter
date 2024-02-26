import { Log } from './logs.model';
import { SnackbarType } from './response.model';
import { Reference } from './sheet.model';

export interface Snackbar {
  opened: boolean;
  text: string;
  type: SnackbarType;
}

export interface Loading {
  loading: boolean;
  loadingText: string;
}

export interface OpenBottomSheetData {
  name: string;
  ontologyId: string;
  group: number;
  references: Reference[];
  notes: string;
}

export interface Logs {
  sheetLogs: Log;
  allLogs: Log[];
}
