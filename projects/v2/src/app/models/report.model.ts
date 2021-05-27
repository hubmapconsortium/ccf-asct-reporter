import { AS, CT, B } from './tree.model';

export interface Report {
  ASWithNoLink: AS[];
  CTWithNoLink: CT[];
  BWithNoLink: B[];
  anatomicalStructures: AS[];
  cellTypes: CT[];
  biomarkers: B[];
}

export interface CByOrgan {
  organName?: string;
  anatomicalStructures?: number;
  cellTypes?: number;
  biomarkers?: number;
}
