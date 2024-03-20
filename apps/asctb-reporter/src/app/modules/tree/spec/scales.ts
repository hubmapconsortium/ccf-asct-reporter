import { Scale } from 'vega';

export class Scales {
  static create(): Scale[] {
    return new Scales().scales;
  }

  scales: Scale[];

  constructor() {
    this.scales = [this.makeBiomodalScale(), this.makeTreeLegendScale()];
  }

  /**
   * Creates the color scaling that is used to form the
   * bimodal and tree legend. Red, blue and gree are the
   * colors. It uses the properly 'groupName' to assign
   * color.
   */

  makeBiomodalScale(): Scale {
    return {
      name: 'bimodal',
      type: 'ordinal',
      domain: { data: 'nodes', field: 'groupName' },
      range: ['#E41A1C', '#377EB8', '#4DAF4A'],
    };
  }

  /**
   * Creates the color scaling that is used to form the
   * tree legend. It is for the See Debug Log option in
   * the legend and only has the red color.
   */

  makeTreeLegendScale(): Scale {
    return {
      name: 'treeLegend',
      type: 'ordinal',
      domain: { data: 'tree', field: 'groupName' },
      range: ['#E41A1C'],
    };
  }
}
