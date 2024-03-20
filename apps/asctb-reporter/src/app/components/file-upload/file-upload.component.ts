import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FileUploadComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: FileUploadComponent,
    },
  ],
})
export class FileUploadComponent implements ControlValueAccessor, Validator {
  fileName = '';

  @Output() fileFormDataEvent = new EventEmitter<FormData>();

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement | null)?.files?.[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('csvFile', file);
      this.fileFormDataEvent.emit(formData);
      this.onChange(this.fileName);
    }
  }

  fileUploadError = false;

  onChange = (_fileName: string) => {};

  onTouched = () => {};

  onValidatorChange = () => {};

  onClick(fileUpload: HTMLInputElement) {
    this.onTouched();
    fileUpload.click();
  }

  writeValue(value: string) {
    this.fileName = value;
  }

  registerOnChange(onChange: (value: string) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  registerOnValidatorChange(onValidatorChange: () => void) {
    this.onValidatorChange = onValidatorChange;
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    return null;
  }
}
