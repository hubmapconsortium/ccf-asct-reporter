import { Mark } from 'vega';

import { TreeMarkGroup } from './groups/tree';
import { MultiParentMarkGroup } from './groups/multiparent';
import { BimodalMarkGroup } from './groups/bimodal';

interface VegaMark {
  /**
   * List of vega marks
   */
  marks: Array<Mark>;
}

export class Marks implements VegaMark {
  /**
   * List of vega marks
   */
  marks: any;

  constructor() {
    this.marks = [
      this.makeMultiParentMarkGroup(),
      this.makeTreeMarkGroup(),
      this.makeBimodalMarkGroup()
    ];

    return this.marks;
  }

  /**
   * Creates mark group for the AS tree
   */
  makeTreeMarkGroup() {
    return new TreeMarkGroup();
  }

  /**
   * Creates mark group for multiparent (depricated)
   */
  makeMultiParentMarkGroup() {
    return new MultiParentMarkGroup();
  }

  /**
   * Creates mark group for bimodal network
   */
  makeBimodalMarkGroup() {
    return new BimodalMarkGroup();
  }
}
