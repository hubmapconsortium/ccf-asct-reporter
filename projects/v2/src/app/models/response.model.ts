export interface Response {
  data: any;
  msg: string;
  status: number;
}

export interface Error {
  msg?: string;
  status?: number;
}