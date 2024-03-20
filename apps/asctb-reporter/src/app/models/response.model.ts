export interface Response {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  msg: string;
  status: number;
}

export interface Error {
  hasError?: boolean;
  msg?: string;
  status?: number;
  hasGidError?: boolean;
}

export enum SnackbarType {
  success = 'success',
  error = 'error',
  warning = 'warning',
}

export interface ExportVega {
  option: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  spec?: any;
}
