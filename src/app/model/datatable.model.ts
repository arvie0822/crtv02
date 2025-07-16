import { environment } from "environments/environment"

export class TableRequest {
    Search: string = ""
    Order: string = ""
    OrderBy: string = "ASC"
    Start: number = 0
    Length: number = sessionStorage.getItem('moduleId') == '46' ? 6 : 10
    SearchColumn: any[] = []
}


export const Datatable = [
    {//default
        type: "default",
        title: "default",
        rows: [],
        filter: [],
        excludeExport: [],
        hasProcess: false,
        link: {
            uri: ""
        },
        api: {
            uri: ""
        }
    },
    {//track-completion
        type: "track-completion",
        title: "Track Completion",
        rows: [
            { "title": "Employee ID", "column": "employeeCode", "defaultSort": true  },
            { "title": "First name", "column": "firstName" },
            { "title": "Middle name", "column": "middleName"},
            { "title": "Last Name", "column": "lastName"},
            { "title": "Date of Birth", "column": "birthDate"},
            { "title": "Branch", "column": "site"},
            { "title": "Date Uploaded", "column": "dateUploaded"},
            { "title": "Data Entry Status", "column": "dataEntryStatus"},
            { "title": "CRT Status", "column": "crtGenerationStatus"},
            { "title": "Account Type", "column": "accountType"},
        ],
        filter: [
            { id: "UploadedFrom",           ty: 4,  value: "", label: "Uploaded From",  type: "date",       icon: "feather:edit-2", },
            { id: "UploadedTo",             ty: 5,  value: "", label: "Uploaded To",    type: "date",       icon: "feather:edit-2", },
            { id: "DataEntryStatus",        ty: 9,  value: "", label: "Data Entry",     type: "select",     isAll: false, all: true, multiselect: true, dropdown: 3, options: [{ dropdownID: "Complete", description: "Complete" }, { dropdownID: "Incomplete", description: "Incomplete" }] },
            { id: "CRTGenerationStatus",    ty: 9,  value: "", label: "CRT Status",     type: "select",     isAll: false, all: true, multiselect: true, dropdown: 3, options: [{ dropdownID: "Complete", description: "Complete" }, { dropdownID: "Incomplete", description: "Incomplete" }] },
            { id: "Site",                   ty: 9,  value: "", label: "Site",           type: "custom",     isAll: false, all: true, multiselect: true, dvalue: "description",  options: [], dropdownType: { type: "custom", uri: 1056 } },
            { id: "AccountTypeId",          ty: 10, value: "", label: "Account Type",   type: "select-fix", isAll: false, all: true, multiselect: true, dropdown: 173, options: [], dropdownType: { type: "fix", uri: 173  } },
            { id: "EmployeeId",             ty: 2,  value: "", label: "Employee",       type: "custom",     isAll: false, all: true, multiselect: true, dvalue: "dropdownID",   options: [], dropdownType: { type: "custom", uri: 1055 } },
            { id: "employeeCode",           ty: 0,  value: "", label: "Employee ID", type: "input",  dvalue: "",            isAll: false, all: false, multiselect: false, options: [], dropdownType: { type: "input",  uri: 0    } },
        ],
        btn_search: true,
        btn_create: false,
        btn_export: false,
        btn_extract: false,
        btn_upload: false,
        btn_generate: true,
        btn_generateAll: true,
        btn_deleteCRT: false,
        btn_uploadCRT: false,
        action: false,
        checkbox: true,
        includeInactive: false,
        excludeExport: ["encryptid", "id"],
        hasProcess: false,
        link: {
            uri: "/detail/employee-detail/"
        },
        api: {
            uri: environment.apiUrl + "user/getEmployeeCRTTable"
        }
    },
    {//users
        type: "users",
        title: "User",
        rows: [
            { "title": "Employee ID", "column": "employeeCode", "defaultSort": true  },
            { "title": "First name", "column": "firstName" },
            { "title": "Middle name", "column": "middleName"},
            { "title": "Last Name", "column": "lastName"},
            { "title": "Suffix", "column": "suffix"},
            { "title": "Date of Birth", "column": "birthDate"},
            { "title": "Site", "column": "site"},
            { "title": "Account Type", "column": "accountType"},
            { "title": "Employee TIN", "column": "tin"},
        ],
        filter: [
            { id: "Site",         ty: 9, value: "", label: "Site",        type: "custom", dvalue: "description", isAll: false, all: true,  multiselect: true,  options: [], dropdownType: { type: "custom", uri: 1056 } },
            { id: "EmployeeId",   ty: 2, value: "", label: "Employee",    type: "custom", dvalue: "dropdownID",  isAll: false, all: true,  multiselect: true,  options: [], dropdownType: { type: "custom", uri: 1055 } },
            { id: "employeeCode", ty: 0, value: "", label: "Employee ID", type: "input",  dvalue: "",            isAll: false, all: false, multiselect: false, options: [], dropdownType: { type: "input",  uri: 0    } },
        ],
        btn_search: true,
        btn_create: false,
        btn_export: false,
        btn_upload: false,
        btn_extract: true,
        btn_addCRT: true,
        btn_generate: false,
        btn_generateAll: false,
        btn_deleteCRT: true,
        btn_uploadCRT: true,
        btn_dlTemplate: true,
        action: true,
        checkbox: true,
        includeInactive: false,
        excludeExport: ["encryptid", "id"],
        hasProcess: false,
        link: {
            uri: "/detail/employee-detail/"
        },
        api: {
            uri: environment.apiUrl + "user/getEmployeeCRTTable"
        }
    },
    // Admin
    {//track-completion
        type: "crt-reports",
        title: "CRT Reports",
        rows: [
            { "title": "Employee ID", "column": "employeeCode", "defaultSort": true  },
            { "title": "First name", "column": "firstName" },
            { "title": "Middle name", "column": "middleName"},
            { "title": "Last Name", "column": "lastName"},
            { "title": "Date of Birth", "column": "birthDate"},
            { "title": "Branch", "column": "site"},
            { "title": "Date Uploaded", "column": "dateUploaded"},
            { "title": "Data Entry Status", "column": "dataEntryStatus"},
            { "title": "CRT Status", "column": "crtGenerationStatus"},
            { "title": "Account Type", "column": "accountType"},
        ],
        filter: [
            { id: "UploadedFrom",           ty: 4,  value: "", label: "Uploaded From",  type: "date",       icon: "feather:edit-2", },
            { id: "UploadedTo",             ty: 5,  value: "", label: "Uploaded To",    type: "date",       icon: "feather:edit-2", },
            { id: "DataEntryStatus",        ty: 9,  value: "", label: "Data Entry",     type: "select",     isAll: false, all: true, multiselect: true, dropdown: 3, options: [{ dropdownID: "Complete", description: "Complete" }, { dropdownID: "Incomplete", description: "Incomplete" }] },
            { id: "CRTGenerationStatus",    ty: 9,  value: "", label: "CRT Status",     type: "select",     isAll: false, all: true, multiselect: true, dropdown: 3, options: [{ dropdownID: "Complete", description: "Complete" }, { dropdownID: "Incomplete", description: "Incomplete" }] },
            { id: "Site",                   ty: 9,  value: "", label: "Site",           type: "custom",     isAll: false, all: true, multiselect: true, dvalue: "description",  options: [], dropdownType: { type: "custom", uri: 1056 } },
            { id: "AccountTypeId",          ty: 10, value: "", label: "Account Type",   type: "select-fix", isAll: false, all: true, multiselect: true, dropdown: 173, options: [], dropdownType: { type: "fix", uri: 173  } },
            { id: "EmployeeId",             ty: 2,  value: "", label: "Employee",       type: "custom",     isAll: false, all: true, multiselect: true, dvalue: "dropdownID",   options: [], dropdownType: { type: "custom", uri: 1055 } },
            { id: "employeeCode",           ty: 0,  value: "", label: "Employee ID", type: "input",  dvalue: "",            isAll: false, all: false, multiselect: false, options: [], dropdownType: { type: "input",  uri: 0    } },
        ],
        btn_search: true,
        btn_create: false,
        btn_export: false,
        btn_exportInfo: true,
        btn_extract: false,
        btn_upload: false,
        btn_generate: false,
        btn_generateAll: false,
        btn_deleteCRT: false,
        btn_uploadCRT: false,
        action: false,
        checkbox: true,
        includeInactive: false,
        excludeExport: ["encryptid", "id"],
        hasProcess: false,
        link: {
            uri: "/detail/employee-detail/"
        },
        api: {
            uri: environment.apiUrl + "user/getEmployeeCRTTable"
        }
    },
    // {//branch
    //     type: "branch",
    //     title: "Branch",
    //     rows: [
    //         { "title": "Branch Name", "column": "name", "defaultSort": true },
    //         { "title": "Industry", "column": "industry" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //         { "title": "Created By", "column": "createdByName" },
    //     ],
    //     filter: [
    //         // { "id": "branchCode", "value": "", "label": "Branch Code", "type": "input", "icon": "feather:edit-2", },
    //         { "id": "name", "value": "", "label": "Branch Name", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: ["encryptId", "branchId"],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/branch/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "tenant/getBranchTable"
    //     }
    // },
    // {//sub-company
    //     type: "sub-company",
    //     title: "Company",
    //     rows: [
    //         { "title": "Company Name", "column": "name", "defaultSort": true },
    //         { "title": "Industry", "column": "industry" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //         { "title": "Created By", "column": "createdByName" },
    //     ],
    //     filter: [
    //         // { "id": "branchCode", "value": "", "label": "Branch Code", "type": "input", "icon": "feather:edit-2", },
    //         { "id": "name", "value": "", "label": "Company Name", "type": "input", "icon": "feather:search", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,

    //     excludeExport: [""],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/sub-company/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "tenant/getSubCompanyTable"
    //     }
    // },
    // // {// Earnings
    // //     type: "earnings",
    // //     title: "Earnings",
    // //     rows: [
    // //         { "title": "PayCode", "column": "", "defaultSort": true },
    // //         { "title": "Earning Description", "column": "" },
    // //         { "title": "Earning Category  ", "column": "" },
    // //         { "title": "Employee Category ", "column": "" },
    // //         { "title": "Payroll Category", "column": "" },
    // //         { "title": "Frequency", "column": "" },
    // //         { "title": "TK Related ", "column": "" },
    // //         { "title": "Status", "column": "branchame" },
    // //     ],
    // //     filter: [
    // //         { id: "id", "value": "", label: "", type: "custom", multiselect: true, options: [], dropdownType: { type: "custom", uri: 1001 } },
    // //         { id: "id", "value": "", label: "", type: "custom", multiselect: true, options: [], dropdownType: { type: "custom", uri: 1002 } },
    // //         { id: "id", "value": "", label: "", type: "custom", multiselect: true, options: [], dropdownType: { type: "custom", uri: 1019 } },
    // //         // { id: "id", "value": "", label: "Deduction type", type: "select-fix", all: false, multiselect: true, dropdown: 27, options: [], dropdownType: { type: "fix", uri: 27 } },
    // //         { id: "id", "value": "", label: "", type: "custom", multiselect: true, options: [], dropdownType: { type: "custom", uri: 1005 } },
    // //         { "id": "", "value": "", "label": "Date From", "type": "date", "icon": "feather:edit-2", },
    // //         { "id": "", "value": "", "label": "Date To", "type": "date", "icon": "feather:edit-2", },
    // //         { id: "active", _value: "", label: "Loan Status", type: "select", all: false, multiselect: false, dropdown: 3, options: [{ dropdownID: 0, description: "Open" }, { dropdownID: 1, description: "Pause" }, { dropdownID: 1, description: "Close" }] },
    // //     ],
    // //     btn_search: true,
    // //     btn_create: true,
    // //     btn_export: true,
    // //     btn_upload: true,
    // //     btn_download: true,
    // //     btn_delete: true,

    // //     excludeExport: [],
    // //     hasProcess: false,
    // //     link: {
    // //         uri: "/detail/employee-earnings/"
    // //     },
    // //     api: {
    // //         uri: ""
    // //     }
    // // },
    // {//leave-view
    //     type: "leave-view",
    //     title: "Leave View",
    //     rows: [
    //         { "title": "Leave Name", "column": "name", "defaultSort": true },
    //         { "title": "Description", "column": "description" },
    //         { "title": "Accrual", "column": "accrual" },
    //         { "title": "Total accrual", "column": "totalAccrual" },
    //         { "title": "Accrual increase", "column": "accrualIncrease" },
    //         { "title": "Prorate", "column": "prorate" },
    //         { "title": "Carry Forward", "column": "carryForward" },
    //         { "title": "Convert to cash", "column": "convertToCash" },
    //         { "title": "Status", "column": "active" },
    //     ],
    //     filter: [
    //         { "id": "name", "value": "", "label": "Leave Name", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [""],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/leave-detail/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "leave/getLeaveTypeTable"
    //     }
    // },
    // {//shift-codes
    //     type: "shift-codes",
    //     title: "Shift Codes",
    //     rows: [
    //         { "title": "Shift Code", "column": "shiftCode", "defaultSort": true },
    //         { "title": "Shift Name", "column": "shiftName" },
    //         { "title": "Description", "column": "description" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //     ],
    //     filter: [
    //         { "id": "shiftCode", "value": "", "label": "Shift Code", "type": "input", "icon": "feather:edit-2", },
    //         { "id": "shiftName", "value": "", "label": "Shift Name", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: ["EncryptId", "ShifidtId"],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/shift-codes/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "shift/getShiftTable"
    //     }
    // },
    // {//shiftcodesperday-view
    //     type: "shiftcodesperday-view",
    //     title: "Shift Codes",
    //     rows: [
    //         { "title": "Shift Name", "column": "shiftName", "defaultSort": true },
    //         { "title": "Type", "column": "type" },
    //         { "title": "Sched In", "column": "timeIn" },
    //         { "title": "Sched Out", "column": "timeOut" },
    //     ],
    //     filter: [
    //         { "id": "shiftName", "value": "", "label": "Shift Name", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/shiftcodesperday-detail/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "shift/getShiftPerDayTable"
    //     }
    // },
    // {//payroll-cutoff-view
    //     type: "payroll-cutoff-view",
    //     title: "Payroll Cutoff View",
    //     rows: [
    //         { "title": "Payroll Cutoff Code", "column": "payrollCutoffCode", "defaultSort": true },
    //         { "title": "Description", "column": "description" },
    //         { "title": "Payroll Type", "column": "payrollType" },
    //         { "title": "Status", "column": "active" },
    //         { "title": "Created By", "column": "createdByDescription" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //     ],
    //     filter: [
    //         { "id": "payrollCutoffCode", "value": "", "label": "Payroll Cutoff Code", "type": "input", "icon": "feather:edit-2", },
    //         // { "id": "payrollType", "value": "", "label": "Payroll Type", "type": "input", "icon": "feather:edit-2", },
    //         { id: "payrollType", "value": "", label: "Payroll Type", type:"select-fix", all: false, multiselect: false, dropdown: 69, options: [], dropdownType: { type: "fix", uri: 69 } },

    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: ["encryptid", "headerId"],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/payroll-cutoff-detail/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "category/getPayrollCutoffHeaderTable"
    //     }
    // },
    // {//news-announcements-view
    //     type: "news-announcements-view",
    //     title: "News-Announcements",
    //     rows: [
    //         { "title": "News Code", "column": "newsCode", "defaultSort": true },
    //         { "title": "Company", "column": [] = "newsCompany" },
    //         { "title": "Branch", "column": [] = "newsBranch" },
    //         { "title": "Category", "column": [] = "newsCategory" },
    //         { "title": "Department", "column": [] = "department" },
    //         { "title": "Title", "column": "title" },
    //         { "title": "Description", "column": "description" },
    //         { "title": "Date From", "column": "dateFrom" },
    //         { "title": "Date To", "column": "dateTo" },
    //         { "title": "Status", "column": "active" },
    //         { "title": "Created By", "column": "createdBy" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //     ],
    //     filter: [
    //         { "id": "newsCode", "value": "", "label": "News Code", "type": "input", "icon": "feather:edit-2", },
    //         { "id": "title", "value": "", "label": "Title", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/news-announcements-detail/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "tenant/getNewsAnnouncementsTables"
    //     }
    // },
    // {//employee-list
    //     type: "employee-list",
    //     title: "Employee",
    //     rows: [
    //         { "title": "Employee Code", "column": "employeeCode" },
    //         { "title": "Display name", "column": "displayName", "defaultSort": true },
    //         { "title": "Sub company", "column": "subCompanyName" },
    //         { "title": "Branch", "column": "branchName" },
    //         { "title": "Category", "column": "categoryName" },
    //         { "title": "Access control", "column": "accessName" },
    //         { "title": "Department", "column": "department" },
    //         { "title": "Supervisor", "column": "supervisorName" },
    //         { "title": "Employee status", "column": "employeeStatus" },
    //     ],
    //     filter: [
    //         { "id": "displayName", "value": "", "label": "Employee Name", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     btn_upload: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: ["encryptid", "id"],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/employee-detail/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "user/getEmployeeTable"
    //     }
    // },
    // {//category-list
    //     type: "category-list",
    //     title: "Category",
    //     rows: [
    //         { "title": "Category Code", "column": "categoryCode", "defaultSort": true },
    //         { "title": "Category Name", "column": "categoryName" },
    //         { "title": "Description", "column": "categoryDescription" },
    //         { "title": "Active", "column": "active" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //     ],
    //     filter: [
    //         { "id": "categoryCode", "value": "", "label": "Category Code", "type": "input", "icon": "feather:edit-2", },
    //         { "id": "categoryName", "value": "", "label": "Category Name", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: ["encryptId", "branchId"],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/category-detail/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "category/getCategoryTable"
    //     }
    // },
    // {//employee-schedule-tagging
    //     type: "employee-schedule",
    //     title: "Employee Schedule",
    //     rows: [
    //         { "title": "Schedule Code", "column": "tagCode", "defaultSort": true },
    //         { "title": "Date From", "column": "dateFromString" },
    //         { "title": "Date To", "column": "dateToString" },
    //         { "title": "TagType", "column": "tagTypeDescription" },
    //         { "title": "Created By", "column": "createdByDescription" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //     ],
    //     filter: [
    //         {"id":"tagCode" ,"value": "", "label": "Schedule Code", "type": "input", "icon": "feather:edit-2"},
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: false,
    //     btn_upload: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: ["encryptId", "tagId", "shiftId"],
    //     hasProcess: true,
    //     link: {
    //         uri: "/detail/employee-schedule/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "shift/getEmployeeScheduleTagTable"
    //     }
    // },
    // {//employee-break-type
    //     type: "break-type-view",
    //     title: "Break Type",
    //     rows: [
    //         { "title": "Break Type Code", "column": "breakTypeCode", "defaultSort": true },
    //         { "title": "Description", "column": "description" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //         { "title": "Created By", "column": "createdByDescription" },
    //     ],
    //     filter: [
    //         { "value": "", "label": "Break Type Code", "type": "input", "icon": "feather:edit-2", },
    //         // { "value": "", "label": "", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/break-type/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "category/getBreakTypeTable"
    //     }
    // },
    // {//employee-timekeeping-category
    //     type: "timekeeping-category-view",
    //     title: "Timekeeping Category",
    //     rows: [
    //         { "title": "Tk Category Name", "column": "tkCategoryName", "defaultSort": true },
    //         { "title": "Tk Category Code", "column": "tkCategoryCode" },
    //         { "title": "Description", "column": "tkCategoryDescription" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //         { "title": "Created By", "column": "createdBy" },
    //     ],
    //     filter: [
    //         {"id":"tkCategoryName", "value": "", "label": "Category Name", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/timekeeping-category/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "category/getTimekeepingCategoryTable"
    //     }
    // },
    // {//ACCESS-CONTROL
    //     type: "access-control-list",
    //     title: "Access Control",
    //     rows: [
    //         { "title": "Name",   "column": "name", "defaultSort": true },
    //         { "title": "Description",   "column": "description" },
    //         { "title": "Active",        "column": "active" },
    //         { "title": "Created By",  "column": "createdBy" },
    //         { "title": "Date Created",  "column": "dateCreated" }
    //     ],
    //     filter: [
    //         { "id": "name", "value": "", "label": "Access Name", "type": "input", "icon": "feather:search", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     excludeExport: [],
    //     action: true,
    //     includeInactive: false,
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/access-control/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "tenant/getAccessControlTable"
    //     }
    // },
    // {//approval-process
    //     type: "approval-process",
    //     title: "Approval Process",
    //     rows: [
    //         { "title": "Approval Code", "column": "approvalCode", "defaultSort": true },
    //         { "title": "Approval Name", "column": "name" },
    //         { "title": "Level of Approval", "column": "levelOfApproval" },
    //         { "title": "Active", "column": "active" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //         { "title": "Created By", "column": "createdBy" },
    //     ],
    //     filter: [
    //         { "id":"name", "value": "", "label": "Approval Name", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/approval-process/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "tenant/getApprovalWorkflowTable"
    //     }
    // },
    // {//TK generation
    //     type: "timekeeping-generation-view",
    //     title: "Timekeeping",
    //     rows: [
    //         { "title": "Timekeeping Code", "column": "timekeepingCode", "defaultSort": true },
    //         { "title": "Date From", "column": "dateFrom" },
    //         { "title": "Date To", "column": "dateTo" },
    //         { "title": "Type", "column": "type" },
    //         { "title": "Created By", "column": "createdBy" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //         { "title": "Active", "column": "active" },
    //     ],
    //     filter: [
    //         // { "id": "branchCode", "value": "", "label": "Branch Code", "type": "input", "icon": "feather:edit-2", },
    //         { "id": "timekeepingCode", "value": "", "label": "Timekeeping Code", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     tkGeneration: true,
    //     excludeExport: [""],
    //     link: {
    //         uri: "/detail/timekeeping-generation/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "timekeeping/getTimekeepingTable"
    //     }
    // },
    // {//employee-break-type
    //     type: "filing",
    //     title: "filling",
    //     rows: [
    //         { "title": "Code", "column": "code", "defaultSort": true },
    //         { "title": "Date from", "column": "dateFrom" },
    //         { "title": "Date to", "column": "dateTo" },
    //         { "title": "Reason", "column": "reason" },
    //         { "title": "Status", "column": "status" },
    //         { "title": "Approval", "column": "approval" },
    //         { "title": "Approval date", "column": "approvalDate" },
    //         { "title": "Requested by", "column": "requestedBy" },
    //         { "title": "Requested date", "column": "requestedDate" },
    //     ],
    //     filter: [
    //         { "id": "filingType", "value": "", "label": "Filing type", "type": "input", "icon": "feather:edit-2", },
    //         { "id": "dateFrom", "value": "", "label": "Date from", "type": "input", "icon": "feather:edit-2", },
    //         { "id": "dateTo", "value": "", "label": "Date to", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/filing/"
    //     },

    //     api: {
    //     }
    // },
    // {//Statutory
    //     type: "setup",
    //     title: "Statutory",
    //     rows: [
    //         { "title": "Category", "column": "type", "defaultSort": true },
    //         { "title": "Name", "column": "name"},
    //         { "title": "Description", "column": "description" },
    //         { "title": "Created By", "column": "createdBy" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //         { "title": "Status", "column": "status" },

    //     ],
    //     filter: [
    //         { "id": "type", "value": "", "label": "Statutory", "type": "select", "icon": "feather:search", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: ["encryptId","id"],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/setup/",
    //         adds: "type", // from rows > column
    //     },
    //     api: {
    //         uri: environment.apiUrl + "payroll/getDynamicStatutoryTable"
    //     }
    // },
    // {//pay-codes
    //     type: "pay-codes",
    //     title: "Pay Codes",
    //     rows: [
    //         { "title": "Code", "column": "code", "defaultSort": true },
    //         { "title": "Description", "column": "description" },
    //         { "title": "Category", "column": "category" },
    //         { "title": "Type", "column": "type" },
    //         { "title": "Status", "column": "status" },
    //         { "title": "Created By", "column": "createdBy" },
    //         { "title": "Date Created", "column": "dateCreated" },

    //     ],
    //     filter: [
    //         { id: "type", "value": "", label: "Pay Code Type", type: "select", all: false, multiselect: false, dropdown: 16, options: [{dropdownID: "Earnings", description:"Earnings"},{dropdownID: "Deduction", description:"Deduction"},{dropdownID: "Loan", description:"Loan"}], dropdownType: { type: "fix", uri: 16 } },
    //         { "id": "code",         "value": "", "label": "Code ",         "type": "input", "icon": "feather:edit-2", },
    //         { "id": "description",  "value": "", "label": "Description",   "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: false,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/pay-codes/",
    //         adds: "type" // from rows > column
    //     },
    //     api: {
    //         uri: environment.apiUrl + "payroll/getLookupPayCodesTable"
    //     }
    // },
    // {//payroll-category
    //     type: "payroll-category",
    //     title: "Payroll Category",
    //     rows: [
    //         { "title": "Code", "column": "code", "defaultSort": true },
    //         { "title": "Description", "column": "description" },
    //         { "title": "Factor Rate", "column": "factorRate" },
    //         { "title": "Status", "column": "status" },
    //         { "title": "Created By", "column": "createdBy" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //     ],
    //     filter: [
    //         { "id": "code", "value": "", "label": "Code", "type": "input", "icon": "feather:edit-2", },
    //         { "id": "description", "value": "", "label": "Description", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/payroll-category/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "payroll/getPayrollCategoryTable"
    //     }
    // },
    // {
    //     type: "loans-view",
    //     title: "Loans",
    //     rows: [
    //         { "title": "Emp ID", "column": "employeeCode", "defaultSort": true },
    //         { "title": "Name", "column": "employeeName" },
    //         { "title": "Type", "column": "typeCode" },
    //         { "title": "Start Date", "column": "startDate" },
    //         { "title": "Frequency", "column": "frequency" },
    //         { "title": "Loan Amount", "column": "loanAmount" },
    //         { "title": "Amortization", "column": "amortization" },
    //         { "title": "Loan Status", "column": "loanStatus" },
    //         { "title": "Created by", "column": "createdBy" },
    //         { "title": "Date created", "column": "dateCreated" },
    //     ],
    //     filter: [
    //         { key: "tagType",       label: "",           type: "e-hierarchy",  all: true, multiselect: true, tagType: [{id:[],type:-1},{id:[],type:-2},{id:[],type:-4}]},
    //         { id: "typeId", "value": "", label: "", type: "custom", all: true, multiselect: true, options: [], dropdownType: { type: "custom", uri: 1016 } },
    //         { id: "recurringStart", "value": "", "label": "Date From", "type": "date", "icon": "feather:edit-2", },
    //         { id: "recurringEnd", "value": "", "label": "Date To", "type": "date", "icon": "feather:edit-2", },
    //         { id: "statusId", "value": "", label: "Status", type: "select", all: false, multiselect: false, dropdown: 3, options: [{ dropdownID: 1, description: "Open" }, { dropdownID: 3, description: "Pause" }, { dropdownID: 2, description: "Close" }] },
    //     ],
    //     btn_search: true,
    //     btn_reload: true,
    //     btn_create: true,
    //     btn_export: true,
    //     btn_upload: true,
    //     btn_download: false,
    //     btn_delete: true,
    //     action: true,
    //     includeInactive: true,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/payroll-loans-detail/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "payroll/getPayrollLoansTable"
    //     },
    //     api_delete: {
    //         uri: environment.apiUrl + "payroll/postDeleteLoans",
    //     }

    // },
    // {
    //     type: "deductions-view",
    //     title: "Deductions",
    //     rows: [
    //         { "title": "Emp ID", "column": "employeeCode", "defaultSort": true },
    //         { "title": "Name", "column": "employeeName" },
    //         { "title": "Type", "column": "typeCode" },
    //         { "title": "Recurring Start", "column": "recurringStart" },
    //         { "title": "Recurring End", "column": "recurringEnd" },
    //         { "title": "Amount", "column": "amount" },
    //         { "title": "Frequency", "column": "frequency" },
    //         { "title": "Status", "column": "status" },
    //         { "title": "Remarks", "column": "remarks" },
    //         { "title": "Created by", "column": "createdBy" },
    //         { "title": "Date created", "column": "dateCreated" },
    //     ],
    //     filter: [
    //         { key: "tagType",       label: "",           type: "e-hierarchy",  all: true, multiselect: true, tagType: [{id:[],type:-1},{id:[],type:-2},{id:[],type:-4}]},
    //         { id: "typeId", "value": "", label: "", type: "custom", all: true, multiselect: true, options: [], dropdownType: { type: "custom", uri: 1019 } },
    //         { id: "recurringStart", "value": "", "label": "Date From", "type": "date", "icon": "feather:edit-2", },
    //         { id: "recurringEnd", "value": "", "label": "Date To", "type": "date", "icon": "feather:edit-2", },
    //         { id: "statusId", "value": "", label: "Status", type: "select", all: false, multiselect: false, dropdown: 3, options: [{ dropdownID: 1, description: "Open" }, { dropdownID: 3, description: "Pause" }, { dropdownID: 2, description: "Close" }] },
    //     ],
    //     btn_search: true,
    //     btn_reload: true,
    //     btn_create: true,
    //     btn_export: true,
    //     btn_upload: true,
    //     btn_download: false,
    //     btn_delete: true,
    //     action: true,
    //     includeInactive: true,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/payroll-deductions-detail/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "payroll/getPayrollDeductionsTable"
    //     },
    //     api_delete: {
    //         uri: environment.apiUrl + "payroll/postDeleteDeductions",
    //     }
    // },
    //  {//schedule
    //     type: "schedule",
    //     title: "Schedule",
    //     rows: [
    //         { "title": "Schedule Code", "column": "tagCode", "defaultSort": true },
    //         { "title": "Date From", "column": "dateFromString" },
    //         { "title": "Date To", "column": "dateToString" },
    //         { "title": "TagType", "column": "tagTypeDescription" },
    //         { "title": "Created By", "column": "createdByDescription" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //     ],
    //     filter: [
    //         { "value": "", "label": "Shift Name", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: ["encryptId", "tagId", "shiftId"],
    //     hasProcess: true,
    //     link: {
    //         uri: "/detail/schedule/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "shift/getEmployeeScheduleTagTable"
    //     }
    // },
    // {//file-on-behalf
    //     type: "file-on-behalf",
    //     title: "File On Behalf",
    //     rows: [
    //         { "title": "Employee Code", "column": "employeeCode", "defaultSort": true },
    //         { "title": "Employee Name", "column": "employeeName"},
    //         { "title": "Date from", "column": "dateFrom" },
    //         { "title": "Date to", "column": "dateTo" },
    //         { "title": "Reason", "column": "reason" },
    //         { "title": "Status", "column": "status" },
    //         { "title": "Approval", "column": "approval" },
    //         { "title": "Approval date", "column": "approvalDate" },
    //         { "title": "Requested by", "column": "requestedBy" },
    //         { "title": "Requested date", "column": "requestedDate" },
    //     ],
    //     filter: [
    //         { "id": "filingType", "value": "", "label": "Filing type", "type": "select", "icon": "feather:edit-2", },
    //         { "id": "employeeName", "value": "", "label": "Employee Name", "type": "select", "icon": "feather:edit-2", },
    //         { "id": "dateFrom", "value": "", "label": "Date from", "type": "input", "icon": "feather:edit-2", },
    //         { "id": "dateTo", "value": "", "label": "Date to", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/file-on-behalf/"
    //     },
    //     api: {
    //     }
    // },
    // {//ded hierarchy
    //     type: "deduction-hierarchy",
    //     title: "Ded Hierarchy",
    //     rows: [
    //         { "title": "Hierarchy Name", "column": "hierarchyName", "defaultSort": true},
    //         { "title": "Description", "column": "description"},
    //         { "title": "Date Created", "column": "dateCreated"},
    //         { "title": "Created By", "column": "createdBy"},
    //     ],
    //     filter: [
    //         { "id": "hierarchyName", "value": "", "label": "Hierarchy Name", "type": "select", "icon": "feather:edit-2", },

    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/deduction-hierarchy/"
    //     },
    //     api: {
    //     }
    // },
    // {//Rates
    //     type: "rates",
    //     title: "Rates",
    //     rows: [
    //         { "title": "Code", "column": "code", "defaultSort": true},
    //         { "title": "Description", "column": "description"},
    //         { "title": "Status", "column": "active"},
    //         { "title": "Date Created", "column": "dateCreated"},
    //         { "title": "Created By", "column": "createdBy"},
    //     ],
    //     filter: [
    //         { "id": "code", "value": "", "label": " Code", "type": "input", "icon": "feather:edit-2", },
    //         { "id": "description", "value": "", "label": "Description ", "type": "input", "icon": "feather:edit-2", },

    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/rates/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "payroll/getLookupRateTypeTable"
    //     }
    // },
    // {
    //     type: "assign-requirments",
    //     title: "Assign Requirments",
    //     rows: [
    //         { "title": "Rquirements Name", "column": "employeeCode", "defaultSort": true },
    //         { "title": "Occupation", "column": "employeeName" },
    //         { "title": "Created By", "column": "typeCode" },
    //         { "title": "Date Created ", "column": "recurringStart" },
    //         { "title": "Status", "column": "recurringEnd" },
    //     ],
    //     filter: [
    //         { "id": "filingType", "value": "", "label": "Search", "type": "input", "icon": "feather:edit-2", },

    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/assign-requirments/"
    //     },
    //     api: {
    //     }
    // },
    // {
    //     type: "pre-approve-ot",
    //     title: "Pre Approve OT",
    //     rows: [
    //         { "title": "Rquirements Name", "column": "Code", "defaultSort": true },
    //         { "title": "Occupation", "column": "Type" },
    //         { "title": "Created By", "column": "OT Start" },
    //         { "title": "Date Created ", "column": "OT End" },
    //         { "title": "Status", "column": "Created By" },
    //         { "title": "Status", "column": "Date Created" },
    //     ],
    //     filter: [
    //         { "id": "filingType", "value": "", "label": "Code", "type": "input", "icon": "feather:edit-2", },

    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/pre-approve-ot/"
    //     },
    //     api: {
    //     }
    // },
    // { //payroll-run
    //     type: "payroll-run-view",
    //     title: "Payroll Run",
    //     rows: [
    //         { "title": "Code", "column": "payrollCode", "defaultSort": true , "orderBy":'desc',"hide":false},
    //         { "title": "Payout Type", "column": "payoutType", },
    //         { "title": "Payroll Cutoff", "column": "payrollCutoff" },
    //         { "title": "Company", "column": "company" },
    //         { "title": "Cutoff", "column": "cutoff" },
    //         { "title": "Cutoff Year", "column": "year" },
    //         { "title": "Cutoff Month", "column": "month" },
    //         { "title": "Payout Date", "column": "payoutDate" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //         { "title": "Created By", "column": "createdBy" },
    //     ],
    //     filter: [
    //         { "id": "PayrollCode", "value": "", "label": "Code", "type": "input", "icon": "feather:edit-2", },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     btn_delete: true,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/payroll-run/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "payroll/getPGMainTable"
    //     },
    //      api_delete: {
    //         uri: environment.apiUrl + "payroll/postPGMDelete",
    //     }
    // },{
    //     type: "earnings-view",
    //     title: "Earnings",
    //     rows: [
    //         { "title": "Emp ID", "column": "employeeCode", "defaultSort": true },
    //         { "title": "Name", "column": "employeeName" },
    //         { "title": "Type", "column": "typeCode" },
    //         { "title": "Recurring Start", "column": "recurringStart" },
    //         { "title": "Recurring End", "column": "recurringEnd" },
    //         { "title": "Amount", "column": "amount" },
    //         { "title": "Frequency", "column": "frequency" },
    //         { "title": "Status", "column": "status" },
    //         { "title": "Remarks", "column": "remarks" },
    //         { "title": "Created by", "column": "createdBy" },
    //         { "title": "Date created", "column": "dateCreated" },
    //     ],
    //     filter: [
    //         { key: "tagType",       label: "",           type: "e-hierarchy",  all: true, multiselect: true, tagType: [{id:[],type:-1},{id:[],type:-2},{id:[],type:-4}]},
    //         { id: "typeId", "value": "", label: "", type: "custom", all: true, multiselect: true, options: [], dropdownType: { type: "custom", uri: 1022 } },
    //         { id: "recurringStart", "value": "", "label": "Date From", "type": "date", "icon": "feather:edit-2", },
    //         { id: "recurringEnd", "value": "", "label": "Date To", "type": "date", "icon": "feather:edit-2", },
    //         { id: "statusId", "value": "", label: "Status", type: "select", all: false, multiselect: false, dropdown: 3, options: [{ dropdownID: 1, description: "Open" }, { dropdownID: 3, description: "Pause" }, { dropdownID: 2, description: "Close" }] },
    //     ],
    //     btn_search: true,
    //     btn_reload: true,
    //     btn_create: true,
    //     btn_export: true,
    //     btn_upload: true,
    //     btn_download: false,
    //     btn_delete: true,
    //     action: true,
    //     includeInactive: true,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/payroll-earnings-detail/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "payroll/getPayrollEarningsTable"
    //     },
    //     api_delete: {
    //         uri: environment.apiUrl + "payroll/postDeleteEarnings",
    //     }
    // },
    // {//employee-location
    //     type: "employee-location",
    //     title: "Employee Location",
    //     rows: [
    //         { "title": "Employee Code", "column": "employeeCode", "defaultSort": true },
    //         { "title": "Employee Name", "column": "employeeName" },
    //         { "title": "Date", "column": "dateFrom" },
    //         { "title": "Location", "column": "location" },
    //         { "title": "Created By", "column": "createdBy" },
    //         { "title": "Date Created", "column": "dateCreated" },
    //     ],
    //     filter: [
    //         { id: "dateFrom", "value": "", "label": "Date From", "type": "date", "icon": "feather:edit-2", },
    //         { id: "dateTo", "value": "", "label": "Date To", "type": "date", "icon": "feather:edit-2", },
    //         // { id: "code", "value": "", label: "Code", type: "select", all: false, multiselect: false, dropdown: 3, options: [] },
    //     ],
    //     btn_search: true,
    //     btn_create: true,
    //     btn_export: true,
    //     btn_upload: true,
    //     action: false,
    //     includeInactive: false,
    //     excludeExport: ["encryptId", "locationId"],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/employee-location/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "user/getAssignLocationTable"
    //     },

    // },{///////payreg-code
    //     type: "payreg-code-view",
    //     title: "Payreg Code",
    //     rows: [
    //         { "title": "ID", "column": "id", "defaultSort": true, "orderBy":'ASC', "hide":true },
    //         { "title": "Code", "column": "code"},
    //         { "title": "Description", "column": "description" },
    //         { "title": "Account Code", "column": "jeAccountCode" },
    //         { "title": "Account Name", "column": "jeAccountId" }
    //     ],
    //     filter: [
    //         { "id": "payregCode", "value": "", "label": "Payreg Code", "type": "input", "icon": "feather:edit-2"},
    //     ],
    //     btn_search: true,
    //     btn_create: false,
    //     btn_export: true,
    //     btn_upload: false,
    //     btn_download: false,
    //     btn_delete: false,
    //     action: true,
    //     includeInactive: false,
    //     excludeExport: [],
    //     hasProcess: false,
    //     link: {
    //         uri: "/detail/payreg-code/"
    //     },
    //     api: {
    //         uri: environment.apiUrl + "payroll/getLookupPayRegTable"
    //     }
    // }

]
