import { Error } from '../models/response.model';

export class OpenLoading {
  static readonly type = '[OPEN] Loading';
}

export class CloseLoading {
  static readonly type = '[CLOSE] Loading';
}

export class HasError {
  static readonly type = '[ERROR] Has Error';
  constructor(public error: Error) {}
}

export class NoError {
  static readonly type = '[ERROR] No Error'
}