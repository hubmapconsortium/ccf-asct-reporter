import { Scale } from 'vega';

interface VegaScale {
  scales: Array<Scale>;
}

export class Scales implements VegaScale {
  scales: any;

  constructor() {
    this.scales = [
      this.makeBiomodalScale(),
      this.makeTreeLegendScale()
    ];

    return this.scales;
  }

  /**
   * Creates the color scaling that is used to form the
   * bimodal and tree legend. Red, blue and gree are the
   * colors. It uses the properly 'groupName' to assign
   * color.
   */

  makeBiomodalScale() {
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

  makeTreeLegendScale() {
    return {
      name: 'treeLegend',
      type: 'ordinal',
      domain: { data: 'tree', field: 'groupName' },
      range: ['#E41A1C'],
    };
  }


}
