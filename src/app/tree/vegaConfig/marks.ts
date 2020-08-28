import { Mark } from 'vega';

import { TreeMarkGroup } from './groups/tree'
import { MultiParentMarkGroup } from './groups/multiparent';
import { BimodalMarkGroup } from './groups/bimodal';

interface VegaMark {
	marks: Array<Mark>;
}

export class Marks implements VegaMark {
	marks: any;

	constructor() {
        this.marks = [
            this.makeTreeMarkGroup(),
            this.makeMultiParentMarkGroup(),
            this.makeBimodalMarkGroup()
        ];

		return this.marks; 
    }
    
    makeTreeMarkGroup() {
        return new TreeMarkGroup();
    }

    makeMultiParentMarkGroup() {
        return new MultiParentMarkGroup();
    }

    makeBimodalMarkGroup() {
        return new BimodalMarkGroup();
    }
}
