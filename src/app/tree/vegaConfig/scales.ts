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

	makeBiomodalScale() {
		return {
			name: 'bimodal',
			type: 'ordinal',
			domain: { data: 'nodes', field: 'groupName' },
			range: ['#E41A1C', '#377EB8', '#4DAF4A'],
		}
	}

	makeTreeLegendScale() {
		return {
			name: 'treeLegend',
			type: 'ordinal',
			domain: { data: 'tree', field: 'groupName' },
			range: ['#E41A1C'],
		}
	}


}
