import { GroupMark, Mark } from 'vega';
import { BimodalMarkGroup } from './groups/bimodal';
import { MultiParentMarkGroup } from './groups/multiparent';
import { TreeMarkGroup } from './groups/tree';

export class Marks {
  static create(): Mark[] {
    return new Marks().marks;
  }

  /**
   * List of vega marks
   */
  marks: Mark[];

  constructor() {
    this.marks = [
      this.makeMultiParentMarkGroup(),
      this.makeTreeMarkGroup(),
      this.makeBimodalMarkGroup(),
    ];
  }

  /**
   * Creates mark group for the AS tree
   */
  makeTreeMarkGroup(): GroupMark {
    return TreeMarkGroup.create();
  }

  /**
   * Creates mark group for multiparent (depricated)
   */
  makeMultiParentMarkGroup(): GroupMark {
    return MultiParentMarkGroup.create();
  }

  /**
   * Creates mark group for bimodal network
   */
  makeBimodalMarkGroup(): GroupMark {
    return BimodalMarkGroup.create();
  }
}
