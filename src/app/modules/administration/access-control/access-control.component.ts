
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AccessControl } from 'app/model/administration/access-control';
import { MasterService } from 'app/services/masterService/master.service';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { TenantService } from 'app/services/tenantService/tenant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GF } from 'app/shared/global-functions';
import { MatTable } from '@angular/material/table';
import { SearchHierarchy } from 'app/model/dropdown.model';

export interface dropdownAccess {
  moduleId: number;
  companyId: number;
  branchId: number[];
  departmentId: number[];
  company: string;
  branch: string;
  department: string;
}

const ELEMENT_DATA: dropdownAccess[] = [
  { moduleId: 3,  companyId: 0,company: "ILM-Company3",  branchId: [], branch: 'ILM-Branch', departmentId: [], department: "IT" },
  { moduleId: 3,  companyId: 0,company: "ILM-Company3",  branchId: [], branch: 'ILM-Branch', departmentId: [], department: "IT" },
  { moduleId: 15, companyId: 0,company: "ILM-Company15", branchId: [], branch: 'ILM-Branch', departmentId: [], department: "IT" },
  { moduleId: 15, companyId: 0,company: "ILM-Company15", branchId: [], branch: 'ILM-Branch', departmentId: [], department: "IT" },
  { moduleId: 25, companyId: 0,company: "ILM-Company25", branchId: [], branch: 'ILM-Branch', departmentId: [], department: "IT" },
  { moduleId: 31, companyId: 0,company: "ILM-Company31", branchId: [], branch: 'ILM-Branch', departmentId: [], department: "IT" },
];


@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.css']
})
export class AccessControlComponent implements OnInit {
  accessForm: FormGroup
  displayedColumns: string[] = ['name', 'view', 'add', 'edit'];
  moduleSource = []
  id: string;

  dropdownColumns: string[] = ['module', 'company', 'branch', 'department', 'confidential', 'delete'];
  dropdownSource: any = []

  // dropdown access
  modules: any
  company: any
  branch: any
  department: any
  confidential: any

  exclModules: any
  exclCompanys: any
  exclBranchs: any
  exclDepartments: any
  exclConfi: any

  reset: boolean = false
  disableOptions: number[] = []
  @ViewChild(MatTable) matTable: MatTable<any>;

  // defaultTag = [{id:[],type:-1},{id:[],type:-2},{id:[],type:38}]
  // resultHierarchy = new SearchHierarchy;

  constructor(
    private fb: FormBuilder, 
    private message: FuseConfirmationService, 
    private tenantService: TenantService, 
    private masterService: MasterService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.accessForm = this.fb.group(new AccessControl());
    this.id = this.route.snapshot.paramMap.get('id') == "" ? "0" : this.route.snapshot.paramMap.get('id');

    if(this.id != "0"){
      this.tenantService.getAccessControl(this.id).subscribe({
        next: (value: any) => {
          if (value.statusCode == 200) {
            this.accessForm.patchValue(value.payload)
            this.moduleSource = value.payload.accessControlModule
            
            // console.log(this.moduleSource)
            var access = []
            if (value.payload.companyAccessResponse.some(x=>x.moduleId.moduleID === 0)) {
              access.push(value.payload.companyAccessResponse[0])
            } else {
              access = value.payload.companyAccessResponse
            }
            this.dropdownSource = access.map(item =>({
              ModuleId: item.moduleId.moduleID,
              moduleName: item.moduleId.moduleName,
              //Display on Table
              companys: item.companys,
              branchs: item.branchs,
              departments: item.departments,
              confidentials: item.confidentials,
              //Saving
              CompanyID: item.companys.map(x=>x.companyID),
              BranchID: item.branchs.map(x=>x.branchID),
              DepartmentID: item.departments.map(x=>x.departmentID),
              IdConfidential: item.confidentials.map(x=>x.confidentialID),
            }))

            this.disableOptions = this.dropdownSource.map(x=>x.ModuleId)

          }
          else {
            console.log(value.stackTrace)
            console.log(value.message)
          }
        },
        error: (e) => {
          console.error(e)
        }
      });
    }
    else{
      this.masterService.getAccessControlModule("0").subscribe({
        next: (value: any) => {
          if (value.statusCode == 200) {
            // console.log(value.payload)
            this.moduleSource = value.payload
            
          }
          else {
            console.log(value.stackTrace)
            console.log(value.message)
          }
        },
        error: (e) => {
          console.error(e)
        }
      });
    }
  }

