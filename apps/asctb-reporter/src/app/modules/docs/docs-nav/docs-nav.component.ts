import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { REGISTRY } from '../../../static/docs';

@Component({
  selector: 'app-docs-nav',
  templateUrl: './docs-nav.component.html',
  styleUrls: ['./docs-nav.component.scss'],
})
export class DocsNavComponent{
  REGISTRY = REGISTRY;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;

  @Input() next: number | null = null;
  @Input() prev: number | null = null;
  @Output() nextClick = new EventEmitter();
  @Output() prevClick = new EventEmitter();
}
