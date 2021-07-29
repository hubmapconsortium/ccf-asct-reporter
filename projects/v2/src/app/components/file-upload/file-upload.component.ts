import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  fileName = '';

  @Output() fileFormDataEvent = new EventEmitter<FormData>();

  constructor() { }

  ngOnInit(): void { }

  onFileSelected(event) {

    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("csvFile", file);
      this.fileFormDataEvent.emit(formData);
    }
  }

}
