import { Component } from '@angular/core';

export interface ValidationTaskItems {
  task: string;
  //Statically defined rightnow
  // TODO - take dynamically
  blood: any;
  lungs: any;
  eyes: any;
}

const ITEMS_DATA: ValidationTaskItems[] = [
  { task: 'Valid CSV File?', blood: true, lungs: true, eyes: true },
  { task: 'Metadata Rows Filled?', blood: true, lungs: true, eyes: true },
  { task: 'Header Valid?', blood: true, lungs: true, eyes: true },
  { task: 'Invalid Characters in CSV?', blood: true, lungs: true, eyes: true },
];

/**
 * @title Table with columns defined using ngFor instead of statically written in the template.
 */
@Component({
  selector: 'app-validation-table',
  styleUrls: ['validation-table.component.scss'],
  templateUrl: 'validation-table.component.html',

})
export class ValidationTableComponent {
  columns = [
    {
      columnDef: 'task',
      header: 'Validation Task',
      cell: (element: ValidationTaskItems) => `${element.task}`,
    },
    {
      columnDef: 'blood',
      header: 'Blood',
      cell: (element: ValidationTaskItems) => `${element.blood}`,
    },
    {
      columnDef: 'lungs',
      header: 'Lungs',
      cell: (element: ValidationTaskItems) => `${element.lungs}`,
    },
    {
      columnDef: 'eyes',
      header: 'Eyes',
      cell: (element: ValidationTaskItems) => `${element.eyes}`,
    },
  ];
  dataSource = ITEMS_DATA;
  displayedColumns = this.columns.map(c => c.columnDef);
}
