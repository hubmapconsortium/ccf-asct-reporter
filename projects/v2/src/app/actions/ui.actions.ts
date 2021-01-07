import { Error, SnackbarType } from '../models/response.model';

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
  constructor(public text?: string) {}
}

export class HasError {
  static readonly type = '[ERROR] Has Error';
  constructor(public error: Error) {}
}

export class NoError {
  static readonly type = '[ERROR] No Error';
}

export class ToggleControlPane {
  static readonly type = '[TOGGLE] Control Pane';
  constructor() {}
}

export class OpenSnackbar {
  static readonly type = '[OPEN] Snackbar';
  constructor(public text: string, public type: SnackbarType) {}
}

export class CloseSnackbar {
  static readonly type = '[CLOSE] Snackbar';
  constructor() {}
}


export class ToggleIndentList {
  static readonly type = '[TOGGLE] Indent List';
  constructor() {}
}

export class ToggleReport {
  static readonly type = '[TOGGLE] Report';
  constructor() {}
}

export class ToggleDebugLogs {
  static readonly type = '[TOGGLE] Debug Logs';
  constructor() {}
}

export class CloseRightSideNav {
  static readonly type = '[CLOSE] Right Side Nav';
  constructor() {}
}

export class ToggleBottomSheet {
  static readonly type = '[TOGGLE] Bottom Sheet';
  constructor() {}
}

export class OpenBottomSheet {
  static readonly type = '[OPEN] Bottom Sheet';
  constructor(public data: any) {}
}

export class CloseBottomSheet {
  static readonly type = '[CLOSE] Bottom Sheet';
  constructor() {}
}

export class OpenCompare {
  static readonly type = '[OPEN] Compare';
  constructor() {}
}

export class CloseCompare {
  static readonly type = '[CLOSE] Compare';
  constructor() {}
}