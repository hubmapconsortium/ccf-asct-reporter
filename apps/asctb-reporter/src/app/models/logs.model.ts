export enum LOG_TYPES {
  MSG = 'MSG',
  NO_OUT_LINKS = 'NO_OUT_LINKS',
  NO_IN_LINKS = 'NO_IN_LINKS',
  MULTI_IN_LINKS = 'MULTI_IN_LINKS',
  SELF_LINKS = 'SELF_LINKS',
}

export enum LOG_ICONS {
  error = 'cancel',
  warning = 'error',
  success = 'check_circle',
  file = 'next_plan',
}

export interface Log {
  id: number;
  messages: LogEntry[];
  NO_OUT_LINKS: string[];
  NO_IN_LINKS: string[];
  MULTI_IN_LINKS: string[];
  SELF_LINKS: string[];
}

export interface LogEntry {
  icon: string;
  text: string;
  version: string;
}
