import { Injectable } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";
import { Store, Select } from '@ngxs/store';
import { UIState } from '../../store/ui.state';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControlPaneService  {
  
  constructor(private store: Store) {
    
  }

}
