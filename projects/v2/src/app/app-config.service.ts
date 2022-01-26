import { Injectable }  from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SheetService } from './services/sheet.service';
import { SheetDetails } from './models/sheet.model';
import { shareReplay } from 'rxjs/operators';
 
@Injectable()
export class ConfigService {

    config$ 
    sheetConfiguration$
 
    constructor(private readonly http: HttpClient,public sheetservice: SheetService) {
      this.sheetConfiguration$ = this.http.get<SheetDetails[]>('assets/sheet-config.json').pipe(shareReplay(1));
      this.config$ = this.http.get<Record<string, unknown>>('assets/configuration.json').pipe(shareReplay(1));
    }
}