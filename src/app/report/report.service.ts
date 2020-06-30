import { Injectable } from '@angular/core';
import { SheetService } from '../services/sheet.service';

@Injectable({
  providedIn: 'root'
})
export class IndentService {

  constructor(public sheet: SheetService) { }
  
}
