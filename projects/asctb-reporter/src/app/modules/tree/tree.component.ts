import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  constructor() {}
  @ViewChild('graph') treeElementRef: ElementRef;

  ngOnInit() {}

}
