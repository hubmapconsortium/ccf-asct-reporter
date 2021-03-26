import { Injectable } from '@angular/core';

declare let gtag: (arg1?, arg2?, arg3?) => void;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() { }

  public eventEmitter( 
    eventName: string, 
    eventCategory: string, 
    eventLabel: string = null,  
    eventAction: string, 
    eventValue: number = null ){ 
    gtag('event', eventName, {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    })
  };
}
