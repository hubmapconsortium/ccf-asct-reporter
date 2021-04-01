import { Injectable } from '@angular/core';
import { GaAction, GaNodeInfo } from '../models/ga.model';

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
      eventCategory,
      eventLabel,
      eventAction: eventAction.toString(),
      eventValue
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
