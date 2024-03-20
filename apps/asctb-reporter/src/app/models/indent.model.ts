export class ILNode {
  name: string;
  ontologyId: string;
  children?: ILNode[];
  color: string;
  comparator: string;
  type: string;

  constructor(
    name: string,
    children: ILNode[],
    ontologyId: string,
    color = '#808080'
  ) {
    this.name = name;
    this.children = children;
    this.ontologyId = ontologyId;
    this.color = color;
    this.comparator = '';
    this.type = '';
  }

  public search(name: string) {
    for (const child of this.children ?? []) {
      if (child.name.toLowerCase() === name.toLowerCase()) {
        return child;
      }
    }
    return {};
  }
}
