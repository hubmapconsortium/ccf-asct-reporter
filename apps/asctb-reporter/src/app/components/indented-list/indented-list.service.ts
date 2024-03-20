import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ILNode } from '../../models/indent.model';
import { Row, Sheet } from '../../models/sheet.model';

@Injectable({
  providedIn: 'root',
})
export class IndentedListService {
  private indentData = new Subject<{ data: ILNode | null; sheet?: string }>();
  indentData$ = this.indentData.asObservable();

  public makeIndentData(currentSheet: Sheet, data: Row[]) {
    let root = new ILNode(
      data[0].anatomical_structures[0].name ?? '',
      [],
      data[0].anatomical_structures[0].id ?? ''
    );
    root.comparator = root.name + root.ontologyId;
    root.type = 'root';

    let parent: ILNode;

    try {
      data.forEach((row) => {
        parent = root;

        row.anatomical_structures.forEach((structure) => {
          const s =
            parent.children?.findIndex(
              (i) =>
                i.type !== 'root' &&
                i.comparator ===
                  parent.comparator + structure.name + structure.id
            ) ?? -1;
          if (s === -1) {
            const newNode = new ILNode(
              structure.name ?? '',
              [],
              structure.id ?? ''
            );
            newNode.comparator =
              parent.comparator + newNode.name + newNode.ontologyId;
            parent.children?.push(newNode);
            parent = newNode;
          } else {
            parent = parent.children?.[s] as ILNode;
          }
        });
      });

      root = root.children?.[0] as ILNode; // reassign to avoid duplicate parent
      this.indentData.next({
        data: root,
        sheet: currentSheet.display,
      });

      return {
        data: root,
        sheet: currentSheet.display,
      };
    } catch {
      this.indentData.next({
        data: null,
      });
    }

    return { data: null };
  }
}
