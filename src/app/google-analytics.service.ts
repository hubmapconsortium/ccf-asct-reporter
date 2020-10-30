import { Injectable } from '@angular/core';

declare var gtag;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() { }

  public eventEmitter(
    eventName: string,
    eventAction: string,
    eventCategory: string,
    eventLabel: string,
    eventValue: number
  ){
    gtag('event', eventName, {
      event_action: eventAction,
      event_category: eventCategory,
      event_label: eventLabel,
      event_value: eventValue
    });
  }
}
