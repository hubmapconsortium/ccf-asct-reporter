import { Injectable } from '@angular/core';
import { ILNode } from '../../models/indent.model';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndentedListService {
  constructor() {}
  private indentData = new Subject<any>();
  indentData$ = this.indentData.asObservable();

  public makeIndentData(currentSheet, data) {
    let root = new ILNode(
      data[0].anatomical_structures[0].name,
      [],
      data[0].anatomical_structures[0].id
    );
    root.comparator = root.name + root.ontologyId;
    root.type = 'root';

    let parent: ILNode;

    try {
      data.forEach((row) => {
        parent = root;

        row.anatomical_structures.forEach((structure) => {
          const s = parent.children.findIndex(
            (i) =>
              i.type !== 'root' &&
              i.comparator === parent.comparator + structure.name + structure.id
          );
          if (s === -1) {
            const newNode = new ILNode(structure.name, [], structure.id);
            newNode.comparator =
              parent.comparator + newNode.name + newNode.ontologyId;
            parent.children.push(newNode);
            parent = newNode;
          } else {
            parent = parent.children[s];
          }
        });
      });

      root = root.children[0]; // reassign to avoid diuplicate parent
      this.indentData.next({
        data: root,
        sheet: currentSheet.display,
      });

      return {
        data: root,
        sheet: currentSheet.display,
      };
    } catch (err) {
      this.indentData.next({
        data: null,
      });
    }
  }

  getIndentData(): Observable<any> {
    return this.indentData.asObservable();
  }
}
