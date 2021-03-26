  
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { REGISTRY } from '../../../static/docs';
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-docs-nav',
  templateUrl: './docs-nav.component.html',
  styleUrls: ['./docs-nav.component.scss']
})
export class DocsNavComponent implements OnInit {
  REGISTRY = REGISTRY;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;

  @Input() next: number | null;
  @Input() prev: number | null;
  @Output() nextClick = new EventEmitter();
  @Output() prevClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

}