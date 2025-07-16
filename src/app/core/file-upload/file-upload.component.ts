import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { StorageServiceService } from 'app/services/storageService/storageService.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  fileList = []
  documents = []
  @Input() transactionId: any
  @Input() moduleId: any
  filesUpload = []
  constructor(private storageServiceService: StorageServiceService) { }

  ngOnInit() {
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#fileUploadInputExample") as HTMLElement;
    element.click();
    if (event.target.files && event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files);
      this.fileList = event.target.files
    }
  }
  selectedFile: any = null;

onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
}


fileAttr = 'Choose File';
uploadFileEvt(imgFile: any) {
  if (imgFile.target.files && imgFile.target.files.length > 0) {
    for (let i = 0; i < imgFile.target.files.length; i++) {
          this.filesUpload.push({
            isUpload: false,
            isUploading: false,
            name: imgFile.target.files[i].name,
            file: imgFile.target.files[i],
          })
    }
    this.fileAttr = ""
  } else {
    this.fileAttr = 'Choose File';
  }
}


  uploadFile(event) {
    if (event.target.files.length) {
      let element: HTMLElement = document.querySelector("#fileUploadInputExample + .input-group .file-upload-info") as HTMLElement;
      let fileName = ""
      for (var i = 0; i < event.target.files.length; i++) {
        fileName += event.target.files[i].name + " ";
      }
      element.setAttribute('value', fileName)
      this.fileList = event.target.files;
    }
    if (this.fileList.length === 0) {
      return;
    }
  }
  
  removeFile(index){
    this.filesUpload.splice(index, 1)
  }

  submit(index) {
    const file:File = this.filesUpload[index];
    if (file) {
      this.filesUpload[index].isUploading = true
        const formData = new FormData();
        formData.append("file", file["file"]);
        this.storageServiceService.fileUpload(formData, this.transactionId, this.moduleId).subscribe({
          next: (value: any) => {
            if (value) {
              this.filesUpload[index].isUploading = false
              this.filesUpload[index].isUpload = true
            }
            else {
              this.filesUpload[index].isUploading = false
            }
          },
          error: (e) => {
            this.filesUpload[index].isUploading = false
          }
        });
    }
}
}
