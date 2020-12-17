import { Component, OnInit, Input } from '@angular/core';
import { Error } from '../../models/response.model';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  @Input() error: Error

  constructor() { }

  ngOnInit(): void {
  }

}
