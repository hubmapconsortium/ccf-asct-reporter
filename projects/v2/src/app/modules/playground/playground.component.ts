import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SheetState } from '../../store/sheet.state';
import { Observable } from 'rxjs';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';

import * as jexcel from 'jexcel';
import { UpdatePlaygroundData, FetchSheetData } from '../../actions/sheet.actions';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Sheet } from '../../models/sheet.model';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { GaAction, GaCategory } from '../../models/ga.model';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent implements OnInit, AfterViewInit {
  @ViewChild('spreadsheet') spreadsheet: ElementRef;

  @Select(SheetState.getParsedData) data$: Observable<string[][]>;
  @Select(SheetState.getSheet) sheet$: Observable<Sheet>;

  spreadSheetData: Array<string[]>;
  table: any;
  prevTab = 0;
  link: any;
  currentSheet: Sheet;
  tabIndex: number;

  formGroup: FormGroup;
  formSheets: FormArray;

  linkFormControl = new FormControl('', [
    Validators.compose([
      Validators.required,
      Validators.pattern(/\/([\w-_]{15,})\/(.*?gid=(\d+))?/),
    ]),
  ]);

  constructor(public store: Store, public fb: FormBuilder, public ga: GoogleAnalyticsService) {
    this.sheet$.subscribe((sheet) => {
      this.currentSheet = sheet;
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.data$.subscribe((data) => {
      if (data.length) {
        this.spreadSheetData = data;
        if (!this.table) {
          this.initTable(data, this.store);
        } else {
          this.table.destroy();
          this.initTable(data, this.store);
        }
      }
    });
  }

  generateColumns(len: number) {
    const columns = [];
    for (let i = 0; i < len; i++) {
      columns.push({
        type: 'text',
        width: 125,
      });
    }
    return columns;
  }

  initTable(data: string[][], store: Store) {
    const that = this;
    this.table = jexcel(this.spreadsheet.nativeElement, {
      data,
      minDimensions: [50, 50],
      onchange() {
        that.spreadSheetData = data;
      },
      contextMenu(obj, x, y, e) {
        const items = [];

        if (y === null) {
          // Insert a new column
          if (obj.options.allowInsertColumn === true) {
            items.push({
              title: obj.options.text.insertANewColumnBefore,
              onclick() {
                obj.insertColumn(1, parseInt(x, 10), 1);
              },
            });
          }

          if (obj.options.allowInsertColumn === true) {
            items.push({
              title: obj.options.text.insertANewColumnAfter,
              onclick() {
                obj.insertColumn(1, parseInt(x, 10), 0);
              },
            });
          }

          // Delete a column
          if (obj.options.allowDeleteColumn === true) {
            items.push({
              title: obj.options.text.deleteSelectedColumns,
              onclick() {
                obj.deleteColumn(
                  obj.getSelectedColumns().length ? undefined : parseInt(x, 10)
                );
              },
            });
          }

          // Rename column
          if (obj.options.allowRenameColumn === true) {
            items.push({
              title: obj.options.text.renameThisColumn,
              onclick() {
                obj.setHeader(x);
              },
            });
          }

          // Sorting
          if (obj.options.columnSorting === true) {
            // Line
            items.push({ type: 'line' });

            items.push({
              title: obj.options.text.orderAscending,
              onclick() {
                obj.orderBy(x, 0);
              },
            });
            items.push({
              title: obj.options.text.orderDescending,
              onclick() {
                obj.orderBy(x, 1);
              },
            });
          }
        } else {
          // Insert new row
          if (obj.options.allowInsertRow === true) {
            items.push({
              title: obj.options.text.insertANewRowBefore,
              onclick() {
                obj.insertRow(1, parseInt(y, 10), 1);
              },
            });

            items.push({
              title: obj.options.text.insertANewRowAfter,
              onclick() {
                obj.insertRow(1, parseInt(y, 10));
              },
            });
          }

          if (obj.options.allowDeleteRow === true) {
            items.push({
              title: obj.options.text.deleteSelectedRows,
              onclick() {
                obj.deleteRow(
                  obj.getSelectedRows().length ? undefined : parseInt(y, 10)
                );
              },
            });
          }

          if (x) {
            if (obj.options.allowComments === true) {
              items.push({ type: 'line' });

              const title = obj.records[y][x].getAttribute('title') || '';

              items.push({
                title: title
                  ? obj.options.text.editComments
                  : obj.options.text.addComments,
                onclick() {
                  obj.setComments(
                    [x, y],
                    prompt(obj.options.text.comments, title)
                  );
                },
              });

              if (title) {
                items.push({
                  title: obj.options.text.clearComments,
                  onclick() {
                    obj.setComments([x, y], '');
                  },
                });
              }
            }
          }
        }

        // Line
        items.push({ type: 'line' });

        // Do not show copy and paste options
        /*items.push({
            title:obj.options.text.copy,
            shortcut:'Ctrl + C',
            onclick:function() {
                obj.copy(true);
            }
        });

        // Paste
        if (navigator && navigator.clipboard) {
            items.push({
                title:obj.options.text.paste,
                shortcut:'Ctrl + V',
                onclick:function() {
                    if (obj.selectedCell) {
                        navigator.clipboard.readText().then(function(text) {
                            if (text) {
                                jexcel.current.paste(obj.selectedCell[0], obj.selectedCell[1], text);
                            }
                        });
                    }
                }
            });
        }*/

        // Save
        if (obj.options.allowExport) {
          items.push({
            title: obj.options.text.saveAs,
            shortcut: 'Ctrl + S',
            onclick() {
              obj.download(true);
            },
          });
        }

        return items;
      },
      columns: [...this.generateColumns(data[0].length)],
      style: {
        A1: 'width: 100px;',
      },
    });
  }

  tabChange(tab: MatTabChangeEvent) {
    if (this.prevTab === 1 && tab.index === 0) {
      this.store.dispatch(new UpdatePlaygroundData(this.spreadSheetData));
    }
    this.prevTab = tab.index;
    this.ga.eventEmitter('playground_tabchange', GaCategory.PLAYGROUND, 'Change playground tab', GaAction.NAV, tab.index);
  }

  upload() {
    const data = this.checkLinkFormat(this.linkFormControl.value);
    const sheet = JSON.parse(JSON.stringify(this.currentSheet));
    sheet.gid = data.gid;
    sheet.sheetId = data.sheetID;
    this.tabIndex = 0;
    sheet.config.height = 1400;
    this.store.dispatch(new FetchSheetData(sheet));
    this.ga.eventEmitter('playground_upload', GaCategory.PLAYGROUND, 'Upload Playground Sheet', GaAction.CLICK, sheet.sheetId);
  }

  checkLinkFormat(url: string) {
    const matches = /\/([\w-_]{15,})\/(.*?gid=(\d+))?/.exec(url);
    if (matches) {
      return {
        sheetID: matches[1],
        gid: matches[3],
      };
    }
  }
}
