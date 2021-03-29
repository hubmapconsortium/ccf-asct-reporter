import { Injectable } from '@angular/core';
import { GaAction } from '../models/ga.model';

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
    eventAction: GaAction, 
    eventValue: any = null ){ 
    gtag('event', eventName, {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction.toString(),
      eventValue: eventValue
    })
  };
}

