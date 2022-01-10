import { Injectable }  from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
@Injectable()
export class AppInitService {

    SHEET_CONFIGURATION:any
 
    constructor(private readonly http: HttpClient) {
    }
    
    Init() {
      return new Promise<void>((resolve, reject) => {
        this.http.get('assets/sheet-config.json').subscribe(data=>{
          this.SHEET_CONFIGURATION = data;
          resolve();
        });
      });
    }
}