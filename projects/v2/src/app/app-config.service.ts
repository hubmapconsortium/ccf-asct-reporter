import { Injectable }  from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SheetDetails } from './models/sheet.model';
import { shareReplay, take } from 'rxjs/operators';


@Injectable()
export class ConfigService {
    

    sheetConfiguration$ = this.http.get<SheetDetails[]>('assets/sheet-config.json').pipe(take(1), shareReplay(1));
    config$ = this.http.get<Record<string, unknown>>('assets/configuration.json').pipe(take(1), shareReplay(1));

    constructor(private readonly http: HttpClient) {}
    
}
