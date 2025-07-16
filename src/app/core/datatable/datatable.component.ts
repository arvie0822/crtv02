import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Output, Renderer2, SimpleChanges, ViewChild, } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'app/services/coreService/coreService.service';
import { Datatable, TableRequest } from '../../model/datatable.model';
import { MatTable } from '@angular/material/table';
import { DropdownRequest, SearchHierarchy } from 'app/model/dropdown.model';
import { forkJoin } from 'rxjs';
import { MasterService } from 'app/services/masterService/master.service';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GenerateDetailedComponent } from 'app/modules/employee/employee-setup/timekeeping-generation/generate-detailed/generate-detailed.component';
import { SummaryGenerateComponent } from 'app/modules/employee/employee-setup/timekeeping-generation/summary-generate/summary-generate.component';
import { DatePipe } from '@angular/common';
import { FailedMessage, GenerationMsg, SaveMessage, SuccessMessage, } from 'app/model/message.constant';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GF } from 'app/shared/global-functions';
import { myData } from 'app/app.moduleId';
import { ChangeDetectorRef } from '@angular/core';
import { DialogDelComponent } from 'app/layout/common/dialog-del/dialog-del.component';
import { DialogAddComponent } from 'app/layout/common/dialog-add/dialog-add.component';
import { UserService } from 'app/services/userService/user.service';
import { FileService } from 'app/services/fileService/file.service';
import { DialogVerifyComponent } from 'app/layout/common/dialog-verify/dialog-verify.component';
import { StorageServiceService } from 'app/services/storageService/storageService.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PayrollService } from 'app/services/payrollService/payroll.service';
import _ from 'lodash';
import { ResetDateComponent } from 'app/modules/employee/employee-setup/employee-detail/reset-date/reset-date.component';

enum mode {
    all = 0,
    selected = 1,
    export = 2,
    next = 3,
    sort = 4,
    load = 5,
    input = 6,
    exportInfo = 7,
}

