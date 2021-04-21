import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
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
      // Make this check true to enable GA on local development
      if (environment.tag !== 'Development') {
        gtag('event',  eventName, {
          event_category: eventCategory.toString(),
          // Concatenating name and label into the event_label field, as otherwise the eventName is unused in the GA report.
          event_label: `${eventName}: ${eventLabel}`,
          event_action: eventAction.toString(),
          value : 0
        });
      }
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
