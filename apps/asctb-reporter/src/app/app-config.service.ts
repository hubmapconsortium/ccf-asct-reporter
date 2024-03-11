import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SheetDetails } from './models/sheet.model';
import { map, shareReplay, take } from 'rxjs/operators';

@Injectable()
export class ConfigService {
  allSheetConfigurations$ = this.http
    .get<SheetDetails[]>('assets/sheet-config.json')
    .pipe(take(1), shareReplay(1));
  allOMAPSheetConfigurations$ = this.http
    .get<SheetDetails[]>('assets/omap-sheet-config.json')
    .pipe(take(1), shareReplay(1));

  sheetConfiguration$ = this.allSheetConfigurations$.pipe(
    map((data) =>
      data
        .map((element) => ({
          ...element,
          version:
            element.version?.filter(
              (version) => !version.viewValue.includes('DRAFT')
            ) ?? [],
        }))
        .filter(
          (element) => element.name === 'some' || element.version?.length > 0
        )
    )
  );

  omapsheetConfiguration$ = this.allOMAPSheetConfigurations$.pipe(
    map((data) =>
      data
        .map((element) => ({
          ...element,
          version:
            element.version?.filter(
              (version) => !version.viewValue.includes('DRAFT')
            ) ?? [],
        }))
        .filter((element) => element.version.length > 0)
    )
  );

  config$ = this.http
    .get<Record<string, unknown>>('assets/configuration.json')
    .pipe(take(1), shareReplay(1));

  constructor(private readonly http: HttpClient) {}
}
