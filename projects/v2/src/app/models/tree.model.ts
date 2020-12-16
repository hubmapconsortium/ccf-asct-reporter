export const AS_RED = '#E41A1C';
export const CT_BLUE = '#377EB8';
export const B_GREEN = '#4DAF4A';

export class TNode {
  id: any;
  name: string;
  parent: string;
  uberonId: string;
  color: string;
  problem: boolean;
  found: boolean;
  groupName: string;
  isNew: boolean;
  pathColor: string;
  parents: Array<number>;

  constructor(id, name, parent, uId, color = '#808080') {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.uberonId = uId;
    this.color = color;
    this.problem = false;
    this.groupName = 'Multi-parent Nodes';
    this.isNew = false;
    this.pathColor = '#ccc';
    this.parents = [];
  }
}

export class TreeAndMultiParent {
  tree: Array<TNode>;
  multiParentLinks: any;

}

