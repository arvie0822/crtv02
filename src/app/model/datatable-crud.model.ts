import { environment } from "environments/environment"
import { DatatableSetting, active, month, year, param, id, id_to } from "./settings";

export const DatatableCrud: DatatableSetting[] = [
    //#region Holiday
    {
        type: "holiday-view",
        title: "Holiday",
        form: [
            {key: "holidayId",          label: "id",             type: "number",      class: "w-full",    visible: false,  _value: 0,   required: false,  editable: false},
            {key: "holidayCode",        label: "code",           type: "text",        class: "w-full",    visible: false,  _value: "",  required: false,  editable: false},
            {key: "holidayHeaderName",  label: "Name",           type: "text",        class: "w-full",    visible: true,   _value: "",  required: true,   editable: true},
            {key: "holidayDescription", label: "Description",    type: "text",        class: "w-full",    visible: true,   _value: "",  required: true,   editable: true},
            {key: "day",                label: "Day",            type: "number",      class: "w-[100px]", visible: true,   _value: "",  required: true,   editable: true, max: 31},
            {key: "month",              label: "Month",          type: "select",      class: "w-[120px]", all: false, dropdown: 54,                       options: month, visible: true,   _value: "",  required: true, editable: true, dropdownType: {type: "fix",   uri: 54}},
            {key: "holidayYear",        label: "Year",           type: "select",      class: "w-[95px]",  all: true,  params: param,   multiselect: true, dropdown: 1015,  options: year,  visible: true,   _value: "",  required: true, editable: true, dropdownType: {type: "static",uri: 0}},
            {key: "holidayTypeId",      label: "Holiday Type",   type: "select",      class: "w-full",    all: false, dropdown: 19,    options: [], visible: true,   _value: null, required: true, editable: true, dropdownType: { type: "fix", uri: 19 }, },
            {key: "country",            label: "Country",        type: "select",      class: "w-full",    all: true, multiselect: true, dropdown: 3,       options: [], visible: true,   _value: null, required: true, editable: true, dropdownType: { type: "fix", uri: 3 }, },
            {key: "holidayStateID",     label: "State/Province", type: "entitlement", class: "w-full",    all: true, multiselect: true, dropdown: 61,    options: [], visible: true,   _value: null, required: true, editable: true, dropdownType: { type: "entitlement", uri: 61, id: "country" , id_to: id_to             }, },
            {key: "holidayCityID",      label: "City",           type: "entitlement", class: "w-full",    all: true, multiselect: true, dropdown: 9,     options: [], visible: true,   _value: null, required: true, editable: true, dropdownType: { type: "entitlement", uri: 9,  id: id , id_to: "holidayStateID"      }, },
            {key: "active",             label: "Status",         type: "select",      class: "w-[100px]", all: false,        dropdown: 305,   options: active, visible: true,   _value: true, required: false, editable: true, dropdownType: { type: "static", uri: 0 }, },
            {key: "createdBy",          label: "Created By",     type: "number",      class: "w-full",    visible: false,  _value: 0, required: false, editable: false}
        ],
        rows: [
            { "title": "Name", "column": "holidayName", "defaultSort": true  },
            { "title": "Description", "column": "holidayDescription" },
            { "title": "Date", "column": "holidayDate" },
            { "title": "Month", "column": "holidayMonthDescription" },
            { "title": "Year", "column": "holidayYear" },
            { "title": "Holiday Type", "column": "holidayTypeDescription" },
            { "title": "Country", "column": "country" },
            { "title": "State/Province", "column": "stateProviceDescription" },
            { "title": "City", "column": "cityDescription" },
            { "title": "Status", "column": "activeTrue" },
        ],
        filter: [
            { id: "country",        _value: "", label: "Country",      type: "select-fix",  all: false, multiselect: false, dropdown: 3,    options: [], dropdownType:  { type: "fix",         uri: 3 }},
            { id: "holidayStateID", _value: "", label: "State",        type: "entitlement", all: false, multiselect: true,  dropdown: 61,   options: [], dropdownType:  { type: "entitlement", uri: 61, id: "country" , id_to: id_to        }},
            { id: "holidayCityID",  _value: "", label: "City",         type: "entitlement", all: false, multiselect: true,  dropdown: 9,    options: [], dropdownType:  { type: "entitlement", uri: 9,  id: id , id_to: "holidayStateID" }},
            { id: "holidayYear",    _value: "", label: "Year",         type: "select",      all: true,  multiselect: true,  dropdown: 1015, options: year, dropdownType:  { type: "static",      uri: 1015 }},
            { id: "holidayTypeId",  _value: "", label: "Holiday type", type: "select-fix",  all: false, multiselect: true,  dropdown: 19,   options: [], dropdownType:  { type: "fix",         uri: 19 }},
            { id: "active",         _value: "", label: "Status",       type: "select",      all: false, multiselect: false, dropdown: 3,    options: active },
        ],
        api: {
            table: environment.apiUrl + "attendance/getHolidayTable",
            post: environment.apiUrl + "attendance/postHoliday",
            get: environment.apiUrl + "attendance/getHoliday"
        },
        excludeExport: [],
        delete: {
            show: false,
            key: ""
        }
    },
    //#endregion
    //#region Shift Code
    {
        type: "shift",
        title: "Shift Code",
        form: [
            { key: "shiftPerDayId",     label: "shift ID",            type: "number", class: "w-full",  visible: false, _value: 0,          required: false, editable: false },
            { key: "shiftName",         label: "Shift Name",          type: "text",   class: "w-full",  visible: true,  _value: "",         required: true,  editable: false },
            { key: "matTimeIn",         label: "Time In",             type: "text",   class: "w-full",  visible: false, _value: null,       required: false, editable: false },
            { key: "timeIn",            label: "Time In",            type: "time",   class: "w-full",  visible: true,  _value: null,       required: true,  editable: true  },
            { key: "matTimeOut",        label: "Time Out",            type: "text",   class: "w-full",  visible: false, _value: null,       required: false, editable: false },
            { key: "timeOut",           label: "Time Out",             type: "time",   class: "w-full",  visible: true,  _value: null,       required: true,  editable: true  },
            { key: "timeOutDaysCover",  label: "TimeOut Days Cover",  type: "number", class: "w-full",  visible: false, _value: 0,          required: false, editable: false },
            { key: "totalWorkingHours", label: "Total Working Hours", type: "number", class: "w-full",  visible: false, _value: 0,          required: false, editable: false },
            { key: "createdBy",         label: "Created By",          type: "number", class: "w-full",  visible: false, _value: 0,          required: false, editable: false },
            { key: "dateCreated",       label: "Date Created",        type: "date",   class: "w-full",  visible: false, _value: new Date(), required: false, editable: false },
            { key: "active",            label: "Status", type: "select", class: "w-full", all: false, dropdown: 305, options: active, visible: true, _value: true, required: false, editable: true, dropdownType: { type: "static", uri: 0 }, },
            // { key: "active",            label: "Active",              type: "switch", class: "w-full",  visible: false, _value: true,       required: false, editable: false },
        ],
        rows: [
            { "title": "Shift Name", "column": "shiftName", "defaultSort": true },
            { "title": "Time In",    "column": "timeIn" },
            { "title": "Time Out",   "column": "timeOut" },
            { "title": "Status",     "column": "active" },
        ],
        filter: [
            {  "id": "shiftName","_value": "", "label": "Shift Name", "type": "input", "icon": "feather:edit-2", },
        ],
        api: {
            table: environment.apiUrl + "shift/getShiftPerDayTable",
            post: environment.apiUrl + "shift/postShiftPerDay",
            get: environment.apiUrl + "shift/getShiftCodePerday"
        },
        excludeExport: ["encryptId", "matTimeIn", "matTimeOut", "totalWorkingHours", "createdBy", "timeOutDaysCover"],
        delete: {
            show: false,
            key: ""
        }
    },
    //#endregion
    //#region Dropdown settings
    {
        type: "dropdown-settings",
        title: "Dropdown settings",
        form: [
            { key: "dropdownId",          label: "PrimaryKey",     type: "number", class: "w-full", visible: false, _value: 0,          required: false, editable: false },
            { key: "dropdownTypeId",      label: "Dropdown Name",  type: "custom", class: "w-full", visible: true,  _value: null,       required: true,  editable: true,  dropdownType: { type: "custom", uri: 1003 },},
            { key: "dropdownDescription", label: "Dropdown Entry", type: "text",   class: "w-full", visible: true,  _value: "",         required: true,  editable: true  },
            { key: "createdBy",           label: "CreatedBy",      type: "number", class: "w-full", visible: false, _value: 0,          required: false, editable: false },
            { key: "dateCreated",         label: "DateCreated",    type: "date",   class: "w-full", visible: false, _value: new Date(), required: false, editable: false , dateFormat: "yyyy-MM-ddTHH:mm:ss"},
            { key: "active",              label: "Active",         type: "select", class: "w-full", visible: true,  _value: true,       required: true,  editable: true, dropdownType: { type: "static", uri: 0 }, dropdown: 305,options: active },
            { key: "deleted",             label: "Deleted",        type: "bool",   class: "w-full", visible: false, _value: false,      required: false, editable: false },
        ],
        rows: [
            { title: "Dropdown Name",  column: "dropdownName"   },
            { title: "Dropdown entry", column: "dropdownEntry", defaultSort: true  },
            { title: "Date Created",   column: "dateCreated"    },
            { title: "Created by",     column: "createdBy"      },
            { title: "Status",         column: "active"         },
        ],
        filter: [
            { id: "dropdownTypeID", _value: "", label: "Dropdown Name",  type: "custom", multiselect: true, options: [], dropdownType: { type: "custom", uri: 1003 } },
            { id: "dropdownEntry",  _value: "", label: "Dropdown Entry", type: "input",  multiselect: false},
        ],
        api: {
            table: environment.apiUrl + "tenant/getDropdownTable",
            post: environment.apiUrl + "tenant/postDropdown",
            get: environment.apiUrl + "tenant/getDropdown"
        },
        excludeExport: [],
        delete: {
            show: false,
            key: ""
        }
    },
    //#endregion
    //#region Account Codes
    {
        type: "account-codes",
        title: "Account Codes",
        form: [
            { key: "accountCode",         label: "Account Code",        type: "select", class: "w-full", visible: true,  _value: 0,          required: false, editable: false, dropdown: 133, dropdownType: { type: "fix", uri: 133},},
            { key: "accountName",         label: "Account Name",        type: "select", class: "w-full", visible: true,  _value: null,       required: true,  editable: true,  dropdown: 134, dropdownType: { type: "fix", uri: 134 }, multiselect: true},
            { key: "accountDescription",  label: "Account Description", type: "text",   class: "w-full", visible: true,  _value: "",         required: true,  editable: true  },
            { key: "active",              label: "Status",              type: "select", class: "w-full", visible: true,  _value: true,       required: true,  editable: true, dropdownType: { type: "static", uri: 0 }, dropdown: 305,options: active },
        ],
        rows: [
            { title: "Account Code",         column: "accountCode"   },
            { title: "Account Name",         column: "accountName", defaultSort: true  },
            { title: "Account Description",  column: "accountDescription"    },
            { title: "Created by",           column: "createdBy"      },
            { title: "Date Created",         column: "dateCreated"      },
            { title: "Status",               column: "active"         },
        ],
        filter: [
            { id: "accountCode",   _value: "", label: "Account Code",    type: "select-fix", multiselect: false, options: [],dropdown: 133,dropdownType: { type: "fix", uri: 133 } },
            { id: "accountNumber", _value: "", label: "Account Number",  type: "select-fix", multiselect: false, options: [],dropdown: 134,dropdownType: { type: "fix", uri: 134 } },
        ],
        api: {
            table: environment.apiUrl + "payroll/getAccountCodesTable",
            post: environment.apiUrl + "payroll/postAccountCodes",
            get: environment.apiUrl + "payroll/getAccountCodes"
        },
        excludeExport: [],
        delete: {
            show: false,
            key: ""
        }
    },
    //#endregion
    //#region Bonus Setup
    {
        type: "bonus-setup",
        title: "Bonus Setup",
        form: [
            { key: "id",             label: "PrimaryKey",         type: "number", class: "w-full", all: false, multiselect: false, visible: false, _value: 0,          required: false, editable: false },
            { key: "code",           label: "Code",               type: "text",   class: "w-full", all: false, multiselect: false, visible: false, _value: "",         required: false, editable: false },
            { key: "bonusType",      label: "Bonus Type",         type: "select", class: "w-full", all: false, multiselect: false, visible: true,  _value: null,       required: true,  editable: true  , dropdownType: { type: "fix",    uri: 142 }, dropdown: 142,options: [] },
            { key: "name",           label: "Name",               type: "text",   class: "w-full", all: false, multiselect: false, visible: true,  _value: "",         required: true,  editable: true  },
            { key: "description",    label: "Description",        type: "text",   class: "w-full", all: false, multiselect: false, visible: true,  _value: "",         required: false,  editable: true  },
            { key: "newHireDays",    label: "New Hire Days",      type: "number", class: "w-full", all: false, multiselect: false, visible: true,  _value: 1.000,      required: false, editable: true },
            { key: "basis",          label: "Calculation Basis",  type: "select", class: "w-full", all: true,  multiselect: true,  visible: true,  _value: null,       required: true,  editable: true  , dropdownType: { type: "fix",    uri: 146  }, dropdown: 146,options: [] },
            { key: "leave",          label: "Leave Category",     type: "select", class: "w-full", all: true,  multiselect: true,  visible: true,  _value: null,       required: false,  editable: true  , dropdownType: { type: "fix", uri: 90  }, dropdown: 90,options: [] },
            { key: "paidEarnings",   label: "Paid Earnings",      type: "custom", class: "w-full", all: true,  multiselect: true,  visible: true,  _value: null,       required: false,  editable: true  , dropdownType: { type: "custom", uri: 1022 }, dropdown: 308,options: [] },
            { key: "recurEarnings",  label: "Recurring Earnings", type: "custom", class: "w-full", all: true,  multiselect: true,  visible: true,  _value: null,       required: false,  editable: true  , dropdownType: { type: "custom", uri: 1050 }, dropdown: 1050,options: [] },
            { key: "attendance",     label: "Deduct",             type: "custom", class: "w-full", all: true,  multiselect: true,  visible: true,  _value: null,       required: false,  editable: true  , dropdownType: { type: "custom", uri: 1029 }, dropdown: 309,options: [] },
            { key: "createdBy",      label: "CreatedBy",          type: "number", class: "w-full", all: false, multiselect: false, visible: false, _value: 0,          required: false, editable: false },
            { key: "dateCreated",    label: "DateCreated",        type: "date",   class: "w-full", all: false, multiselect: false, visible: false, _value: new Date(), required: false, editable: false , dateFormat: "yyyy-MM-ddTHH:mm:ss"},
            { key: "active",         label: "Active",             type: "select", class: "w-full",                                 visible: true,  _value: true,       required: true,  editable: true, dropdownType: { type: "static", uri: 0 }, dropdown: 305,options: active },
            { key: "basicSalary",    label: "Basic Salary",       type: "bool",   class: "w-full", all: false, multiselect: false, visible: false, _value: false,      required: false, editable: false  },
            { key: "projBasicSalary",label: "Project Basic",      type: "bool",   class: "w-full", all: false, multiselect: false, visible: false, _value: false,      required: false, editable: false  },
            { key: "currentMBS",     label: "MBS",                type: "bool",   class: "w-full", all: false, multiselect: false, visible: false, _value: false,      required: false, editable: false  },
            { key: "regularDays",    label: "Regular Days",       type: "bool",   class: "w-full", all: false, multiselect: false, visible: false, _value: false,      required: false, editable: false  },
            { key: "holiday",        label: "Regular Days",       type: "bool",   class: "w-full", all: false, multiselect: false, visible: false, _value: false,      required: false, editable: false  },
            { key: "overtime",       label: "Regular Days",       type: "bool",   class: "w-full", all: false, multiselect: false, visible: false, _value: false,      required: false, editable: false  },
        ],
        rows: [
            { title: "Bonus Type",    column: "bonusTypeName"  },
            { title: "Name",          column: "name",          defaultSort: true  },
            { title: "Description",   column: "description"    },
            { title: "Status",        column: "status"         },
            { title: "Date Created",  column: "dateCreated"    },
            { title: "Created by",    column: "createdBy"      },
        ],
        filter: [
            { id: "bonusTypeId",      _value: "", label: "Bonus Type",  type: "select-fix",  all: false, multiselect: false, dropdown: 142,    options: [], dropdownType:  { type: "fix", uri: 142 }},
            { id: "code",        _value: "", label: "Code",        type: "input",  multiselect: false},
            { id: "description", _value: "", label: "Description", type: "input",  multiselect: false},
        ],
        api: {
            table: environment.apiUrl + "payroll/getBonusSetupTable",
            post: environment.apiUrl + "payroll/postBonusSetup",
            get: environment.apiUrl + "payroll/getBonusSetup",
            delete: environment.apiUrl + "payroll/postDeleteDynamicBonus"
        },
        excludeExport: [],
        delete: {
            show: true,
            key: "bonusId"
        }
    },
    //#endregion
     //#region Cost Allocation
     {
        type: "cost-allocation-view",
        title: "Cost-Allocation",
        form: [
            { key: "id",                     label: "PrimaryKey",        type: "number",      class: "w-full",  visible: false, all: false,  _value: 0,          required: false,  editable: false, multiselect: false },
            { key: "idCostCenter",           label: "Cost Center",       type: "select",      class: "w-full",  visible: true,  all: false,  _value: "",         required: true,   editable: true,  dropdown: 39, options: month, dropdownType: {type: "fix",   uri: 39}},
            { key: "employeeId",             label: "Name",              type: "custom",      class: "w-full",  visible: true,               _value: null,       required: true,   editable: true,  dropdownType: { type: "custom", uri: 1005 },},
            { key: "percentage",             label: "Percentage",        type: "number",      class: "w-full",  visible: true,  all: false,  _value: 1.000,      required: false,  editable: true,  multiselect: false },
            { key: "cutoffId",               label: "Frequency",         type: "select",      class: "w-full",  visible: true,  all: false,  _value: "",          required: false,   editable: true,  dropdown: 53, options: month, dropdownType: {type: "fix",   uri: 53}},
            { key: "recurStartDate",         label: "Recur Start",       type: "datepicker",  class: "w-full",  visible: true,  all: false,  _value: new Date(), required: false,  editable: true,  multiselect: false, dateFormat: "yyyy-MM-dd"},
            { key: "recurEndDate",           label: "Recur End",         type: "datepicker",  class: "w-full",  visible: true,  all: false,  _value: new Date(), required: false,  editable: true,  multiselect: false, dateFormat: "yyyy-MM-dd"},
            { key: "remarks",                label: "Remarks",           type: "text",        class: "w-full",  visible: false,              _value: "",         required: false,  editable: false },
            { key: "guid",                   label: "GUID",              type: "text",        class: "w-full",  visible: false,              _value: "",         required: false,  editable: false },
            { key: "filename",               label: "Filename",          type: "text",        class: "w-full",  visible: false,              _value: "",         required: false,  editable: false },
            { key: "costCenterDescription",  label: "Cost Center Desc",  type: "text",        class: "w-full",  visible: false,              _value: "",         required: false,  editable: false },
            { key: "dateCreated",            label: "Date Created",      type: "date",        class: "w-full",  visible: false, all: false,  _value: new Date(), required: false,  editable: true , multiselect: false, dateFormat: "yyyy-MM-dd"},
            { key: "dateUpdated",            label: "Date Updated",      type: "date",        class: "w-full",  visible: false, all: false,  _value: new Date(), required: false,  editable: true , multiselect: false, dateFormat: "yyyy-MM-dd"},
            { key: "frequency",              label: "Cutoff ID",         type: "text",        class: "w-full",  visible: false,              _value: "",         required: false,  editable: false},
            { key: "createdBy",              label: "Created By",        type: "number",      class: "w-full",  visible: false, all: false,  _value: 0,          required: false,  editable: false, multiselect: false },
            { key: "updatedBy",              label: "Updated By",        type: "number",      class: "w-full",  visible: false, all: false,  _value: 0,          required: false,  editable: false, multiselect: false },
            { key: "active",                 label: "Status",            type: "select",      class: "w-full",  visible: true,               _value: true,       required: true,   editable: true,  dropdownType: { type: "static", uri: 0 }, dropdown: 305,options: active },
            { key: "isView",                 label: "View",              type: "select",      class: "w-full",  visible: false,              _value: true,       required: false,  editable: false, dropdownType: { type: "static", uri: 0 }, dropdown: 305,options: active },
        ],
        rows: [
            { title: "Employee ID",       column: "employeeID", defaultSort: true },
            { title: "Name",              column: "name"      },
            { title: "Cost Center",       column: "costCenter"    },
            { title: "Percentage",        column: "percentage"         },
            { title: "Frequency",         column: "frequency"    },
            { title: "Recurring Start",   column: "recurringStart"      },
            { title: "Recurring End",     column: "recurringEnd"      },
            { title: "Status",            column: "status"      },
            { title: "Created By",        column: "createdBy"      },
            { title: "Date Created",      column: "dateCreated"      },
            { title: "Updated By",        column: "updatedBy"      },
            { title: "Date Updated",      column: "dateUpdated"      },
        ],
        filter: [
            { id: "tagType",                     label: "",             type: "e-hierarchy",  all: true, multiselect: true, tagType: [{id:[],type:-1},{id:[],type:-2},{id:[],type:-4}]},
            { id: "idCostCenter",   _value: "",  label: "Cost Center",  type: "select-fix",  all: false, multiselect: false, dropdown: 39,    options: [], dropdownType:  { type: "fix", uri: 39 }},
            { id: "recurringStart", _value: "",  label: "Date From",    type: "date", "icon": "feather:edit-2", },
            { id: "recurringEnd",   _value: "",  label: "Date To",      type: "date", "icon": "feather:edit-2", },
            { id: "active",         _value: "",  label: "Status",       type: "select",      all: false, multiselect: false, dropdown: 3,    options: active },

        ],
        api: {
            table: environment.apiUrl + "payroll/getCostAllocationTable",
            post: environment.apiUrl + "payroll/postCostAllocation",
            get: environment.apiUrl + "payroll/getCostAllocation",
            delete: environment.apiUrl + "payroll/DeleteCostAllocation"
        },
        excludeExport: [],
        delete: {
            show: true,
            key: "costAllocationID"
        },
        btn_upload: true
    },
    //#endregion


]
