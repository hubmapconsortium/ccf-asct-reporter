import { Injectable }  from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';
import { SheetService } from './services/sheet.service';
import { SheetDetails } from './models/sheet.model';
 
@Injectable()
export class ConfigService {

    CONFIG = new ReplaySubject(2);
    SHEET_CONFIGURATION = new ReplaySubject<SheetDetails[]>(2);
 
    constructor(private readonly http: HttpClient,public sheetservice: SheetService) {
    }
    
    Init() {
      return new Promise<void>((resolve, reject) => {

        const promise1 = new Promise<void>(() => { 
          this.http.get<SheetDetails[]>('assets/sheet-config.json').subscribe(data=>{
            this.SHEET_CONFIGURATION.next(data);
            this.sheetservice.subject_sheetservice.next(data);
            resolve();
          });
        });

        const promise2 = new Promise<void>(() => { 

          this.http.get('assets/configuration.json').subscribe(data=>{
            this.CONFIG.next(data);
            resolve();
          });
        });

        Promise.all([promise1, promise2]).then((values) => {
          resolve();
        });

      });


    }
}