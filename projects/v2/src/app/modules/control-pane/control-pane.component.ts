import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Select, Store } from '@ngxs/store';
import { UIState } from '../../store/ui.state';
import { Observable } from 'rxjs';
import { ToggleControlPane } from '../../actions/ui.actions';

@Component({
  selector: 'app-control-pane',
  templateUrl: './control-pane.component.html',
  styleUrls: ['./control-pane.component.scss']
})
export class ControlPaneComponent implements OnInit {
  constructor(public store: Store) { 
    
  }

  ngOnInit(): void {

  }

  togglePane() {
    this.store.dispatch(new ToggleControlPane())
  }


}
