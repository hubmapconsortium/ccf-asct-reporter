import { DOCUMENT } from '@angular/common';
import { Inject, NgModule } from '@angular/core';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { fromEvent, Subscription } from 'rxjs';
import { map, throttleTime } from 'rxjs/operators';


export function trackMousePosition(el: HTMLElement, ga: GoogleAnalyticsService): Subscription {
  const formatData = (event: MouseEvent) => {
    const { clientWidth, clientHeight } = el;
    const { clientX, clientY } = event;
    const points = [clientX, clientY, clientWidth, clientHeight];
    return points.join('_');
  };

  const events = fromEvent<MouseEvent>(el, 'mousemove').pipe(
    throttleTime(1000),
    map(formatData)
  );

  return events.subscribe(data => ga.event('webpage', 'mousemove', data));
}


@NgModule()
export class MousePositionTrackerModule {
  constructor(
  // NOTE: Angular compiler fails when document is typed properly?!
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  @Inject(DOCUMENT) document: any,
                    ga: GoogleAnalyticsService
  ) {
    if (document) {
      trackMousePosition((document as Document).body, ga);
    }
  }
}
