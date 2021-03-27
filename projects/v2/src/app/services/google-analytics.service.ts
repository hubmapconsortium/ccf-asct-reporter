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

// Standard set of actions for GA events
export enum GaAction {
  // Action for Form inputs
  INPUT = "input", 
  // Action for toggle ui elements
  TOGGLE = "toggle",
  // Action for slider change enents
  SLIDE = "slide",
  // Action for other button clicks or graph clicks
  CLICK = "click",
  // Action for module navigation
  NAV = "nav"
}

export enum GaCategory {
  NAVBAR = "navbar",
  GRAPH = "graph",
  COMPARE = "compare",
  VISCONTROLS = "viscontrols"
}