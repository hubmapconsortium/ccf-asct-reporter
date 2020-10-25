import { Injectable } from '@angular/core';

declare var gtag;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() { }

  public eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null
  ){
    gtag('event', eventName, {
      event_name: eventName,
      event_category: eventCategory,
      event_label: eventAction,
      value: eventValue
    });
  }
}
