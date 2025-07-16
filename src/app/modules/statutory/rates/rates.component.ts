import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HDMF, Rate, SSS, TAX, TAXA, TAXB, TAXC } from 'app/model/statutory/rates';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {

    rateForm :  FormGroup

    hdmfSource: HDMF[] = [

        {
            monthlySalary : '1,500 and Below',
            empeeShare    : '1%',
            empersShare   : '2%',
            total         : '3%'
        },
        {
            monthlySalary : 'Over 1,500',
            empeeShare    : '2%',
            empersShare   : '2%',
            total         : '4%'
        }
    ];
    hdmfColumns: string[] = ['monthlySalary', 'empeeShare','empersShare','total'];

    sssSource: SSS [] = [
        {range:'1,000 - 3,000', emp_comp: '3,000', mandatory: 0, total: '3,000',   reg1: 255.00,   reg2: 135.00,  reg3: 390.00,  emp1: 10,  emp2: 0, emp3: 10, mandatory1: 0, mandatory2: 0, mandatory3: 0, total1: 265.00, total2: 135.00, total3: 400.00  },
        {range:'1,000 - 3,000', emp_comp: '3,000', mandatory: 0, total: '3,000',   reg1: 255.00,   reg2: 135.00,  reg3: 390.00,  emp1: 10,  emp2: 0, emp3: 10, mandatory1: 0, mandatory2: 0, mandatory3: 0, total1: 265.00, total2: 135.00, total3: 400.00  },
        {range:'1,000 - 3,000', emp_comp: '3,000', mandatory: 0, total: '3,000',   reg1: 255.00,   reg2: 135.00,  reg3: 390.00,  emp1: 10,  emp2: 0, emp3: 10, mandatory1: 0, mandatory2: 0, mandatory3: 0, total1: 265.00, total2: 135.00, total3: 400.00  },
        {range:'1,000 - 3,000', emp_comp: '3,000', mandatory: 0, total: '3,000',   reg1: 255.00,   reg2: 135.00,  reg3: 390.00,  emp1: 10,  emp2: 0, emp3: 10, mandatory1: 0, mandatory2: 0, mandatory3: 0, total1: 265.00, total2: 135.00, total3: 400.00  },
      ];

    sssColumns: string[] = ['range','emp_comp', 'mandatory', 'total', 'reg1', 'reg2', 'reg3', 'emp1', 'emp2', 'emp3', 'mandatory1', 'mandatory2', 'mandatory3', 'total1', 'total2', 'total3'];

    taxSource: TAX [] = [
        {daily:'Compensation Range'    , d1: '685 and Below', d2: '685-1,095'          , d3: '1,096-2,196',              d4: '2,192-5,478',               d5: '5,479-21,917',              d6: '21,918 and above'},
        {daily:'Prescribed Withholding', d1: '0.00'         , d2: '0.00 + 15% over 685', d3: '61.85 + 20% over 1,096',   d4: '280.85 + 25% over 2,192',   d5: '1,102.60 +30% over 5,479',  d6: '6,034 +35% over 21,918'},
      ];

    taxColumns: string[] = ['daily','d1', 'd2', 'd3', 'd4', 'd5', 'd6'];

    taxASource: TAXA [] = [
        {week:'Compensation Range'    , w1: '685 and Below', w2: '685-1,095'          , w3: '1,096-2,196',              w4: '2,192-5,478',               w5: '5,479-21,917',              w6: '21,918 and above'},
        {week:'Prescribed Withholding', w1: '0.00'         , w2: '0.00 + 15% over 685', w3: '61.85 + 20% over 1,096',   w4: '280.85 + 25% over 2,192',   w5: '1,102.60 +30% over 5,479',  w6: '6,034 +35% over 21,918'},
      ];
    taxAColumns : string[] = ['week','w1', 'w2', 'w3', 'w4', 'w5', 'w6'];

    taxBSource: TAXB [] = [
        {semiMonth:'Compensation Range'    , sm1: '685 and Below', sm2: '685-1,095'          , sm3: '1,096-2,196',              sm4: '2,192-5,478',               sm5: '5,479-21,917',              sm6: '21,918 and above'},
        {semiMonth:'Prescribed Withholding', sm1: '0.00'         , sm2: '0.00 + 15% over 685', sm3: '61.85 + 20% over 1,096',   sm4: '280.85 + 25% over 2,192',   sm5: '1,102.60 +30% over 5,479',  sm6: '6,034 +35% over 21,918'},
      ];
    taxBColumns : string[] = ['semiMonth','sm1', 'sm2', 'sm3', 'sm4', 'sm5', 'sm6'];

    taxCSource: TAXC [] = [
        {monthly:'Compensation Range'    , m1: '685 and Below', m2: '685-1,095'          , m3: '1,096-2,196',              m4: '2,192-5,478',               m5: '5,479-21,917',              m6: '21,918 and above'},
        {monthly:'Prescribed Withholding', m1: '0.00'         , m2: '0.00 + 15% over 685', m3: '61.85 + 20% over 1,096',   m4: '280.85 + 25% over 2,192',   m5: '1,102.60 +30% over 5,479',  m6: '6,034 +35% over 21,918'},
      ];
    taxCColumns : string[] = ['monthly','m1', 'm2', 'm3', 'm4', 'm5', 'm6'];

    month = [
        {id: 0, description: 'January'},
        {id: 1, description: 'February'},
        {id: 2, description: 'March'},
        {id: 3, description: 'April'},
        {id: 4, description: 'May'},
        {id: 5, description: 'June'},
        {id: 6, description: 'July'},
        {id: 7, description: 'August'},
        {id: 8, description: 'September'},
        {id: 9, description: 'October'},
        {id: 10, description: 'November'},
        {id: 11, description: 'December'},
    ]
    year = [
      {id: 0, description: 2023},
      {id: 1, description: 2023},
      {id: 2, description: 2024},
      {id: 3, description: 2025},
      {id: 4, description: 2026},
      {id: 5, description: 2027},
    ]
    statutory = [
        {id: 0, description: 'SSS'},
        {id: 1, description: 'Tax'},
        {id: 2, description: 'HDMF'},
        {id: 3, description: 'PHIC'},
    ]



constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.rateForm = this.fb.group(new Rate());
  }


}
