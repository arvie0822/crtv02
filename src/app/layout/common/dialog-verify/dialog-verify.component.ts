import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FileService } from 'app/services/fileService/file.service';

export interface ActionButton {
  id: string
}

export interface PeriodicElement {
    row: number;
    error: string;
  }

  const ELEMENT_DATA: PeriodicElement[] = [
    {row: 1, error: 'No Middle'},
    {row: 2, error: 'No Name'},
  ]


@Component({
  selector: 'app-dialog-verify',
  templateUrl: './dialog-verify.component.html',
  styleUrls: ['./dialog-verify.component.css']
})
export class DialogVerifyComponent implements OnInit {
    showAlert: boolean = false
    alerttype: string
    alertmessage: string
  
    displayedColumns: string[] = [];
    // dataSource: any = [];
    columns: any = []
    totalRows: number = 0;
    request: any

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
 
  constructor(
    private fileService: FileService,
    public dialogRef: MatDialogRef<DialogVerifyComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dataset: any) { 
        // this.displayedColumns = this.dataset.columns.map(c => c.columnDef);
        // console.log(this.displayedColumns)
        
        this.columns = dataset.columns
        this.dataSource = new MatTableDataSource(dataset.dataSource);
        this.displayedColumns = dataset.columns.map(x=>x.columnDef)
    }

  ngOnInit() { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.totalRows = this.dataset.totalRows;
    this.request = this.dataset.req
  }

  onClick(e){
    this.dialogRef.close({ event: e, data: this.dataset.rows });
  }

  onNextPage(e){
    var req = this.request.table
    req.Start = e.pageIndex;
    req.Length = e.pageSize;
    this.loadNewData()
  }

  loadNewData(){
    this.fileService.viewUploadInMemoryTable(this.request)
    .subscribe({
      next: (value: any) => {
        if (value.statusCode == 200) {
          var data = value.payload.data.map(item => ({
            ...item,
            errorLogs: item.withError ? item.errorLogs : "No Error"
          }));
          this.dataSource = new MatTableDataSource(data);
        }
        else {
          console.error(value.message)
        }
      },
      error: (e) => {
          console.error(e)
      }
    });
  }

}
