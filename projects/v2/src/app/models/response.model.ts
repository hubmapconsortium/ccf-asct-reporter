export interface Response {
  data: any;
  msg: string;
  status: number;
}

export interface Error {
  hasError?: boolean;
  msg?: string;
  status?: number;
}