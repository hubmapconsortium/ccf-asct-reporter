export class ILNode {
  name: string;
  ontology_id: string;
  children?: ILNode[];
  color: string;
  comparator: string;
  type: string;

  constructor(name, children, ontology_id, color = '#808080') {
    this.name = name;
    this.children = children;
    this.ontology_id = ontology_id;
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
