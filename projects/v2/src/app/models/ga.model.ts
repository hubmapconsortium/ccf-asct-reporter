// Standard set of actions for GA events

export enum GaAction {
  // Action for Form inputs
  INPUT = "input",
  // Action for toggle ui elements
  TOGGLE = "toggle",
  // Action for slider change enents
  SLIDE = "slide",
  // Action for other button clicks or graph clicks
  CLICK = "click",
  // Action for module navigation
  NAV = "nav"
}

export enum GaCategory {
  NAVBAR = "navbar",
  GRAPH = "graph",
  COMPARE = "compare",
  VISCONTROLS = "viscontrols"
}