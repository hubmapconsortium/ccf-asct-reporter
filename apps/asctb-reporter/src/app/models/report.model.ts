import { Sheet } from './sheet.model';
import { AS, B, CT } from './tree.model';

export interface Report {
  ASWithNoLink: AS[];
  CTWithNoLink: CT[];
  BWithNoLink: B[];
  anatomicalStructures: AS[];
  cellTypes: CT[];
  biomarkers: B[];
  ASWithNoCT: EntityWithNoOtherEntity[];
  CTWithNoB: EntityWithNoOtherEntity[];
}

export interface ReportData {
  data: Report;
  sheet: Sheet;
}

export interface CByOrgan {
  organName?: string;
  anatomicalStructures?: number;
  cellTypes?: number;
  biomarkers?: number;
}

export interface EntityWithNoOtherEntity {
  structure: string;
  organName: string;
  link: string;
  label: string;
}

export interface BiomarkersNamesInReport {
  type: string;
  name: string;
}

export interface BiomarkersCounts {
  name: string;
  value: number;
}
