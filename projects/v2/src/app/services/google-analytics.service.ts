import { Injectable } from '@angular/core';
import { GaAction, GaCategory, GaNodeInfo } from '../models/ga.model';

declare let gtag: (arg1?, arg2?, arg3?) => void;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() { }

  public eventEmitter(
    eventName: string,
    eventCategory: GaCategory,
    eventLabel: string = null,
    eventAction: GaAction,
    // Unused parameter for now, as the GA report is not displaying event values.
    eventValue: any = 0 ){
    gtag('event',  eventName, {
      event_category: eventCategory.toString(),
      event_label: eventLabel,
      event_action: eventAction.toString(),
      value : 0
    });
  }

  public makeNodeInfoString(node: any) {
    const nodeInfo: GaNodeInfo = {
      oid: node.ontologyId,
      type: node.type,
      x: node.x,
      y: node.y
    };
    return JSON.stringify(nodeInfo);
  }

}
