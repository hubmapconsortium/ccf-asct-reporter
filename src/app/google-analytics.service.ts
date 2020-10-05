import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
declare let gtag:Function;
export class GoogleAnalyticsService {

  constructor() { }

  public eventEmitter( 
    eventName: string, 
    eventCategory: string, 
    eventAction: string, 
    eventLabel: string = null,  
    eventValue: number = null ){ 
         gtag('event', eventName, { 
                 eventCategory: eventCategory, 
                 eventLabel: eventLabel, 
                 eventAction: eventAction, 
                 eventValue: eventValue
               })
    }
}
