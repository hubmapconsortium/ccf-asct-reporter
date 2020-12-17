import { Error } from '../models/response.model';

export class OpenLoading {
  static readonly type = '[OPEN] Loading';
  constructor(public text: string) {}
}

export class UpdateLoadingText {
  static readonly type = '[UPDATE] Loading Text';
  constructor(public text: string) {}
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

export class ToggleControlPane {
  static readonly type = '[TOGGLE] Control Pane';
  constructor() {}
}