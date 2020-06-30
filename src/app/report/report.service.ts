import { Injectable } from '@angular/core';
import { SheetService } from '../sheet.service';

@Injectable({
  providedIn: 'root'
})
export class IndentService {

  constructor(public sheet: SheetService) { }
  
}