@Component({
    selector: 'app-datatable',
    templateUrl: './datatable.component.html',
    styleUrls: ['./datatable.component.css'],
})
export class DatatableComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatTable) matTable: MatTable<any>;
    dialogRef: MatDialogRef<GenerateDetailedComponent, any>;
    dialogRefSum: MatDialogRef<SummaryGenerateComponent, any>;
    dialogReset: MatDialogRef<ResetDateComponent, any>;
    @Output() childTable: any = [];
    @Input() hideFilter: boolean = false;
    @Input() tagType: any = [];
    @Input() hideDropdown: any = [];
    @Input() create_btn: boolean = false;
    @Input() delete_btn: boolean = false;
    @Input() download_btn: boolean = false;
    @Input() export_btn: boolean = false;
    @Input() search_btn: boolean = false;
    @Input() upload_btn: boolean = false;
    @Input() path: string = '';
    table: any = [];
    clonetable: any = [];
    isLoadingResults: boolean = true;
    isRateLimitReached: boolean = false;
    onPageLoad: boolean = false;
    resetHierarchy: boolean = false;
    resetFix: boolean = false;
    resetCustom: boolean = false;
    columns: any = [];
    dataSource: any = [];
    columndefs: any = [];
    request: any = [];
    upRequest: any = new TableRequest();
    checkedList = [];
    excluded = [];
    clonefilter = [];
    searchFilter: any = [];
    totalRows: number = 0;
    url: string = '';
    deleteUrl: string = '';
    dropdowntypeid: number = 0;
    title: string = '';
    link: string = '';
    bypass: boolean = false;
    dropdownFix = new DropdownRequest();
    dropdownRequest = new DropdownRequest();
    dropdownDynamic = new DropdownRequest();
    optionStored = [];
    resultHierarchy = new SearchHierarchy();
    detailview = '';
    pipe = new DatePipe('en-US');
    successMessage = Object.assign({}, SuccessMessage);
    failedMessage = Object.assign({}, FailedMessage);
    savedMessage = Object.assign({}, SaveMessage);

    screenWidth: number;
    pageLoaded: number = 0
    isAll: boolean = false;

    // requests = new TableRequest
    documentId = "1aQsscYkD1SWf3AMAX2PTQ%3d%3d"; //24 - CRT robo
    // isUploadMode = false
    fileDetail = {
        files: null,
        name: null,
        save: 0,
        guid: "",
        error: false
    }
    //   defaultTag = [{id:[],type:-1},{id:[],type:-2},{id:[],type:-4}]
    constructor(
        private route: ActivatedRoute,
        private coreService: CoreService,
        private router: Router,
        private message: FuseConfirmationService,
        private masterService: MasterService,
        private tenantService: TenantService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private renderer: Renderer2,
        private userService: UserService,
        private fileService: FileService,
        private storage: StorageServiceService,
        private sanitizer: DomSanitizer,
    ) {
        this.request = new TableRequest();
        this.request.Length = 20;
        route.params.subscribe((val) => {
            this.onPageLoad = false;
            this.columns = [];
            this.dataSource = [];
            this.columndefs = [];
            this.table = [];
            this.request.SearchColumn = [];
            myData.id = val.id;
            if (!myData.bypass) {
                this.initialize(val.id);
                myData.backSave = false;
            }
            // if(val instanceof NavigationEnd){
            //     myData.bypass = false
            // }
        });

        this.screenWidth = window.innerWidth;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('path' in changes) {
            this.initialize(changes.path.currentValue);
        }
    }

    ngOnInit() {
        sessionStorage.setItem('action', '');

        this.renderer.listen('window', 'resize', (event) => {
            this.screenWidth = window.innerWidth;
        });
    }

    initialize(val) {
        this.table = Datatable.filter((x) => x.type == val)[0];
        this.table.filter.forEach((val) => {
            val.value =
                val.type == 'input'
                    ? ''
                    : val.type == 'select'
                    ? null
                    : val.type == 'date'
                    ? ''
                    : val.type == 'select-fix'
                    ? val.value
                    : null;
        });
        this.clonetable = Object.assign(
            {},
            Datatable.filter((x) => x.type == val)[0]
        );
        if (this.hideFilter) {
            if (this.tagType.length > 0) {
                this.clonetable.filter.find(
                    (x) => x.type === 'e-hierarchy'
                ).tagType = this.tagType;
            }
            if (this.hideDropdown) {
                var a = this.clonetable.filter.filter(
                    (item) => !this.hideDropdown.includes(item.id)
                );
                this.clonetable.filter = a;
            }
            this.clonetable.btn_create = this.create_btn;
            this.clonetable.btn_delete = this.delete_btn;
            this.clonetable.btn_download = this.download_btn;
            this.clonetable.btn_export = this.export_btn;
            this.clonetable.btn_search = this.search_btn;
            this.clonetable.btn_upload = this.upload_btn;
            this.table = this.clonetable;
        }

        if (this.table === undefined) {
            this.table = Datatable.filter((x) => x.type == 'default')[0];
            this.router.navigate(['/example']);
            return;
        }
        this.onPageLoad = true;
        this.title = this.table.title.replace('-', ' ');

        this.columns = this.table.rows;
        this.columndefs.push('action');
        if (this.table?.checkbox) {
            this.columndefs.push('checkbox');
        }
        if (this.table.rows.find((x) => x.hide === true)) {
            this.hideColumns();
        }
        this.columns.map((element) => {
            this.columndefs.push(element.column);
        });

        if (this.table.hasProcess) {
            this.columndefs.push('isProcess');
        }
        this.url = this.table.api.uri;
        if (this.table.btn_delete === true) {
            this.deleteUrl = this.table.api_delete.uri;
        }

        this.table.tkGeneration =
            this.table.tkGeneration == undefined
                ? false
                : this.table.tkGeneration;

        this.initData();
    }

    initData(): void {
        var result = GF.IsEmpty(this.table.rows.find((x) => x.orderBy));
        this.request.Order = this.table.rows.filter(
            (x) => x.defaultSort == true
        )[0].column;
        if (!result) {
            this.request.OrderBy = this.table.rows.filter(
                (x) => x.defaultSort == true
            )[0].orderBy;
            this.loadData(mode.load);
            this.setDropownData();
            return;
        }
        this.request.OrderBy = 'ASC';
        this.loadData(mode.load);
        this.setDropownData();
    }

    loadData(modes: mode): void {
        if (this.url == '') {
            return;
        }
        this.setParams(false);
        this.isLoadingResults = true;
        this.coreService.getTableData(this.url, this.request).subscribe(
            (data) => {
                if (data.statusCode == 200) {
                    this.totalRows = data.payload.totalRows;
                    this.dataSource = data.payload.data;
                    this.dataSource.paginator = this.paginator;
                    this.matTable.renderRows();
                    this.isLoadingResults = false;
                    this.resetFix = false;
                    this.resetCustom = false;
                    this.resetHierarchy = false;

                    if (modes === mode.load) { 
                        this.checkedList = []; 
                        this.isAll = false; 
                    }
                    if (this.isAll) { 
                        this.selectAll({checked:true},modes); 
                    }

                } else {
                    console.log(data.stackTrace);
                    console.log(data.message);
                    this.isLoadingResults = false;
                }
            },
            (error: HttpErrorResponse) => {
                console.log(error.error);
                this.isLoadingResults = false;
            }
        );
    }

    handlePageEvent(e): void {
        this.request.Start = e.pageIndex;
        this.request.Length = e.pageSize;
        this.loadData(mode.next);
    }

    handleSortEvent(e): void {
        this.paginator.pageIndex = 0;
        this.request.Start = 0;
        this.request.Order = e.active;
        this.request.OrderBy = e.direction;
        this.loadData(mode.sort);
    }

    handleClickEvent(a, e): void {
      if (a == "edit") {
        this.addEvent(e);
      } else {
        this.delEvent(e);
      }
    }

    delEvent(e){
        // delete function here
        this.savedMessage.message = "Are you sure you want to delete this user?"
        const dialogRef = this.message.open(this.savedMessage);
        dialogRef.afterClosed().subscribe(async(result) => {
            if (result == "confirmed") {
                this.userService.deactivateEmployee(e.employeeId).subscribe({
                    next: (value: any) => {
                        if (value.statusCode == 200) {
                            this.successMessage.message = "User successfully deleted."
                            this.message.open(this.successMessage);
                            this.loadData(mode.load);
                        }
                        else {
                            this.message.open(FailedMessage);
                            console.log(value.stackTrace)
                            console.log(value.message)
                        }
                    },
                    error: (e) => {
                        this.message.open(FailedMessage);
                        console.error(e)
                    }
                });
            }
        })
    }

    handleCreateEvent(): void {
        sessionStorage.setItem('adds', '');
        this.router.navigate([this.table.link.uri]);
    }

    handleExportEvent(): void {
        this.isLoadingResults = true;
        const prevLength = this.request.Length;
        this.request.Length = 0;
        this.coreService.getTableData(this.url, this.request).subscribe(
            (data) => {
                this.request.Length = prevLength;
                for (let key in data.payload.data) {
                    this.table.excludeExport.forEach((del) => {
                        var a = del;
                        delete data.payload.data[key][del];
                    });
                }
                this.coreService.exportToExcel(
                    data.payload.data,
                    this.route.snapshot.paramMap.get('id')
                );
                this.isLoadingResults = false;
            },
            (error: HttpErrorResponse) => {
                console.log(error.error);
            }
        );
    }

    handleInputEvent(e): void {
        if (e.target.value == '') {
            this.loadData(mode.input);
        }
        return;

        // this.loadData()
    }

    handleDeleteEvent() {
        if (!this.columndefs.includes('checkbox')) {
            this.columndefs.unshift('checkbox');
            return;
        } else {
            if (this.checkedList.length === 0) {
                if (this.columndefs.includes('checkbox')) {
                    if (this.columndefs[0] === 'checkbox') {
                        this.columndefs.shift();
                    }
                    return;
                }
            }
        }

        if (
            this.checkedList.length > 0 &&
            this.dataSource.some((x) => x.checked)
        ) {
            var uploadid = this.dataSource
                .filter((x) => x.checked)
                .map((x) => x.id);
            var codeConfirmation = this.table.rows.filter(
                (x) => x.defaultSort == true
            )[0].title;
            var key = this.table.rows.filter((x) => x.defaultSort == true)[0]
                .column;
            var codeID = this.dataSource
                .filter((x) => x.checked)
                .map((x) => (x.hasOwnProperty(key) ? x[key] : null));
            this.savedMessage.message =
                'Are you sure you want to delete ' +
                codeConfirmation +
                ' ' +
                codeID;
            const dialogRef = this.message.open(this.savedMessage);
            dialogRef.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    this.coreService
                        .postDeleteData(this.deleteUrl, uploadid)
                        .subscribe(
                            (data) => {
                                if (data.statusCode == 200) {
                                    this.successMessage.message =
                                        'File has been deleted';
                                    this.successMessage.title = 'Success!';
                                    this.message.open(this.successMessage);
                                    this.loadData(mode.load);
                                    if ((this.checkedList = [])) {
                                        var index =
                                            this.columndefs.indexOf('checkbox');
                                        if (index !== -1) {
                                            this.columndefs.splice(index, 1);
                                        }
                                    }
                                } else {
                                    this.failedMessage.message = data.message;
                                    this.failedMessage.title = 'Failed!';
                                    this.message.open(this.failedMessage);
                                }
                            },
                            (error: HttpErrorResponse) => {
                                console.log(error.error);
                            }
                        );
                }
            });
        }
    }

    selectOne(id,reused) {
        var idx = this.checkedList.findIndex((x) => x == id);
        if (idx > -1) {
            this.checkedList.splice(idx, 1);
            this.excluded.push(id)
            if (this.checkedList.some(x=>x===0) && this.checkedList.filter(x=>x != 0).length < (this.request.Length * this.pageLoaded) && !reused) {
                this.selectOne(0,true)
            }
        } else {
            this.checkedList.push(id);

            var idxx = this.excluded.findIndex((x) => x == id);
            if (idxx > -1) {
                this.excluded.splice(idxx, 1);
            }
        }
    }

    selectAll(e,m) {
        this.isAll = e.checked
        if (e.checked) {
            var Items = []
            var data = []
            this.excluded = (m === mode.all) ? [] : this.excluded

            if (m === mode.next) {
                data = this.dataSource.filter(x=>!this.excluded.includes(x.employeeId))
            } else {
                if (this.table.type == "track-completion") {
                    data = this.dataSource.filter(x=>x.dataEntryStatus == "Complete" && x.crtGenerationStatus == "Incomplete")
                }else {
                    data = this.dataSource
                }
            }

            var hasZero = this.checkedList.some(x=>x===0) || this.checkedList.length === 0 || m === mode.all ? [0] : []
            Items = [...hasZero, ...data.map(x => x.employeeId)]

            this.checkedList = _.uniqBy([...Items, ...this.checkedList], JSON.stringify)
            this.pageLoaded = (this.pageLoaded + 1)
        } else {
            this.pageLoaded = 0
            this.checkedList = []
        }
    }

    itemChecked(id) {
        return this.checkedList.some(x => x === id)
    }

    test(e) {
        // console.log(this.table.filter);
        // console.log(e);
    }

    select_all(field){
        field.isAll = !field.isAll
        field.value = field.isAll ? [...field.options.map(x=>x.dropdownID),'0'] : []
    }

    select(field){
        if (field.isAll) {
            field.isAll = false;
            field.value = field.value.filter(x=>x != "0")
        } else {
            if (field.options.length === field.value.filter(x=>x != "0").length) {
                field.isAll = true;
                field.value = [...field.options.map(x=>x.dropdownID),'0']
            } else {
                field.value = field.value
            }
        }
    }

    setParams(load) {
        // if (!load) {
            this.request.SearchColumn = [];
            this.table.filter
                .filter((item) => item.value !== '' && item.value !== 0) //&& item.type !== "e-hierarchy")
                .forEach((ee) => {
                    if (ee.multiselect) {
                        if (ee.type == 'e-hierarchy') {
                            if (this.resultHierarchy.Search.length > 0) {
                                this.resultHierarchy.Search.filter(
                                    (x) => x.Key == 'EmployeeID'
                                ).forEach((element) => {
                                    if (Array.isArray(element.Value)) {
                                        element.Value.forEach((val) => {
                                            this.request.SearchColumn.push({
                                                key: 'employeeId',
                                                value: val + '',
                                                type: element.Type,
                                            });
                                        });
                                    } else {
                                        this.request.SearchColumn.push({
                                            key: element.Key,
                                            value: element.Value + '',
                                            type: element.Type,
                                        });
                                    }
                                });
                            }
                        } else {
                            // var ty = 0;
                            // if (ee.type == 'select' || ee.type == 'select-fix' || ee.type == 'custom') {
                            //     ty = 1;
                            // }
                            this.request.SearchColumn =
                                this.request.SearchColumn.filter(
                                    (item) => item.key !== ee.id
                                );
                            ee.value?.forEach((v) => {
                                this.request.SearchColumn.push({
                                    key: ee.id,
                                    value: '' + v,
                                    type:  ee.ty,//ee.id == 'Site' ? 1 : isNaN(v) ? 0 : 2,
                                });
                            });
                        }
                    } else if (ee.type == 'date') {
                        var ty = 4;
                        if (ee.label == 'Date To' || ee.label == 'Uploaded To') {
                            ty = 5;
                        }
                        this.request.SearchColumn =
                            this.request.SearchColumn.filter(
                                (item) => item.key !== ee.id
                            );
                        this.request.SearchColumn.push({
                            key: ee.id,
                            value:
                                '' +
                                this.pipe.transform(ee.value, 'yyyy-MM-dd'),
                            type: ty,
                        });
                    } else {
                        var ty = 0;
                        if (ee.type == 'select' || ee.type == 'select-fix' || ee.type == 'custom') {
                            ty = 1;
                        }
                        if (ee.value !== null) {
                            this.request.SearchColumn =
                                this.request.SearchColumn.filter(
                                    (item) => item.key !== ee.id
                                );
                            this.request.SearchColumn.push({
                                key: ee.id,
                                value: '' + ee.value,
                                type: ty,
                            });
                        }
                    }
                });
        // }
    }

    setDropownData() {
        this.setDDParameters();

        forkJoin({
            dropdownFix: this.masterService.getDropdownFix(this.dropdownFix),
            dropdownDynamic: this.tenantService.getDropdown(
                this.dropdownRequest
            ),
        }).subscribe({
            next: (value: any) => {
                this.optionStored = [
                    ...value.dropdownFix.payload,
                    ...value.dropdownDynamic.payload,
                ];
            },
            error: (e) => {
                console.error(e);
            },
            complete: () => {
                this.table.filter.map((element, i) => {
                    element.options = this.loadDropdown(
                        element.options,
                        element.type,
                        element.dropdownType
                    );
                });
            },
        });
    }

    setDDParameters() {
        this.table.filter
            .filter((item) => item.type == 'select-fix')
            .map((element, i) => {
                if (element.dropdownType.type == 'fix') {
                    this.dropdownFix.id.push({
                        dropdownID: element.dropdownType.uri === 3 ? 3 : 0,
                        dropdownTypeID: element.dropdownType.uri,
                    });
                } else {
                    this.dropdownRequest.id.push({
                        dropdownID: 0,
                        dropdownTypeID: element?.dropdownType?.uri || 0,
                    });
                }
            });
    }

    loadDropdown(val, type, dd) {
        var out: any;
        if (type == 'select-fix') {
            if (dd.type == 'fix') {
                out = this.optionStored.filter(
                    (item) => item.dropdownTypeID == dd.uri
                );
            } else {
                out = val;
            }
        } else {
            out = val;
        }
        return out;
    }

    _min(filter) {
        var isDate = this.table.filter.some((x) => x.type == 'date');
        if (isDate) {
            var df = this.table.filter.find((x) =>x.type == 'date' && x.label.toLowerCase().includes('from') ).value;
            var dt = this.table.filter.find((x) => x.type == 'date' && x.label.toLowerCase().includes('to') ).value;
            var ss = '';
            if (dt !== '' && filter.label.toLowerCase().includes('from')) {
                if (df > dt) {
                    this.table.filter.find((x) => x.type == 'date' && x.label.toLowerCase().includes('to') ).value = df;
                }
            } else {
                if (filter.label.toLowerCase().includes('to')) {
                    return new Date(df);
                }
            }
        }
    }

    handleTKEvent(type, element) {
        var obj = {
            type: type,
            props: element,
            buttonclose : true,
        };
        if (
            type == 'view' ||
            type == 'reGenerate' ||
            type == 'adjustment' ||
            type == 'viewAdjustment'
        ) {
            this.dialogRef = this.dialog.open(GenerateDetailedComponent, {
                width: '100%',
                height: '80%',
                panelClass: 'app-dialog',
                data: obj,
            });
        }
        // if (type == 'viewAdjustment' || type == 'adjustment') {
        //     this.dialogRefSum = this.dialog.open(SummaryGenerateComponent, {
        //         width: '100%',
        //         height: '80%',
        //         panelClass: 'app-dialog',
        //         data: obj,
        //     });
        // }
    }

    handleUploadEvent(e) {
        this.router.navigate(['detail/upload']);
    }

    isNumber(col, e) {
        if (e !== null) {
            if (isNaN(e)) {
                return col[e] === null || col[e] === undefined
                    ? []
                    : Array.isArray(col[e])
                    ? col[e]
                    : [col[e]];
            }
        }
    }

    top() {
        var top = '';
        var tagType = this.table.filter.filter((x) => x.type == 'e-hierarchy');
        tagType = tagType.length == 0 ? [] : tagType[0].tagType;
        if (this.table.filter.length + tagType.length > 7) {
            top =
                this.screenWidth < 1745 && this.screenWidth > 957
                    ? '130px'
                    : this.screenWidth < 957
                    ? '180px'
                    : '100px';
        } else if(this.table.filter.length > 5 && this.screenWidth < 1367){
            top = '150px';
        } else {
            top = '100px';
        }
        return top;
    }

    hideColumns() {
        // Filter out columns with hide === true
        this.columns = this.columns.filter((column) => !column.hide);
    }

    refresh() {
        this.request.SearchColumn = [];
        this.resultHierarchy.Search = [];
        this.resetFix = true;
        this.resetCustom = true;
        this.resetHierarchy = true;
        var date = this.table.filter.filter((x) => x.type === 'date');
        var select = this.table.filter.filter((x) => x.type === 'select');
        for (const item of date) {
            item.value = '';
        }
        for (const item of select) {
            item.value = '';
        }
        this.loadData(mode.load);
    }

    async handleResetEvent(){
        // 1st Modal Date Picker
        this.dialogReset = this.dialog.open(ResetDateComponent, {
            width: '20%',
            disableClose: true
        });

        const result = await new Promise<any>((resolve) => {
            this.dialogReset.componentInstance.btnConfirmed.subscribe((confirmedResult: any) => {
                resolve(confirmedResult);
            });
        });

        const formattedResult = this.pipe.transform(new Date(result).toLocaleString('en-US', { timeZone: 'Asia/Manila' }), "yyyy-MM-dd");

        // 2nd Modal Confirmation
        this.savedMessage.title = "Reset CRT";
        this.savedMessage.message = `You have selected ${formattedResult}. Are you sure you want to proceed with this date?`
        const dialogRef = this.message.open(this.savedMessage);
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == "confirmed") {
                // 3rd Modal Confirmation
                this.savedMessage.message = `To confirm, are you absolutely sure you want to finalize ${formattedResult}?`
                const dialogRef = this.message.open(this.savedMessage);
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result == "confirmed") {

                        this.fileService.resetCRT(formattedResult).subscribe({
                            next: (value: any) => {
                              if (value.statusCode == 200) {
                                this.savedMessage.title = "Success!";
                                this.savedMessage.message = "Files has been reset successfully!";
                                this.message.open(this.savedMessage);
                              } else {
                                this.failedMessage.message = value.message;
                                this.message.open(this.failedMessage)
                              }
                            },
                            error: (e) => {
                              console.error(e)
                            }
                          });
                    }
                });
            }
        });

    }

    async handleGenerateEvent(modee){
        var selected = (modee === mode.selected)

        if (modee === mode.all || selected) {
          if (GF.IsEmpty(this.table.filter.find(x=>x.id == "Site")?.value) && modee === mode.all) {
            this.failedMessage.title = "Warning!"
            this.failedMessage.message = "Please fill the required field Site"
            this.message.open(this.failedMessage)
            return
          }

          if (selected && this.checkedList.length === 0) {
            this.failedMessage.title = "Warning!";
            this.failedMessage.message = "Please select atleast (1) one row!";
            this.message.open(this.failedMessage);
            return
          }

          this.savedMessage.message = "Are you sure you want to generate" + (selected ? "?" : " for all?");
          const dialogRef = this.message.open(this.savedMessage);
          dialogRef.afterClosed().subscribe(async (result) => {
            if (result == "confirmed") {
              this.exportNow(this.setParam(selected),selected, (modee === mode.exportInfo) ? "exportReportSbc" : "exportCRT")
            }
          });
        }
         else {
            if (GF.IsEmpty(this.checkedList)) {
                this.failedMessage.title = "Warning!";
                this.failedMessage.message = "Please select atleast (1) one row!";
                this.message.open(this.failedMessage);
                return
            }
            var data = this.checkedList.some(x => x == 0) ? this.dataSource : this.dataSource.filter(x=>this.checkedList.includes(x.employeeId))
            var select = data.map(item=>({
                "Employee ID": item.employeeCode,
                "First Name": item.firstName,
                "Middle Name": item.middleName,
                "Last Name": item.lastName,
                "Suffix": item.suffix,
                "Date Birth": item.birthDate,
                "Site": item.site,
                "Account Type": item.accountType,
                "Employee TIN": item.tin
            }))
            this.coreService.exportToExcel(select,"Sheet1");
        }
    }

    setParam(user){
      var table = new TableRequest()
      this.table.filter.forEach(key => {
        if (user && key.id == "EmployeeId") {
          key.value = this.checkedList.map(x=>x+"")
        }
        if (!GF.IsEmpty(key.value)) {
          if (key.type == "date") {
            table.SearchColumn.push({
              key: key.id,
              value: key.value,
              type: key.ty
            })
          } else {
            key.value?.forEach(val => {
              table.SearchColumn.push({
                key: key.id,
                value: val+"",
                type: key.ty
              })
            })
          }
        }
      });

      return table;
    }

    exportNow(table,selected,path){
      var sites = selected ? ['0'] : this.table.filter.find(x=>x.id == "Site")?.value 
      sites.forEach((site,ii) => {
        var newTable   = Object.assign({},table)
        var sites      = table.SearchColumn.filter(x=>x.key == "Site" && x.value == site)
        var notSites   = table.SearchColumn.filter(x=>x.key != "Site")
        var sitesCount = table.SearchColumn.filter(x=>x.key == "Site").length
        var sc = selected ? notSites : [...notSites,...sites]
        newTable.SearchColumn = [...sc]
        this.fileService.exportCRT(newTable,path).subscribe({
          next: (value: any) => {
            if (!GF.IsEmpty(value?.payload)) {

                if (value.statusCode == 200) {
                    var dl = 0
                    value?.payload.forEach(item => {
                        this.coreService.converB64ToExcel(item.fileData, item.fileName)
                        dl = (dl+1)
                    });

                    if ((dl == value?.payload.length && selected) || (!selected && ii == (sitesCount-1))) {
                        this.successMessage.title = "Success!"
                        this.successMessage.message = "Export completed successfully!"
                        this.successMessage.actions.confirm.label = "Ok"
                        this.message.open(this.successMessage);
                        this.checkedList = []

                        // clear employee filter on selected
                        this.table.filter.forEach(key => {
                            if (selected && key.id == "EmployeeId") {
                                key.value = "";
                            }
                        })
                    }
                }
                else {
                    console.log(value.stackTrace)
                    console.log(value.message)
                    this.failedMessage.title = "Warning!"
                    this.failedMessage.message = GF.IsEmptyReturn(value.message, "Transaction Fialed!")
                    this.message.open(this.failedMessage);
                }
            }
          },
          error: (e) => {
            console.error(e)
          }
        });
      });
      
    }

    addEvent(data){
        const add = this.dialog.open(DialogAddComponent, {
          minWidth: '25%',
          disableClose: true,
          data: data
        })
        add.afterClosed().subscribe(res => {
          res.data.birthDay = this.pipe.transform(res.data.birthDate,"yyyy-MM-dd")
          if (res.confirm) {
            this.userService.postAddUser(res.data).subscribe({
              next: (value: any) => {
                if (value.statusCode == 200) {
                  this.message.open(SuccessMessage);
                  window.location.reload();

                } else {
                  this.failedMessage.message = value.message;
                  this.message.open(this.failedMessage)
                }
              },
              error: (e) => {
                console.error(e)
              }
            });
          }
        })
      }
    
      deleteEvent(){
        const del = this.dialog.open(DialogDelComponent, {
          minWidth: '25%',
          disableClose: true,
          data: []
        })
    
        del.afterClosed().subscribe(out => {
          if (out.isConfrim) {
            this.userService.PostDeleteUsers(out.event).subscribe({
              next: (value: any) => {
                if (value.statusCode == 200) {
                  this.message.open(SuccessMessage);
                }
              },
              error: (e) => {
                console.error(e)
              }
            });
          }
        })
      }

      disableCheck(e){
        var disable = false;
        if (this.table.type == "track-completion") {
            disable = e.dataEntryStatus != "Complete" || e.crtGenerationStatus == "Complete"
        }
        return disable;
      }

    disabledReason(e) {
        var reason = "";
        if (this.table.type == "track-completion") {
            reason = e.dataEntryStatus     != "Complete" ? "Disabled due incomplete data entry."
                   : e.crtGenerationStatus == "Complete" ? "Disabled due complete crt status."
                   : ""
        }
        return reason;
    }

      dlTemplateEvent(){
        var selected = [{
            "Employee ID": "",
            "First Name": "",
            "Middle Name": "",
            "Last Name": "",
            "Suffix": "",
            "Date Birth": "",
            "Site": "",
            "Account Type": "",
            "Employee TIN": "",
        }]
        this.coreService.exportToExcel(selected,"Sheet1");
      }

      uploadFile(event) {
        if (event.target.files && event.target.files[0]) {

          var files = event.target.files;
          let fileName = event.target.files[0].name;
          
          this.fileDetail.files = files;
          this.fileDetail.name = fileName;
          this.fileDetail.save = 0;
          this.fileDetail.guid = "";
          this.uploadingV2()
          event.target.value = null;
        }
    
      }

      suploadFile(event) {
        let element: HTMLElement = document.querySelector("#fielUpload") as HTMLElement;
        let fileName = event.target.files[0].name;
        element.setAttribute('value', fileName)
    
        var files = event.target.files;
        if (files.length === 0) {
          return;
        }
    
        this.fileDetail.files = files;
        this.fileDetail.name = fileName;
        this.fileDetail.save = 0;
        this.fileDetail.guid = "";
        this.uploadingV2()
        event.target.value = null;
      }

      uploadingV2(){
        var file = this.fileDetail
        this.fileService.postUploadInMemory(file.files, this.documentId, file.name)
        .subscribe({
          next: (value: any) => {
              if (value.statusCode == 200) {
                this.fileDetail.guid = value.payload
                this.uploadingViewV2()
              } else {
                this.message.open(FailedMessage)
              }
            },
            error: (e) => {
                console.error(e)
                this.message.open(FailedMessage)
            }
          });
      }

      uploadingViewV2() {
        var file = this.fileDetail
        this.upRequest.Length = 5;
        var obj = {
          cache: file.guid,
          onlyErrors: false,
          table: this.upRequest
        }
        this.fileService.viewUploadInMemoryTable(obj)
        .subscribe({
          next: (value: any) => {
            if (value.statusCode == 200) {
                this.viewError(value.payload.data, value.payload.totalRows, obj)
            }
            else {
                this.message.open(FailedMessage)
            }
          },
          error: (e) => {
              console.error(e)
              this.message.open(FailedMessage)
          }
        });
      }

      moveIndexToTop(arr, index) {
        if (index >= arr.length || index < 0) {
          console.error("Invalid index");
          return arr;
        }
    
        const element = arr.splice(index, 1)[0];
        arr.unshift(element);
    
        return arr;
      }

    viewError(resp, rows, req) {
        var obj = {
          req: req,
          totalRows: rows,
          title: "View Error Logs",
          columns: [{ header: "Error Logs", columnDef: "errorLogs" }, { header: "Row", columnDef: "row" }],
          dataSource: resp.map((item, ii) => ({
            withError: !GF.IsEmpty(item.errorLogs),
            errorLogs: GF.IsEmptyReturn(item.errorLogs, "No Error"),
            row: (ii + 1)
          })),
          button: [
            { type: "stroked",  id: "1", color: "warn",     label: "Cancel"   },
            { type: "flat",     id: "3", color: "primary",  label: "Confirm"  }
          ]
        }
        if (obj.dataSource.some(x=>x.withError)) {
          var verify = this.dialog.open(DialogVerifyComponent, {
            minWidth: '50%',
            minHeight: '50%',
            disableClose: true,
            data: obj
          })

          verify.afterClosed().subscribe(result => {
            if (result.event == '3') {
              var able = obj.dataSource.filter(x => !x.withError).length

              if (able > 0) {
                SaveMessage.title = "Uploading"
                SaveMessage.message = "You're about to upload " + able + " record(s)"
                SaveMessage.actions.confirm.label = "Ok"
                const d = this.message.open(SaveMessage)
                d.afterClosed().subscribe(confirm => {
                  if (confirm == "confirmed") {
                    GenerationMsg.title = "Please Wait !"
                    GenerationMsg.message = "This will take a minute."
                    const dl = this.message.open(GenerationMsg)

                    this.sumbitV2(dl)
                  }
                })
              } else {
                FailedMessage.title = "Unable to upload."
                FailedMessage.message = "Please review your file first. All row has error."
                this.message.open(FailedMessage)
              }
            }
          })
        } else {
          GenerationMsg.title = "Uploading.."
          GenerationMsg.message = "Please Wait. This will take a minute."
          const dl = this.message.open(GenerationMsg)
          this.sumbitV2(dl)
        }
      }

      sumbitV2(dl){
        var file = this.fileDetail
        var obj = {
          cacheName: file.guid,
          uploadType: 31162 // Upload Manual
        }
        this.fileService.postInsertFromMemory(obj)
        .subscribe({
          next: (value: any) => {
              dl.close()
              if (value.statusCode == 200) {
                this.successMessage.message = value.message
                this.message.open(this.successMessage)
              } else {
                this.message.open(FailedMessage)
              }
            },
            error: (e) => {
                console.error(e)
                this.message.open(FailedMessage)
            }
          });
      }

      handleExportAll(){
        this.coreService.exportAll(this.request,'12663','1')
      }
}
