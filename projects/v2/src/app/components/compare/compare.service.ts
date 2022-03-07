import { Injectable } from '@angular/core';
import { CompareData } from '../../models/sheet.model';

@Injectable({
  providedIn: 'root'
})
export class CompareService {

  constructor() { }
  compareDetails: CompareData[] = [];

  getCompareDetails(): CompareData[] {
    return this.compareDetails;
  }

  setCompareDetails(compareDetails: CompareData[]) {
    this.compareDetails = compareDetails;
  }
}
