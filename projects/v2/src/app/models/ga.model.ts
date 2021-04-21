// Standard set of actions for GA events
export enum GaAction {
  // Action for form inputs
  INPUT = 'input',
  // Action for toggle ui elements
  TOGGLE = 'toggle',
  // Action for slider change enents
  SLIDE = 'slide',
  // Action for other button clicks or graph clicks
  CLICK = 'click',
  // Action for module navigation or external links
  NAV = 'nav'
}

// Various event categories
export enum GaCategory {
  HOME = 'home',
  DOCS = 'docs',
  REPORT = 'report',
  NAVBAR = 'navbar',
  PLAYGROUND = 'playground',
  GRAPH = 'graph',
  COMPARE = 'compare',
  CONTROLS = 'controls'
}

// Information to be emitted on each Comparison event
export interface GaCompareInfo {
  title: string;
  desc: string;
  link: string;
  color: string;
}

// Information to be emitted on each Node Click event
export interface GaNodeInfo {
  oid: string;
  type: string;
  x: number;
  y: number;
}
