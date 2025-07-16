import { environment } from "environments/environment"

var today = new Date()
var year: any = []
var yr = today.getFullYear()
for (let idx = (yr - 5); idx < (yr + 5); idx++) {
    year.push({ dropdownID: idx, description: idx + "" })
}

var publishList = [
    { dropdownID: true,  description: "Publish"   },
    { dropdownID: false, description: "Unpublish" }
]

export const details = [
    {
        moduleId: 123,
        reportName: "YTD_ALL",
        type: "Excel",
        downloadFromBE: false, 
        downloadFromBR: true,
        isPublish: false,
        url: "",
        parameters: [
            { id: "year",    key: "YearID" },
        ],
        fields: [
            { id: "year",      label: "Year",      value: "", type: "select",       required: true, all: false, multiselect: false, dropdown: 0,  options: year, dropdownType: { type: "fix", uri: 0  } },
        ]
    },
    {
        moduleId: 153,
        reportName: "Alphalist Dat",
        type: "Excel",
        downloadFromBE: true, 
        downloadFromBR: false,
        isPublish: false,
        url: environment.apiUrl + "payroll/postAlphalistSchedule",
        parameters: [
            { id: "year",       key: "YearID"        },
            { id: "company",    key: "SubCompanyID"  },
            { id: "branch",     key: "BranchID"      },
        ],
        fields: [
            { id: "year",       label: "Year",      value: "",   type: "select",       required: true, all: false,  multiselect: false,  type_id: -4, dropdown: 0,  options: year, dropdownType: { type: "fix", uri: 0  } },
            { id: "company",    label: "Company",   value: "",   type: "custom",       required: true, all: false,  multiselect: false,  type_id: -1, dropdown: 1001, options: []    },
            { id: "branch",     label: "Branch",    value: "",   type: "d-hierarchy",  required: true, all: true,   multiselect: true,   type_id: -2, tagType: {type: 1 , id: "company", type_id: -1}, customRequest: [] },
        ]
    },
    {
        moduleId: 154,
        reportName: "Alphalist Schedule",
        type: "Excel",
        downloadFromBE: true, 
        downloadFromBR: false,
        isPublish: false,
        url: environment.apiUrl + "payroll/postAlphalistDAT",
        parameters: [
            { id: "year",       key: "YearID"        },
            { id: "company",    key: "SubCompanyID"  },
            { id: "branch",     key: "BranchID"      },
        ],
        fields: [
            { id: "year",       label: "Year",      value: "",   type: "select",       required: true, all: false,  multiselect: false,  type_id: -4, dropdown: 0,  options: year, dropdownType: { type: "fix", uri: 0  } },
            { id: "company",    label: "Company",   value: "",   type: "custom",       required: true, all: false,  multiselect: false,  type_id: -1, dropdown: 1001, options: []    },
            { id: "branch",     label: "Branch",    value: "",   type: "d-hierarchy",  required: true, all: true,   multiselect: true,   type_id: -2, tagType: {type: 1 , id: "company", type_id: -1}, customRequest: [] },
        ]
    },
    {
        moduleId: 110,
        reportName: "2316 PDF_payrollrun",
        type: "pdf",
        downloadFromBE: true,
        downloadFromBR: true,
        isPublish: false,
        url: environment.apiUrl + "payroll/postExecute2316Run",
        parameters: [
            { id: "year",       key: "YearID"        },
            { id: "company",    key: "SubCompanyID"  },
            { id: "branch",     key: "BranchID"      },
            { id: "employee",   key: "EmployeeID"    },
            // { id: "publish",    key: "IsPublish"     },
        ],
        fields: [
            { id: "year",       label: "Year",      value: "",   type: "select",       required: true,   all: false,  multiselect: false,  type_id: -4, dropdown: 0,  options: year, dropdownType: { type: "fix", uri: 0  } },
            { id: "company",    label: "Company",   value: "",   type: "custom",       required: true,   all: false,  multiselect: false,  type_id: -1, dropdown: 1001, options: []    },
            { id: "branch",     label: "Branch",    value: "",   type: "d-hierarchy",  required: true,   all: true,   multiselect: true,   type_id: -2, tagType: {type: 1 , id: "company", type_id: -1}, customRequest: [] },
            { id: "employee",   label: "Employee",  value: "",   type: "d-hierarchy",  required: true,   all: true,   multiselect: true,   type_id: -4, tagType: {type: 6 , id: "branch",  type_id: -2}, customRequest: ["year"] },
            // { id: "publish",    label: "Publish",   value: "",   type: "select",       required: false,  all: false,  multiselect: false,  type_id: -4, dropdown: 0,  options: publishList, dropdownType: { type: "fix", uri: 0  } },
        ]
    },
]