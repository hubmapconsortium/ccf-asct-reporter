import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Select, Store } from '@ngxs/store';
import { UIState } from '../../store/ui.state';
import { Observable } from 'rxjs';
import { ToggleControlPane } from '../../actions/ui.actions';
import { Error } from '../../models/response.model';

@Component({
  selector: 'app-control-pane',
  templateUrl: './control-pane.component.html',
  styleUrls: ['./control-pane.component.scss']
})
export class ControlPaneComponent implements OnInit {
  @Input() error: Error;
  
  constructor(public store: Store) {

  }

  ngOnInit(): void {

  }

  togglePane() {
    this.store.dispatch(new ToggleControlPane());
  }

  sendMail() {
    const subject = `About the ASCT+B Reporter!`;
    const body = `Hi, thank you for wanting to contact us! This is an auto-generated body template. Below are a list of possible subjects, %0D%0A%0D%0A1. Issue/bug wit the Reporter%0D%0A%0D%0A2. Feature request for the reporter.%0D%0A%0D%0A3. General discussion about the Reporter.`;
    const mailText = `mailto:infoccf@indiana.edu?subject=${subject}&body=${body}`;
    window.location.href = mailText;
    // this.ga.eventEmitter( 'report', 'click',  'Report Problem' , 1);
  }


}
