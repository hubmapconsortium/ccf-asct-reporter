/*eslint  @typescript-eslint/no-this-alias: "off"*/
/*eslint-env es6*/
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SheetState } from '../../store/sheet.state';
import { Observable } from 'rxjs';
import { Validators, FormControl } from '@angular/forms';
import * as jexcel from 'jexcel';
import { UpdatePlaygroundData, FetchSheetData } from '../../actions/sheet.actions';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Sheet } from '../../models/sheet.model';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
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

  /**
   * Data for the table view
   */
  spreadSheetData: Array<string[]>;
  /**
   * Instance of jexcel table
   */
  table: any;
  /**
   * Keep track of previous tab. Default to 0
   */
  prevTab = 0;
  /**
   * Google sheet link
   */
  link: any;
  /**
   * Selected sheet
   */
  currentSheet: Sheet;
  /**
   * Keeps track of the tab index
   */
  tabIndex: number;

  /**
    * Controller for entering the link
    */
  linkFormControl = new FormControl('', [
    Validators.compose([
      Validators.required,
      Validators.pattern(/\/([\w-_]{15,})\/(.*?gid=(\d+))?|\w*csv$/),
    ]),
  ]);

  constructor(public readonly store: Store, public readonly ga: GoogleAnalyticsService) {
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
          this.initTable(data);
        } else {
          this.table.destroy();
          this.initTable(data);
        }
      }
    });
  }

  /**
   * Add colums
   */
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

  /**
   * Initialize jexcel table
   *
   * @param data table data
   */
  initTable(data: string[][]) {
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

  /**
   * Change tabs
   *
   * @param tab table change event
   */
  tabChange(tab: MatTabChangeEvent) {
    if (this.prevTab === 1 && tab.index === 0) {
      this.spreadSheetData  = this.spreadSheetData.filter((row) => {
        return (row.some((cell) => cell.length > 0 && cell !== '\u0000'));
      });
      this.store.dispatch(new UpdatePlaygroundData(this.spreadSheetData));
    }
    this.prevTab = tab.index;
    this.ga.event(GaAction.NAV, GaCategory.PLAYGROUND, 'Change playground tab', tab.index);
  }

  /**
   * Read the google sheet link and upload
   */
  upload(formDataEvent?: FormData) {
    const data = this.checkLinkFormat(this.linkFormControl.value);
    const sheet = JSON.parse(JSON.stringify(this.currentSheet));
    sheet.gid = data.gid;
    sheet.sheetId = data.sheetID;
    sheet.csvUrl = data.csvUrl;
    this.tabIndex = 0;
    sheet.config.height = 1400;

    if (formDataEvent) {
      sheet.formData = formDataEvent;
    }

    this.store.dispatch(new FetchSheetData(sheet));
    this.ga.event(GaAction.CLICK, GaCategory.PLAYGROUND, 'Upload Playground Sheet', sheet.sheetId);
  }

  /**
   * Link validation function
   */
  checkLinkFormat(url: string) {
    if (url.startsWith('https://docs.google.com/spreadsheets/d/')) {
      const splitUrl = url.split('/');
      if (splitUrl.length === 7) {
        return {
          sheetID: splitUrl[5],
          gid: splitUrl[6].split('=')[1],
          csvUrl: ''
        };
      }
    } else {
      return {
        sheetID: '0',
        gid: '0',
        csvUrl: url
      };
    }
  }
}
