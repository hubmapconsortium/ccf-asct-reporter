import { Injectable } from '@angular/core';
import { SheetService } from '../services/sheet.service';
import { ReportService } from '../report/report.service';

// Used in the tree visualization
export class TNode {
	id: any;
	name: String;
	parent: String;
	uberon_id: String;
	color: string;
	problem: boolean;

	constructor(id, name, parent, u_id, color = "#808080") {
		this.id = id;
		this.name = name;
		this.parent = parent;
		this.uberon_id = u_id;
		this.color = color;
		this.problem = false;
	}
}

// Used in the tree visualization
export class Tree {
	nodes: Array<TNode>;
	id: any;

	constructor(id) {
		this.nodes = [];
		this.id = id;
	}

	public append(node) {
		this.nodes.push(node);
	}

	public search(name, nodeParent) {
		for (let i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].name == name) {
				let parent = this.nodes.findIndex(i => i.name == nodeParent.name)
				if (this.nodes[parent].id != this.nodes[i].parent) {
					this.nodes[i].problem = true;
				}
				return this.nodes[i];
			}
		}
		return {};
	}

}

const AS_RED = "#E41A1C"

@Injectable({
	providedIn: 'root'
})
export class TreeService {

	constructor(public sheet: SheetService, public report: ReportService) { }

	public makeTreeData(data): Promise<Array<TNode>> {
    return new Promise((res, rej) => {
			const cols = this.sheet.sheet.tree_cols;
    const id = 1;
    let parent;
    const tree = new Tree(id);

    const root = new TNode(id, this.sheet.sheet.body, 0, 0, AS_RED);
    delete root.parent; delete root.uberon_id;
    tree.append(root);

    data.forEach(row => {
      parent = root;
      for (let col = 0; col < cols.length; col++) {

        if (row[cols[col]] == '') {
          continue;
        }

        let foundNodes = row[cols[col]].trim().split()
        for (var i = 0; i < foundNodes.length; i++) {
          if (foundNodes[i] != '') {
            let searchedNode = tree.search(foundNodes[i], parent);

            if (Object.keys(searchedNode).length !== 0) {
              if (searchedNode['problem']) {
                this.report.reportLog(`Multiple parents found for node - ${searchedNode['name']}`, 'warning', 'msg')
              }
              parent = searchedNode;
            } else {
              tree.id += 1;
              let newNode = new TNode(tree.id, foundNodes[i], parent.id, row[cols[col] + this.sheet.sheet.uberon_row], AS_RED);

              tree.append(newNode);
              parent = newNode;
            }
          }
        }
      }
    });

    if (tree.nodes.length < 0) {
      rej(['Could not process tree data'])
    }

    res(tree.nodes)
		})
  }


}
