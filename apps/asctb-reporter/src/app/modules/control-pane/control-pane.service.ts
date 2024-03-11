import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root',
})
export class ControlPaneService {
  constructor(private store: Store) {}
}
