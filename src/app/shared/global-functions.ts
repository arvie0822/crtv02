export class GF {
    static IsEmpty(value: any): boolean {
        return value === null || value === undefined || value === '' || value === 0 || value?.length === 0;
    }

    static IsEmptyReturn(value: any, returns: any): any {
        return this.IsEmpty(value) ? returns : value;
    }

    static IsEqual(value: any, compare: any[]): any {
        return compare.includes(value)
    }

    static FilterEqual(list: any, compareOn: string = null, compare: any[]): any {
        if (compareOn) {
            return list.filter(x=>compare.includes(x[compareOn]))
        } else {
            return list.filter(x=>compare.includes(x))
        }
    }

    static FilterNotEqual(list: any, compareOn: string = null, compare: any[]): any {
        if (compareOn) {
            return list.filter(x=>!compare.includes(x[compareOn]))
        } else {
            return list.filter(x=>!compare.includes(x))
        }
    }

    static FilterNotIncludes(list: any, compareOn: string = null, compare: string): any {
        if (compareOn) {
            return list.filter(x=>!x[compareOn].toLowerCase().includes(compare.toLowerCase()) )
        } else {
            return list.filter(x=>!x.toLowerCase().includes(compare.toLowerCase()))
        }
    }

    static sort(list: any, sortby: string = null): any {
      if (sortby) {
        return list.sort((a, b) => a[sortby].toLowerCase().localeCompare(b[sortby].toLowerCase()));
      } else {
        return list.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      }
    }

    static unique(list: any, compare: any, object: string): any {
        list.forEach(op => {
            if (!compare.some(x => x[object] == op[object])) {
                compare.push(op)
            }
        });

        return compare;
    }

    static arraysAreEqual(array1, array2) {
        // Check if the arrays have the same length
        if (array1.length !== array2.length) {
          return false;
        }
      
        // Check each element of the arrays
        for (let i = 0; i < array1.length; i++) {
          if (array1[i] !== array2[i]) {
            return false;
          }
        }
      
        // If all elements are equal, the arrays are equal
        return true;
      }

    static ConvertSP(inputString) {
        const specialCharacters = {
          'á': 'a',
          'é': 'e',
          'í': 'i',
          'ó': 'o',
          'ú': 'u',
          'ñ': 'n',
          'Á': 'A',
          'É': 'E',
          'Í': 'I',
          'Ó': 'O',
          'Ú': 'U',
          'Ñ': 'N',
          'ä': 'a',
          'ë': 'e',
          'ï': 'i',
          'ö': 'o',
          'ü': 'u',
          'Ä': 'A',
          'Ë': 'E',
          'Ï': 'I',
          'Ö': 'O',
          'Ü': 'U',
          'à': 'a',
          'è': 'e',
          'ì': 'i',
          'ò': 'o',
          'ù': 'u',
          'À': 'A',
          'È': 'E',
          'Ì': 'I',
          'Ò': 'O',
          'Ù': 'U',
          'â': 'a',
          'ê': 'e',
          'î': 'i',
          'ô': 'o',
          'û': 'u',
          'Â': 'A',
          'Ê': 'E',
          'Î': 'I',
          'Ô': 'O',
          'Û': 'U',
          'å': 'a',
          'Å': 'A',
          'æ': 'ae',
          'Æ': 'AE',
          'ø': 'o',
          'Ø': 'O',
          'ç': 'c',
          'Ç': 'C',
          'ß': 'ss',
          'ÿ': 'y',
          'Ÿ': 'Y'
        };

        let outputString = '';

        for (let i = 0; i < inputString.length; i++) {
          const char = inputString[i];
          const convertedChar = specialCharacters[char] || char;
          outputString += convertedChar;
        }

        return outputString;
      }

}

var exportFileName = ""

export const Globals = {
    SERVICE_URL: 'https://v2uat.aanyahr.com:6300/reporting/reportservice/api/Viewer',
    REPORT_SERVER_URL: 'https://v2uat.aanyahr.com:6300/reporting/api/site/master',
    SERVER_TOKEN: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpsZGF5YW5kYW50ZUBpbGxpbWl0YWRvLmNvbSIsIm5hbWVpZCI6IjIiLCJ1bmlxdWVfbmFtZSI6IjQxZjQ0OTAyLTYzMjktNGVkMC1iMGZmLThlNTUwNGZmMGJlNiIsIklQIjoiNDkuMC4yNDMuMTU2IiwiaXNzdWVkX2RhdGUiOiIxNjg3NzY2NDkyIiwibmJmIjoxNjg3NzY2NDkyLCJleHAiOjE2ODgzNzEyOTIsImlhdCI6MTY4Nzc2NjQ5MiwiaXNzIjoiaHR0cHM6Ly92MnVhdC5hYW55YWhyLmNvbTo2MzAwL3JlcG9ydGluZy9zaXRlL21hc3RlciIsImF1ZCI6Imh0dHBzOi8vdjJ1YXQuYWFueWFoci5jb206NjMwMC9yZXBvcnRpbmcvc2l0ZS9tYXN0ZXIifQ.-i4jv_C70v5dCE8Bspv3YVEeLtgBjuSUBt1NXH4pdLs',
    DESIGNER_SERVICE_URL: '',
    TOOLBAR_OPTIONS: {
        showToolbar: true,
        customGroups: [{
            items: [{
                type: 'Default',
                cssClass: 'e-icon e-edit e-reportviewer-icon ej-webicon CustomGroup',
                id: 'edit-report',
                // Need to add the proper header and content once, the tool tip issue resolved.
                tooltip: {
                    header: 'Edit Report',
                    content: 'Edit this report in designer'
                }
            }],
            // Need to remove the css (e-reportviewer-toolbarcontainer ul.e-ul:nth-child(4)) once the group index issue resolved
            groupIndex: 3,
            cssClass: 'e-show'
        }]
    },
    DESTROY_REPORT: true,
    RENDERING_COMPLETE: (event) => {
        var parameters = event.reportParameters;
        exportFileName = parameters?.find(x=>x.name == "ReportName")?.values[0]
        var employee = parameters?.find(x=>x.name == "Employee")?.values
        sessionStorage.setItem("IDs",employee)
    },
    EXPORT_ITEM_CLICK: (event) => {
        event.fileName = exportFileName
        Globals.DESTROY_REPORT = false;
    },
    EDIT_REPORT: (args) => {
        if (args.value === 'edit-report') {
            const path = location.href.split('#');
            const reportPath = location.href.lastIndexOf('external-parameter-report') !== -1 ? 'external-parameter-report' :
                location.href.lastIndexOf('parameter-customization') !== -1 ? 'parameter-customization' : args.model.reportPath;
            const ReportDesignerPath = reportPath.indexOf('.rdlc') !== -1 ? 'report-designer/rdlc' : 'report-designer';
            window.open(`${path[0]}#/${ReportDesignerPath}?report-name=${reportPath}`,
                path[1].indexOf('/preview') === -1 ? '_blank' : '_self');

        }
    }
};
