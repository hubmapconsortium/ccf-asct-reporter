export class ILNode {
  name: string;
  ontologyId: string;
  children?: ILNode[];
  color: string;
  comparator: string;
  type: string;

  constructor(name, children, ontologyId, color = '#808080') {
    this.name = name;
    this.children = children;
    this.ontologyId = ontologyId;
    this.color = color;
    this.comparator = '';
    this.type = '';
  }

  public search(name) {
    for (const i in this.children) {
      if (this.children[i].name.toLowerCase() === name.toLowerCase()) {
        return this.children[i];
      }
    }
    return {};
  }
}