  submit(){
    this.accessForm.controls.accessControlModule.patchValue(this.moduleSource);

    this.accessForm.markAllAsTouched();
    if (this.accessForm.valid) {
      this.accessForm.get("accessControlDropdownPost").setValue(this.dropdownSource)
      const dialogRef = this.message.open(SaveMessage);

      dialogRef.afterClosed().subscribe((result) => {
        if (result == "confirmed") {
          this.tenantService.postAccessControl(this.accessForm.value).subscribe({
            next: (value: any) => {
              if (value.statusCode == 200) {
                this.message.open(SuccessMessage);
                this.router.navigate(['/search/access-control-list']);
              }
              else {
                FailedMessage.message = "Transaction Failed!"
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
      });
    }
  }

  handlerAll(event, type, parentId, subId, index, column) {
    if(type == "SubParent")
    {
      let parent = this.moduleSource.filter(x => x.moduleId == parentId)[0];
      let subParent = parent.child[index].props
      subParent.forEach(function (value) {
        if(column=="View"){
          value.view = event
        }
        if(column=="Add"){
          value.add = event
        }
        if(column=="Edit"){
          value.edit = event
        }
       
      }); 
    }
    else{
      let parent = this.moduleSource.filter(x => x.moduleId == parentId)[0];
      let subParent = parent.child.filter(x => x.moduleId == subId)[0];
      let child =  subParent.child[index].props
      child.forEach(function (value) {
        if(column=="View"){
          value.view = event
        }
        if(column=="Add"){
          value.add = event
        }
        if(column=="Edit"){
          value.edit = event
        }
      }); 
    }
  }

  handlerView(event, type, index, parentId, subId){
    if(type == "SubParent")
    {
      let parent = this.moduleSource.filter(x => x.moduleId == parentId)[0];
      let subParent = parent.child[index]
      if(!event){
        subParent.isAdd = false
        subParent.isEdit = false
        subParent.isField = false
        subParent.props.forEach(function (value) {
            value.view = false
            value.add = false
            value.edit = false
        }); 
      }
    }
    else{
      let parent = this.moduleSource.filter(x => x.moduleId == parentId)[0];
      let subParent = parent.child.filter(x => x.moduleId == subId)[0];
      let child =  subParent.child[index]
      if(!event){
        child.isAdd = false
        child.isEdit = false
        child.isField = false
      }
    }
  }

  getIds(object){
    return GF.IsEmpty(object) ? [] : object.filter(x=>!GF.IsEmpty(x.dropdownID)).map(x=>x.dropdownID)
  }

  addDA() {
    this.reset = true
    if (GF.IsEmpty(this.company) || GF.IsEmpty(this.branch) || GF.IsEmpty(this.department)) {
      var failedMessage = Object.assign({},FailedMessage)
      failedMessage.title = "Required Fields"
      failedMessage.message = "All Fields are required."
      this.message.open(failedMessage)
      return
    }
    // if (this.dropdownSource.some(x=>x.CompanyID == this.company.dropdownID && x.ModuleId == this.modules.dropdownID)) {
    //   var failedMessage = Object.assign({},FailedMessage)
    //   failedMessage.title = "Duplicated Company"
    //   failedMessage.message = "Company already added."
    //   this.message.open(failedMessage)
    //   return
    // }

    if (this.modules.some(x => x === 0) && (this.dropdownSource.length > 0 && !this.dropdownSource.some(x=>x.ModuleId === 0))) {
      var failedMessage = Object.assign({},FailedMessage)
      failedMessage.title = "Not Allowed"
      failedMessage.message = "Remove Existing record first."
      this.message.open(failedMessage)
      return
    }
    
    // var id = (GF.IsEmptyReturn(this.dropdownSource[this.dropdownSource.length-1]?.id,0) + 1)
    var company = this.company.filter(x=>!GF.IsEmpty(x.dropdownID)).map(item=>({
      companyID: item.dropdownID,
      companyName: item.description
    }))

    var branch = this.branch.filter(x=>!GF.IsEmpty(x.dropdownID)).map(item=>({
      branchID: item.dropdownID,
      branchName: item.description
    }))

    var department = this.department.filter(x=>!GF.IsEmpty(x.dropdownID)).map(item=>({
      departmentID: item.dropdownID,
      departmentName: item.description
    }))

    var confidential = this.confidential.filter(x=>!GF.IsEmpty(x.dropdownID)).map(item=>({
      confidentialID: item.dropdownID,
      confidentialName: item.description
    }))

    try {
      this.modules.filter(x=>!this.dropdownSource.some(d=>d.ModuleId == x.dropdownID)).forEach(modules => {
        var isALL = false
        // ALL
        if (this.modules.some(x => x === 0)) {
          isALL = true
          modules.dropdownID = 0
          modules.description = "All"
        }

        if (this.company.some(x => x === 0)) {
          company = [{
            companyID: 0,
            companyName: "All"
          }]
        }

        if (this.branch.some(x => x === 0)) {
          branch = [{
            branchID: 0,
            branchName: "All"
          }]
        }

        if (this.department.some(x => x === 0)) {
          department = [{
            departmentID: 0,
            departmentName: "All"
          }]
        }

        if (this.confidential.some(x => x === 0)) {
          confidential = [{
            confidentialID: 0,
            confidentialName: "All"
          }]
        }
       
        var obj = {
          // id: id,
          ModuleId: modules.dropdownID,
          moduleName:  modules.description,
          //Display on Table
          companys: company,
          branchs: branch,
          departments: department,
          confidentials: confidential,
          //Saving
          CompanyID: company.map(x=>x.companyID),
          BranchID: branch.map(x=>x.branchID),
          DepartmentID: department.map(x=>x.departmentID),
          IdConfidential: confidential.map(x=>x.confidentialID),
          //Excluded
          exclModules: GF.IsEmptyReturn(this.exclModules,[]),
          exclCompanys: GF.IsEmptyReturn(this.exclCompanys,[]),
          exclBranchs: GF.IsEmptyReturn(this.exclBranchs,[]),
          exclDepartments: GF.IsEmptyReturn(this.exclDepartments,[]),
        }
        // console.log(obj)
        if (isALL) {
          if (!this.dropdownSource.some(x=>x.ModuleId === 0)) {
            this.dropdownSource.push(obj)
          }
          throw new Error("ExitLoop")
        } else {
          this.dropdownSource.push(obj)
        }

        this.exclModules  = []
        this.exclCompanys  = []
        this.exclBranchs  = []
        this.exclDepartments  = []
      });
    } catch (error) {
      //nothing happen
    }
    

    this.disableOptions = this.dropdownSource.map(x=>x.ModuleId)
    setTimeout(() => {
      this.reset = false
    }, 1000);
    this.matTable.renderRows()
  }

  deleteRow(ModuleId){
    var indx = this.dropdownSource.findIndex(x=>x.ModuleId == ModuleId)
    this.dropdownSource.splice(indx,1)
    this.disableOptions = this.dropdownSource.map(x=>x.ModuleId)
    this.matTable.renderRows()
  }

  loadDescription(list, obj) {
    return list.map(x => x[obj])
  }
}
