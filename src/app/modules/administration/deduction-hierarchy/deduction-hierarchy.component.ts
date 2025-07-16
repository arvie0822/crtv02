import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Hierarchy } from 'app/model/administration/deduction-hierarchy';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle, CdkDragStart, CdkDropList} from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-deduction-hierarchy',
  templateUrl: './deduction-hierarchy.component.html',
  styleUrls: ['./deduction-hierarchy.component.css']
})


export class DeductionHierarchyComponent implements OnInit {
    @ViewChild('table') table: MatTable< any >;
    deductionHierarchyForm   : FormGroup
    displayedColumns         : any    [] = [];
    columnsToDisplay         : string [] = [];
    data                     : any    [] = [];
    previousIndex            : number;
    taxSource = [
        {daily:'Compensation Range'    , d1: '685 and Below', d2: '685-1,095'          , d3: '1,096-2,196',              d4: '2,192-5,478',               d5: '5,479-21,917',              d6: '21,918 and above'},
        {daily:'Prescribed Withholding', d1: '0.00'         , d2: '0.00 + 15% over 685', d3: '61.85 + 20% over 1,096',   d4: '280.85 + 25% over 2,192',   d5: '1,102.60 +30% over 5,479',  d6: '6,034 +35% over 21,918'},
      ];

    taxColumns: string[] = ['daily','d1', 'd2', 'd3', 'd4', 'd5', 'd6'];


    CSColumns = [{ column:'Level',          columnDef: 'level'         , disabled: true  },
                 { column:'Loan/Deduction', columnDef: 'loanDeductions', disabled: true }];

    CS_DATA = [
       { level: 1, loanDeductions: 'Negative_Sal_Loan', disabled: true },
       { level: 2, loanDeductions: 'HDMF Contribution', disabled: true },
       { level: 3, loanDeductions: 'PHIC Contribution', disabled: true },
       { level: 4, loanDeductions: 'SSS'              , disabled: false },
       { level: 5, loanDeductions: 'HDMF Loan'        , disabled: true },
    ];

    items = [
        {value: 'I can be dragged',      disabled: false},
        {value: 'I cannot be dragged',   disabled: true},
        {value: 'I can also be dragged', disabled: false},
      ];

    payOpt = [
        {id: 0, description: 'Yes'},
        {id: 1, description: 'No'},
    ];

    statusOpt = [
        {id: 0, description: 'Inactive'},
        {id: 1, description: 'Active'},
    ];

    amountfixed = [
        {id: 0, description: 'Fixed Amount'},
        {id: 1, description: '% of Basic'},
        {id: 2, description: '% of Gross'},
    ];

    amountfixedD = [
        {id: 1, description: 'All'},
        {id: 2, description: 'Max Amount'},
        {id: 3, description: '% of Basic'},
        {id: 4, description: '% of Gross'},
    ];

    done = ['Negative_Sal_`Loan`', 'HDMF Contribution', 'PHIC Contribution', 'SSS', 'HDMF Loan'];

    doneCount = []


  constructor(private fb: FormBuilder,private dn: DecimalPipe,) { }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
    transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
    );
    }
    }

  ngOnInit() {

    for (let index = 1; index <= this.done.length; index++) {
        this.doneCount.push(index)
    }

    this.deductionHierarchyForm = this.fb.group(new Hierarchy());
    this.deductionHierarchyForm.reset()
    this.displayedColumns = this.CSColumns
    this.columnsToDisplay = this.displayedColumns.map(item=>item.columnDef).slice();
    this.data = this.CS_DATA

  }


  dropTable(event: CdkDragDrop< any [] >) {
    const prevIndex = this.data.findIndex((d) => d === event.item.data);
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    this.table.renderRows();
  }

  setDisplayedColumns() {
    this.CS_DATA.forEach(( column, index) => {
        column.level = index;
      this.displayedColumns[index] = column.loanDeductions;
    });
  }

  dragStarted(event: CdkDragStart, index: number ) {
    this.previousIndex = index;
  }

  dropListDropped(event: CdkDropList, index: number) {
    debugger
    if (event) {
      moveItemInArray(this.CS_DATA, this.previousIndex, index);
      this.setDisplayedColumns();

    }
  }

  drops(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }

  format(event: any,a) {
    const input = event.target;
    const value = parseFloat(input.value);
    const transformedValue = value.toFixed(2);
    input.value = transformedValue;
    this.deductionHierarchyForm.get('a').setValue(transformedValue);
  }

  resetValue(){
    this.deductionHierarchyForm.get('minAmount').setValue(null)
    this.deductionHierarchyForm.get('minAmount1').setValue(null)
    this.deductionHierarchyForm.get('maxAmount').setValue(null)
    this.deductionHierarchyForm.get('maxAmount1').setValue(null)
}

resetAll(){
    this.deductionHierarchyForm.get('amountDrop').setValue(null)
    this.deductionHierarchyForm.get('minAmount').setValue(null)
    this.deductionHierarchyForm.get('minAmount1').setValue(null)
    this.deductionHierarchyForm.get('companyAdvance').setValue(null)
    this.deductionHierarchyForm.get('maxAmount').setValue(null)

}
resetAllow(){
    this.deductionHierarchyForm.get('maxAmount').setValue(null)
    this.deductionHierarchyForm.get('maxAmount1').setValue(null)
    this.deductionHierarchyForm.get('amountDropp').setValue(null)
}

}

