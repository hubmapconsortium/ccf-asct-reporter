import { SnackbarType } from './response.model';

export interface Snackbar {
  opened: boolean;
  text: string;
  type: SnackbarType;
}

export interface Loading {
  loading: boolean;
  loadingText: string;
}
