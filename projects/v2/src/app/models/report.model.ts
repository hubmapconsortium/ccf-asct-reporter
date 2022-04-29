import { AS, CT, B } from './tree.model';

export interface Report {
  ASWithNoLink: AS[];
  CTWithNoLink: CT[];
  BWithNoLink: B[];
  anatomicalStructures: AS[];
  cellTypes: CT[];
  biomarkers: B[];
  ASWithNoCT: EnityWithNoOtherEntity[];
  CTWithNoB: EnityWithNoOtherEntity[];
}

export interface CByOrgan {
  organName?: string;
  anatomicalStructures?: number;
  cellTypes?: number;
  biomarkers?: number;
}

export interface EnityWithNoOtherEntity {
  structure: string;
  organName: string;
  link: string;
  label: string;
}
