import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare let ga: (arg1?, arg2?, arg3?) => void;

@Injectable({
  providedIn: 'root'
})
export class GaService {

  constructor() { }
  public eventEmitter(eventCategory: string,
                      eventAction: string,
                      eventLabel: string = null,
                      eventValue: number = null) {
    if (environment.production) {
      ga('send', 'event', {
        eventCategory,
        eventLabel,
        eventAction,
        eventValue
      });
    }
  }
}
