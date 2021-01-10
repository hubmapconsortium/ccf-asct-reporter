import { Legend } from 'vega';

interface VegaLegend {
  legends: Array<Legend>;
}

export class Legends implements VegaLegend {
  legends: any;

  constructor() {
    this.legends = [
      // this.makeBimodalLegend(),
      // this.makeTreeLegend()
    ];

    return this.legends;
  }

  makeBimodalLegend() {
    return {
      type: 'symbol',
      orient: 'top-left',
      fill: 'bimodal',
      title: 'Legend',
      offset: -15,
      titlePadding: 20,
      titleFontSize: 16,
      labelFontSize: 14,
      labelOffset: 10,
      symbolSize: 200,
      rowPadding: 10,
    };
  }

  makeTreeLegend() {
    return {
      type: 'symbol',
      orient: 'none',
      legendX: -15,
      legendY: 98,
      fill: 'treeLegend',
      labelFontSize: 14,
      labelOffset: 10,
      symbolSize: 200,
      rowPadding: 10,
      encode: {
        symbols: {
          update: {
            stroke: { value: 'black' },
            strokeWidth: { value: 2 },
          },
        },
      },
    };
  }


}
