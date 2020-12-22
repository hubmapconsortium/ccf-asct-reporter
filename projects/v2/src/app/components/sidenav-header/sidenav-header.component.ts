import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav-header',
  templateUrl: './sidenav-header.component.html',
  styleUrls: ['./sidenav-header.component.scss']
})
export class SidenavHeaderComponent implements OnInit {
  
  @Input() title: string;
  @Input() download: boolean = false;
  @Input() tooltipString: string = 'Hello';
  @Output() close: EventEmitter<any> =  new EventEmitter<any>();
  @Output() downloadFn: EventEmitter<any> =  new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    console.log(this.tooltipString)
  }
  
  

}
