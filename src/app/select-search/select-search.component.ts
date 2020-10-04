import {   AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef, EventEmitter, forwardRef, Inject, Input, OnDestroy, OnInit, QueryList,
  ViewChild} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectSearchComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectSearchComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {

  get value(): string {
    return this.val;
  }


  constructor(@Inject(MatSelect) public matSelect: MatSelect,
              private changeDetectorRef: ChangeDetectorRef) {


  }


  @Input() placeholderLabel = 'Search';

  @Input() noEntriesFoundLabel = 'No Options Found';

  @ViewChild('searchSelectInput', {read: ElementRef}) searchSelectInput: ElementRef;
  private val: string;

  public opt: QueryList<MatOption>;

  private previousSelectedValues: any[];

  private overlayClassSet = false;

  private change = new EventEmitter<string>();

  private od = new Subject<void>();

  onChange = (_: any) => {};
  onTouched = (_?: any) => {};

  ngOnInit() {
    // set custom panel class
    const panelClass = 'mat-select-search-panel';
    if (this.matSelect.panelClass) {
      if (Array.isArray(this.matSelect.panelClass)) {
        this.matSelect.panelClass.push(panelClass);
      } else if (typeof this.matSelect.panelClass === 'string') {
        this.matSelect.panelClass = [this.matSelect.panelClass, panelClass];
      } else if (typeof this.matSelect.panelClass === 'object') {
        this.matSelect.panelClass[panelClass] = true;
      }
    } else {
      this.matSelect.panelClass = panelClass;
    }

    // when the select dropdown panel is opened or closed
    this.matSelect.openedChange
      .pipe(takeUntil(this.od))
      .subscribe((opened) => {
        if (opened) {
          // focus the search field when opening
          this._focus();
        } else {
          // clear it when closing
          this._reset();
        }
      });

    // set the first item active after the options changed
    this.matSelect.openedChange
      .pipe(take(1))
      .pipe(takeUntil(this.od))
      .subscribe(() => {
        this.opt = this.matSelect.options;
        this.opt.changes
          .pipe(takeUntil(this.od))
          .subscribe(() => {
            const keyManager = this.matSelect._keyManager;
            if (keyManager && this.matSelect.panelOpen) {
              // avoid "expression has been changed" error
              setTimeout(() => {
                keyManager.setFirstItemActive();
              });
            }
          });
      });

    // detect changes when the input changes
    this.change
      .pipe(takeUntil(this.od))
      .subscribe(() => {
        this.changeDetectorRef.detectChanges();
      });

    this.initMultipleHandling();
  }

  ngOnDestroy() {
    this.od.next();
    this.od.complete();
  }

  ngAfterViewInit() {
    this.setOverlayClass();
  }

  /**
   * Handles the key down event with MatSelect.
   * Allows e.g. selecting with enter key, navigation with arrow keys, etc.
   * @param {KeyboardEvent} event
   * @private
   */
  _handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === 32) {
      // do not propagate spaces to MatSelect, as this would select the currently active option
      event.stopPropagation();
    }

  }


  writeValue(value: string) {
    const valueChanged = value !== this.val;
    if (valueChanged) {
      this.val = value;
      this.change.emit(value);
    }
  }

  onInputChange(value) {
    const valueChanged = value !== this.val;
    if (valueChanged) {
      this.val = value;
      this.onChange(value);
      this.change.emit(value);
    }
  }

  onBlur(value: string) {
    this.writeValue(value);
    this.onTouched();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  /**
   * Focuses the search input field
   * @private
   */
  public _focus() {
    if (!this.searchSelectInput) {
      return;
    }
    // save and restore scrollTop of panel, since it will be reset by focus()
    // note: this is hacky
    const panel = this.matSelect.panel.nativeElement;
    const scrollTop = panel.scrollTop;

    // focus
    this.searchSelectInput.nativeElement.focus();

    panel.scrollTop = scrollTop;
  }

  /**
   * Resets the current search value
   * @param {boolean} focus whether to focus after resetting
   * @private
   */
  public _reset(focus?: boolean) {
    if (!this.searchSelectInput) {
      return;
    }
    this.searchSelectInput.nativeElement.value = '';
    this.onInputChange('');
    if (focus) {
      this._focus();
    }
  }

  /**
   * Sets the overlay class  to correct offsetY
   * so that the selected option is at the position of the select box when opening
   */
  private setOverlayClass() {
    if (this.overlayClassSet) {
      return;
    }
    const overlayClass = 'cdk-overlay-pane-select-search';

    this.matSelect.overlayDir.attach
      .pipe(takeUntil(this.od))
      .subscribe(() => {
        // note: this is hacky, but currently there is no better way to do this
        this.searchSelectInput.nativeElement.parentElement.parentElement
          .parentElement.parentElement.parentElement.classList.add(overlayClass);
      });

    this.overlayClassSet = true;
  }


  /**
   * Initializes handling <mat-select [multiple]="true">
   * Note: to improve this code, mat-select should be extended to allow disabling resetting the selection while filtering.
   */
  private initMultipleHandling() {
    // if <mat-select [multiple]="true">
    // store previously selected values and restore them when they are deselected
    // because the option is not available while we are currently filtering
    this.matSelect.valueChange
      .pipe(takeUntil(this.od))
      .subscribe((values) => {
        if (this.matSelect.multiple) {
          let restoreSelectedValues = false;
          if (this.val && this.val.length
            && this.previousSelectedValues && Array.isArray(this.previousSelectedValues)) {
            if (!values || !Array.isArray(values)) {
              values = [];
            }
            const optionValues = this.matSelect.options.map(option => option.value);
            this.previousSelectedValues.forEach(previousValue => {
              if (values.indexOf(previousValue) === -1 && optionValues.indexOf(previousValue) === -1) {
                // if a value that was selected before is deselected and not found in the options, it was deselected
                // due to the filtering, so we restore it.
                values.push(previousValue);
                restoreSelectedValues = true;
              }
            });
          }

          if (restoreSelectedValues) {
            this.matSelect._onChange(values);
          }

          this.previousSelectedValues = values;
        }
      });
  }

}
