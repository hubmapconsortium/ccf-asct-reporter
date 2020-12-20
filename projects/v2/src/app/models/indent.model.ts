export class ILNode {
  name: string;
  uberon: string;
  children?: ILNode[];
  color: string;

  constructor(name, children, uberon, color = '#808080') {
    this.name = name;
    this.children = children;
    this.uberon = uberon;
    this.color = color;
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