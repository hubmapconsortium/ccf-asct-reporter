import { Injectable } from '@angular/core';
declare let ga:Function; // Declare ga as a function

@Injectable({
  providedIn: 'root'
})
export class GaService {

  constructor() { }
  public eventEmitter(eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null) {
      ga('send', 'event', {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
      });
    }
}
