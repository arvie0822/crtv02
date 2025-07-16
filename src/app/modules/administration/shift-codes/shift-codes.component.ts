import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { breakDetail, detailHide, ShiftDetail, ShiftForm } from 'app/model/administration/ShiftCodes';
import { DaysOfWeek } from 'app/model/app.constant';
import { FailedMessage, SaveMessage, SuccessMessage } from 'app/model/message.constant';
import { CoreService } from 'app/services/coreService/coreService.service';
import { ShiftService } from 'app/services/shiftService/shift.service';

@Component({
    selector: 'app-shift-codes',
    templateUrl: './shift-codes.component.html',
    styleUrls: ['./shift-codes.component.css']
})
export class ShiftCodesComponent implements OnInit {
    weekOneColumns: string[] = ['day', 'restday', 'timeIn', 'timeOut', 'totalWorkingHours', 'halfDayIn', 'halfDayInDaysCover', 'halfDayOut', 'halfDayOutDaysCover', 'breaks'];
    weekOneSource = []
    weekTwoColumns: string[] = ['day', 'restday', 'timeIn', 'timeOut', 'totalWorkingHours', 'halfDayIn', 'halfDayInDaysCover', 'halfDayOut', 'halfDayOutDaysCover', 'breaks'];
    weekTwoSource = []
    weekThreeColumns: string[] = ['day', 'restday', 'timeIn', 'timeOut', 'totalWorkingHours', 'halfDayIn', 'halfDayInDaysCover', 'halfDayOut', 'halfDayOutDaysCover', 'breaks'];
    weekThreeSource = []
    weekFourColumns: string[] = ['day', 'restday', 'timeIn', 'timeOut', 'totalWorkingHours', 'halfDayIn', 'halfDayInDaysCover', 'halfDayOut', 'halfDayOutDaysCover', 'breaks'];
    weekFourSource = []
    options = [{ dropdownID: 0, description: "No" }, { dropdownID: 2, description: "Two Week" }, { dropdownID: 3, description: "Three Week" }, { dropdownID: 4, description: "Four Week" }]
    shiftDetail: ShiftDetail[] = []
    detailHide = detailHide
    breakCount = breakDetail
    daysOfWeek = DaysOfWeek
    isSave: boolean = true
    id: string;
    shiftForm: FormGroup
    hideFirstColumn: boolean = true
    workingHours: number = 0
    @ViewChild('weekOneTable') weekOneTable: MatTable<any>;
    @ViewChild('weekTwoTable') weekTwoTable: MatTable<any>;
    @ViewChild('weekThreeTable') weekThreeTable: MatTable<any>;
    @ViewChild('weekFourTable') weekFourTable: MatTable<any>;
    pipe = new DatePipe('en-US');

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private coreService: CoreService,
        private message: FuseConfirmationService,
        private router: Router,
        private shiftService: ShiftService) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.shiftForm = this.fb.group(new ShiftForm());

        if (this.id != "") {
            this.shiftService.getShift(this.id).subscribe({
                next: (value: any) => {
                    if (value.statusCode == 200) {
                        this.shiftForm.patchValue(JSON.parse(JSON.stringify(value.payload).replace(/\:null/gi, "\:[]")))

                        this.weekOneSource = value.payload.shiftCodeDetail.filter(x => x.weeks == 1).map(item => ({
                            shiftCodeDetailId: item.shiftCodeDetailId,
                            description: this.daysOfWeek.filter(x => x.id == item.day)[0].description,
                            isFlexi: this.shiftForm.value.isFlexi,
                            timeIn: new Date("1900-01-01 " + item.timeIn),
                            timeOut: new Date("1900-01-01 " + item.timeOut),
                            timeOutDaysCover: item.timeIn > item.timeOut ? 1 : 0,
                            totalWorkingHours: item.totalWorkingHours,
                            day: item.day,
                            isRestDay: item.isRestDay,
                            halfDayIn: new Date("1900-01-01 " + item.halfDayIn),
                            halfDayInDaysCover: item.halfDayInDaysCover,
                            halfDayOut: new Date("1900-01-01 " + item.halfDayOut),
                            halfDayOutDaysCover: item.halfDayOutDaysCover,
                            breaks: item.breakCount,
                            firstBreakHide: true,
                            firstBreakIn: new Date("1900-01-01 " + item.firstBreakIn),
                            firstBreakInDaysCover: item.firstBreakInDaysCover,
                            firstBreakOut: new Date("1900-01-01 " + item.firstBreakOut),
                            firstBreakOutDaysCover: item.firstBreakOutDaysCover,
                            secondBreakHide: true,
                            secondBreakIn: new Date("1900-01-01 " + item.secondBreakIn),
                            secondBreakInDaysCover: item.secondBreakInDaysCover,
                            secondBreakOut: new Date("1900-01-01 " + item.secondBreakOut),
                            secondBreakOutDaysCover: item.secondBreakOutDaysCover,
                            thirdBreakIn: new Date("1900-01-01 " + item.thirdBreakIn),
                            thirdBreakInDaysCover: item.thirdBreakInDaysCover,
                            thirdBreakOut: new Date("1900-01-01 " + item.thirdBreakOut),
                            thirdBreakOutDaysCover: item.thirdBreakOutDaysCover,
                        }))

                        this.weekTwoSource = value.payload.shiftCodeDetail.filter(x => x.weeks == 2).map(item => ({
                            shiftCodeDetailId: item.shiftCodeDetailId,
                            description: this.daysOfWeek.filter(x => x.id == item.day)[0].description,
                            isFlexi: this.shiftForm.value.isFlexi,
                            timeIn: new Date("1900-01-01 " + item.timeIn),
                            timeOut: new Date("1900-01-01 " + item.timeOut),
                            timeOutDaysCover: item.timeIn > item.timeOut ? 1 : 0,
                            totalWorkingHours: item.totalWorkingHours,
                            day: item.day,
                            isRestDay: item.isRestDay,
                            halfDayIn: new Date("1900-01-01 " + item.halfDayIn),
                            halfDayInDaysCover: item.halfDayInDaysCover,
                            halfDayOut: new Date("1900-01-01 " + item.halfDayOut),
                            halfDayOutDaysCover: item.halfDayOutDaysCover,
                            breaks: item.breakCount,
                            firstBreakHide: true,
                            firstBreakIn: new Date("1900-01-01 " + item.firstBreakIn),
                            firstBreakInDaysCover: item.firstBreakInDaysCover,
                            firstBreakOut: new Date("1900-01-01 " + item.firstBreakOut),
                            firstBreakOutDaysCover: item.firstBreakOutDaysCover,
                            secondBreakHide: true,
                            secondBreakIn: new Date("1900-01-01 " + item.secondBreakIn),
                            secondBreakInDaysCover: item.secondBreakInDaysCover,
                            secondBreakOut: new Date("1900-01-01 " + item.secondBreakOut),
                            secondBreakOutDaysCover: item.secondBreakOutDaysCover,
                            thirdBreakHide: true,
                            thirdBreakIn: new Date("1900-01-01 " + item.thirdBreakIn),
                            thirdBreakInDaysCover: item.thirdBreakInDaysCover,
                            thirdBreakOut: new Date("1900-01-01 " + item.thirdBreakOut),
                            thirdBreakOutDaysCover: item.thirdBreakOutDaysCover,
                        }))

                        this.weekThreeSource = value.payload.shiftCodeDetail.filter(x => x.weeks == 3).map(item => ({
                            shiftCodeDetailId: item.shiftCodeDetailId,
                            description: this.daysOfWeek.filter(x => x.id == item.day)[0].description,
                            isFlexi: this.shiftForm.value.isFlexi,
                            timeIn: new Date("1900-01-01 " + item.timeIn),
                            timeOut: new Date("1900-01-01 " + item.timeOut),
                            timeOutDaysCover: item.timeIn > item.timeOut ? 1 : 0,
                            totalWorkingHours: item.totalWorkingHours,
                            day: item.day,
                            isRestDay: item.isRestDay,
                            halfDayIn: new Date("1900-01-01 " + item.halfDayIn),
                            halfDayInDaysCover: item.halfDayInDaysCover,
                            halfDayOut: new Date("1900-01-01 " + item.halfDayOut),
                            halfDayOutDaysCover: item.halfDayOutDaysCover,
                            breaks: item.breakCount,
                            firstBreakHide: true,
                            firstBreakIn: new Date("1900-01-01 " + item.firstBreakIn),
                            firstBreakInDaysCover: item.firstBreakInDaysCover,
                            firstBreakOut: new Date("1900-01-01 " + item.firstBreakOut),
                            firstBreakOutDaysCover: item.firstBreakOutDaysCover,
                            secondBreakHide: true,
                            secondBreakIn: new Date("1900-01-01 " + item.secondBreakIn),
                            secondBreakInDaysCover: item.secondBreakInDaysCover,
                            secondBreakOut: new Date("1900-01-01 " + item.secondBreakOut),
                            secondBreakOutDaysCover: item.secondBreakOutDaysCover,
                            thirdBreakHide: true,
                            thirdBreakIn: new Date("1900-01-01 " + item.thirdBreakIn),
                            thirdBreakInDaysCover: item.thirdBreakInDaysCover,
                            thirdBreakOut: new Date("1900-01-01 " + item.thirdBreakOut),
                            thirdBreakOutDaysCover: item.thirdBreakOutDaysCover,
                        }))

                        this.weekFourSource = value.payload.shiftCodeDetail.filter(x => x.weeks == 4).map(item => ({
                            shiftCodeDetailId: item.shiftCodeDetailId,
                            description: this.daysOfWeek.filter(x => x.id == item.day)[0].description,
                            isFlexi: this.shiftForm.value.isFlexi,
                            timeIn: new Date("1900-01-01 " + item.timeIn),
                            timeOut: new Date("1900-01-01 " + item.timeOut),
                            timeOutDaysCover: item.timeIn > item.timeOut ? 1 : 0,
                            totalWorkingHours: item.totalWorkingHours,
                            day: item.day,
                            isRestDay: item.isRestDay,
                            halfDayIn: new Date("1900-01-01 " + item.halfDayIn),
                            halfDayInDaysCover: item.halfDayInDaysCover,
                            halfDayOut: new Date("1900-01-01 " + item.halfDayOut),
                            halfDayOutDaysCover: item.halfDayOutDaysCover,
                            breaks: item.breakCount,
                            firstBreakHide: true,
                            firstBreakIn: new Date("1900-01-01 " + item.firstBreakIn),
                            firstBreakInDaysCover: item.firstBreakInDaysCover,
                            firstBreakOut: new Date("1900-01-01 " + item.firstBreakOut),
                            firstBreakOutDaysCover: item.firstBreakOutDaysCover,
                            secondBreakIn: new Date("1900-01-01 " + item.secondBreakIn),
                            secondBreakInDaysCover: item.secondBreakInDaysCover,
                            secondBreakOut: new Date("1900-01-01 " + item.secondBreakOut),
                            secondBreakOutDaysCover: item.secondBreakOutDaysCover,
                            thirdBreakHide: true,
                            thirdBreakIn: new Date("1900-01-01 " + item.thirdBreakIn),
                            thirdBreakInDaysCover: item.thirdBreakInDaysCover,
                            thirdBreakOut: new Date("1900-01-01 " + item.thirdBreakOut),
                            thirdBreakOutDaysCover: item.thirdBreakOutDaysCover,
                        }))
                        this.initBreaks()
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
        else {
            this.id != ""
            this.isSave = false
            this.weekOneSource = this.shiftService.getShiftDetail()
            this.weekTwoSource = this.shiftService.getShiftDetail()
            this.weekThreeSource = this.shiftService.getShiftDetail()
            this.weekFourSource = this.shiftService.getShiftDetail()
        }
        this.shiftForm.get("isFlexi").valueChanges.subscribe(control => {
            if (!control) {
                this.weekOneSource.map(x => x.totalWorkingHours = 0)
                this.workingHours = 0
                for (let item of this.weekOneSource) {
                    let eventStartTime = new Date(item.timeIn);
                    let eventEndTime = new Date(item.timeOut);
                    if (eventStartTime > eventEndTime) {
                        eventEndTime.setDate(eventEndTime.getDate() + 1)
                    }
                    let duration = eventEndTime.valueOf() - eventStartTime.valueOf();
                    item.totalWorkingHours = duration / 1000 / 60 / 60;
                }
            }
        });
    }

    initBreaks() {
        let highestBreak = 0

        this.weekOneColumns = this.weekOneColumns.filter(value => !this.detailHide.includes(value));
        for (let item of this.weekOneSource) {
            highestBreak = (highestBreak > item.breaks ? highestBreak : item.breaks)
        }
        this.weekOneColumns = [...this.weekOneColumns, ...this.breakCount.filter(x => x.id == highestBreak)[0].show];
        for (let item of this.weekOneSource) {
            this.weekOneSource.map(x => x.firstBreakHide = ((item.breaks > 0) ? false : true))
            this.weekOneSource.map(x => x.secondBreakHide = ((item.breaks > 1) ? false : true))
            this.weekOneSource.map(x => x.thirdBreakHide = ((item.breaks > 2) ? false : true))
        }

        highestBreak = 0
        this.weekTwoColumns = this.weekTwoColumns.filter(value => !this.detailHide.includes(value));
        for (let item of this.weekTwoSource) {
            highestBreak = (highestBreak > item.breaks ? highestBreak : item.breaks)
        }
        this.weekTwoColumns = [...this.weekTwoColumns, ...this.breakCount.filter(x => x.id == highestBreak)[0].show];
        for (let item of this.weekTwoSource) {
            this.weekTwoSource.map(x => x.firstBreakHide = ((item.breaks > 0) ? false : true))
            this.weekTwoSource.map(x => x.secondBreakHide = ((item.breaks > 1) ? false : true))
            this.weekTwoSource.map(x => x.thirdBreakHide = ((item.breaks > 2) ? false : true))
        }

        highestBreak = 0
        this.weekThreeColumns = this.weekThreeColumns.filter(value => !this.detailHide.includes(value));
        for (let item of this.weekThreeSource) {
            highestBreak = (highestBreak > item.breaks ? highestBreak : item.breaks)
        }
        this.weekThreeColumns = [...this.weekThreeColumns, ...this.breakCount.filter(x => x.id == highestBreak)[0].show];
        for (let item of this.weekThreeSource) {
            this.weekThreeSource.map(x => x.firstBreakHide = ((item.breaks > 0) ? false : true))
            this.weekThreeSource.map(x => x.secondBreakHide = ((item.breaks > 1) ? false : true))
            this.weekThreeSource.map(x => x.thirdBreakHide = ((item.breaks > 2) ? false : true))
        }

        highestBreak = 0
        this.weekFourColumns = this.weekFourColumns.filter(value => !this.detailHide.includes(value));
        for (let item of this.weekFourSource) {
            highestBreak = (highestBreak > item.breaks ? highestBreak : item.breaks)
        }
        this.weekFourColumns = [...this.weekFourColumns, ...this.breakCount.filter(x => x.id == highestBreak)[0].show];
        for (let item of this.weekFourSource) {
            this.weekFourSource.map(x => x.firstBreakHide = ((item.breaks > 0) ? false : true))
            this.weekFourSource.map(x => x.secondBreakHide = ((item.breaks > 1) ? false : true))
            this.weekFourSource.map(x => x.thirdBreakHide = ((item.breaks > 2) ? false : true))
        }
    }

    handleHeader(event, column, week) {
        if (week == "weekOne") {
            this.weekOneSource.map(x => x[column] = event)
            if (column == "breaks") {
                this.weekOneColumns = this.weekOneColumns.filter(value => !this.detailHide.includes(value));
                let highestBreak = 0
                for (let item of this.weekOneSource) {
                    highestBreak = (highestBreak > item.breaks ? highestBreak : item.breaks)
                }
                this.weekOneColumns = [...this.weekOneColumns, ...this.breakCount.filter(x => x.id == highestBreak)[0].show];
                this.weekOneSource.map(x => x.firstBreakHide = ((event > 0) ? false : true))
                this.weekOneSource.map(x => x.secondBreakHide = ((event > 1) ? false : true))
                this.weekOneSource.map(x => x.thirdBreakHide = ((event > 2) ? false : true))
                this.weekOneTable.renderRows();
            }
            if (column == "timeIn" || column == "timeOut") {
                for (let item of this.weekOneSource) {
                    let eventStartTime = new Date("1900-01-01 " + this.pipe.transform(item.timeIn, 'HH:mm:ss'));
                    let eventEndTime = new Date("1900-01-01 " + this.pipe.transform(item.timeOut, 'HH:mm:ss'));
                    if (eventStartTime > eventEndTime) {
                        eventEndTime.setDate(eventEndTime.getDate() + 1)
                    }
                    let duration = eventEndTime.valueOf() - eventStartTime.valueOf();
                    item.totalWorkingHours = duration / 1000 / 60 / 60;

                }
            }
        }
        if (week == "weekTwo") {
            this.weekTwoSource.map(x => x[column] = event)
            if (column == "breaks") {
                this.weekTwoColumns = this.weekTwoColumns.filter(value => !this.detailHide.includes(value));
                let highestBreak = 0
                for (let item of this.weekTwoSource) {
                    highestBreak = (highestBreak > item.breaks ? highestBreak : item.breaks)
                }
                this.weekTwoColumns = [...this.weekTwoColumns, ...this.breakCount.filter(x => x.id == highestBreak)[0].show];
                this.weekTwoSource.map(x => x.firstBreakHide = ((event > 0) ? false : true))
                this.weekTwoSource.map(x => x.secondBreakHide = ((event > 1) ? false : true))
                this.weekTwoSource.map(x => x.thirdBreakHide = ((event > 2) ? false : true))
                this.weekTwoTable.renderRows();
            }
            if (column == "timeIn" || column == "timeOut") {
                for (let item of this.weekTwoSource) {
                    let eventStartTime = new Date("1900-01-01 " + this.pipe.transform(item.timeIn, 'HH:mm:ss'));
                    let eventEndTime = new Date("1900-01-01 " + this.pipe.transform(item.timeOut, 'HH:mm:ss'));
                    if (eventStartTime > eventEndTime) {
                        eventEndTime.setDate(eventEndTime.getDate() + 1)
                    }
                    let duration = eventEndTime.valueOf() - eventStartTime.valueOf();
                    item.totalWorkingHours = duration / 1000 / 60 / 60;

                }
            }
        }
        if (week == "weekThree") {
            this.weekThreeSource.map(x => x[column] = event)
            if (column == "breaks") {
                this.weekThreeColumns = this.weekThreeColumns.filter(value => !this.detailHide.includes(value));
                let highestBreak = 0
                for (let item of this.weekThreeSource) {
                    highestBreak = (highestBreak > item.breaks ? highestBreak : item.breaks)
                }
                this.weekThreeColumns = [...this.weekThreeColumns, ...this.breakCount.filter(x => x.id == highestBreak)[0].show];
                this.weekThreeSource.map(x => x.firstBreakHide = ((event > 0) ? false : true))
                this.weekThreeSource.map(x => x.secondBreakHide = ((event > 1) ? false : true))
                this.weekThreeSource.map(x => x.thirdBreakHide = ((event > 2) ? false : true))
                this.weekThreeTable.renderRows();
            }
            if (column == "timeIn" || column == "timeOut") {
                for (let item of this.weekThreeSource) {
                    let eventStartTime = new Date("1900-01-01 " + this.pipe.transform(item.timeIn, 'HH:mm:ss'));
                    let eventEndTime = new Date("1900-01-01 " + this.pipe.transform(item.timeOut, 'HH:mm:ss'));
                    if (eventStartTime > eventEndTime) {
                        eventEndTime.setDate(eventEndTime.getDate() + 1)
                    }
                    let duration = eventEndTime.valueOf() - eventStartTime.valueOf();
                    item.totalWorkingHours = duration / 1000 / 60 / 60;

                }
            }
        }
        if (week == "weekFour") {
            this.weekFourSource.map(x => x[column] = event)
            if (column == "breaks") {
                this.weekFourColumns = this.weekFourColumns.filter(value => !this.detailHide.includes(value));
                let highestBreak = 0
                for (let item of this.weekFourSource) {
                    highestBreak = (highestBreak > item.breaks ? highestBreak : item.breaks)
                }
                this.weekFourColumns = [...this.weekFourColumns, ...this.breakCount.filter(x => x.id == highestBreak)[0].show];
                this.weekFourSource.map(x => x.firstBreakHide = ((event > 0) ? false : true))
                this.weekFourSource.map(x => x.secondBreakHide = ((event > 1) ? false : true))
                this.weekFourSource.map(x => x.thirdBreakHide = ((event > 2) ? false : true))
                this.weekFourTable.renderRows();
            }
            if (column == "timeIn" || column == "timeOut") {
                for (let item of this.weekFourSource) {
                    let eventStartTime = new Date("1900-01-01 " + this.pipe.transform(item.timeIn, 'HH:mm:ss'));
                    let eventEndTime = new Date("1900-01-01 " + this.pipe.transform(item.timeOut, 'HH:mm:ss'));
                    if (eventStartTime > eventEndTime) {
                        eventEndTime.setDate(eventEndTime.getDate() + 1)
                    }
                    let duration = eventEndTime.valueOf() - eventStartTime.valueOf();
                    item.totalWorkingHours = duration / 1000 / 60 / 60;

                }
            }
        }
    }

    handleToggleEvent(event, index, week) {
        if (week == "weekOne") {
            this.weekOneSource[index].isRestDay = event
            this.weekOneTable.renderRows();
        }
        if (week == "weekTwo") {
            this.weekTwoSource[index].isRestDay = event
            this.weekTwoTable.renderRows();
        }
        if (week == "weekThree") {
            this.weekThreeSource[index].isRestDay = event
            this.weekThreeTable.renderRows();
        }
        if (week == "weekFour") {
            this.weekFourSource[index].isRestDay = event
            this.weekFourTable.renderRows();
        }
    }

    handleBreakEvent(index, event, week) {
        if (week == "weekOne") {
            this.weekOneSource[index].breaks = event
            this.weekOneColumns = this.weekOneColumns.filter(value => !this.detailHide.includes(value));
            let highestBreak = 0
            for (let item of this.weekOneSource) {
                highestBreak = (highestBreak > item.breaks ? highestBreak : item.breaks)
            }
            this.weekOneColumns = [...this.weekOneColumns, ...this.breakCount.filter(x => x.id == highestBreak)[0].show];
            this.weekOneSource[index].firstBreakHide = ((event > 0) ? false : true)
            this.weekOneSource[index].secondBreakHide = ((event > 1) ? false : true)
            this.weekOneSource[index].thirdBreakHide = ((event > 2) ? false : true)

            this.weekOneTable.renderRows();
        }
        if (week == "weekTwo") {
            this.weekTwoSource[index].breaks = event
            this.weekTwoColumns = this.weekTwoColumns.filter(value => !this.detailHide.includes(value));
            let highestBreak = 0
            for (let item of this.weekTwoSource) {
                highestBreak = (highestBreak > item.breaks ? highestBreak : item.breaks)
            }
            this.weekTwoColumns = [...this.weekTwoColumns, ...this.breakCount.filter(x => x.id == highestBreak)[0].show];
            this.weekTwoSource[index].firstBreakHide = ((event > 0) ? false : true)
            this.weekTwoSource[index].secondBreakHide = ((event > 1) ? false : true)
            this.weekTwoSource[index].thirdBreakHide = ((event > 2) ? false : true)

            this.weekTwoTable.renderRows();
        }
        if (week == "weekThree") {
            this.weekThreeSource[index].breaks = event
            this.weekThreeColumns = this.weekThreeColumns.filter(value => !this.detailHide.includes(value));
            let highestBreak = 0
            for (let item of this.weekThreeSource) {
                highestBreak = (highestBreak > item.breaks ? highestBreak : item.breaks)
            }
            this.weekThreeColumns = [...this.weekThreeColumns, ...this.breakCount.filter(x => x.id == highestBreak)[0].show];
            this.weekThreeSource[index].firstBreakHide = ((event > 0) ? false : true)
            this.weekThreeSource[index].secondBreakHide = ((event > 1) ? false : true)
            this.weekThreeSource[index].thirdBreakHide = ((event > 2) ? false : true)

            this.weekThreeTable.renderRows();
        }
        if (week == "weekFour") {
            this.weekFourSource[index].breaks = event
            this.weekFourColumns = this.weekFourColumns.filter(value => !this.detailHide.includes(value));
            let highestBreak = 0
            for (let item of this.weekFourSource) {
                highestBreak = (highestBreak > item.breaks ? highestBreak : item.breaks)
            }
            this.weekFourColumns = [...this.weekFourColumns, ...this.breakCount.filter(x => x.id == highestBreak)[0].show];
            this.weekFourSource[index].firstBreakHide = ((event > 0) ? false : true)
            this.weekFourSource[index].secondBreakHide = ((event > 1) ? false : true)
            this.weekFourSource[index].thirdBreakHide = ((event > 2) ? false : true)

            this.weekFourTable.renderRows();
        }
    }

    handleTimeEvent(index, week) {
        if (week == "weekOne") {
            let eventStartTime = new Date(this.weekOneSource[index].timeIn);
            let eventEndTime = new Date(this.weekOneSource[index].timeOut);
            if (eventStartTime > eventEndTime) {
                eventEndTime.setDate(eventEndTime.getDate() + 1)
            }
            let duration = eventEndTime.valueOf() - eventStartTime.valueOf();
            this.weekOneSource[index].totalWorkingHours = duration / 1000 / 60 / 60;
        }
        if (week == "weekTwo") {
            let eventStartTime = new Date(this.weekTwoSource[index].timeIn);
            let eventEndTime = new Date(this.weekTwoSource[index].timeOut);
            if (eventStartTime > eventEndTime) {
                eventEndTime.setDate(eventEndTime.getDate() + 1)
            }
            let duration = eventEndTime.valueOf() - eventStartTime.valueOf();
            this.weekTwoSource[index].totalWorkingHours = duration / 1000 / 60 / 60;
        }
        if (week == "weekThree") {
            let eventStartTime = new Date(this.weekThreeSource[index].timeIn);
            let eventEndTime = new Date(this.weekThreeSource[index].timeOut);
            if (eventStartTime > eventEndTime) {
                eventEndTime.setDate(eventEndTime.getDate() + 1)
            }
            let duration = eventEndTime.valueOf() - eventStartTime.valueOf();
            this.weekThreeSource[index].totalWorkingHours = duration / 1000 / 60 / 60;
        }
        if (week == "weekFour") {
            let eventStartTime = new Date(this.weekFourSource[index].timeIn);
            let eventEndTime = new Date(this.weekFourSource[index].timeOut);
            if (eventStartTime > eventEndTime) {
                eventEndTime.setDate(eventEndTime.getDate() + 1)
            }
            let duration = eventEndTime.valueOf() - eventStartTime.valueOf();
            this.weekFourSource[index].totalWorkingHours = duration / 1000 / 60 / 60;
        }
    }

    handleDetailMapping() {
        this.shiftDetail = []
        for (let item of this.weekOneSource) {
            this.shiftDetail.push({
                shiftCodeDetailId: item.shiftCodeDetailId,
                isFlexi: this.shiftForm.value.isFlexi,
                timeIn: this.pipe.transform(item.timeIn, 'HH:mm:ss'),
                timeOut: this.pipe.transform(item.timeOut, 'HH:mm:ss'),
                timeOutDaysCover: item.timeIn > item.timeOut ? 1 : 0,
                totalWorkingHours: item.totalWorkingHours,
                day: item.day,
                weeks: 1,
                isRestDay: item.isRestDay,
                halfDayIn: this.pipe.transform(item.halfDayIn, 'HH:mm:ss'),
                halfDayInDaysCover: item.halfDayInDaysCover,
                halfDayOut: this.pipe.transform(item.halfDayOut, 'HH:mm:ss'),
                halfDayOutDaysCover: item.halfDayOutDaysCover,
                breakCount: item.breaks,
                firstBreakIn: this.pipe.transform(item.firstBreakIn, 'HH:mm:ss'),
                firstBreakInDaysCover: item.firstBreakInDaysCover,
                firstBreakOut: this.pipe.transform(item.firstBreakOut, 'HH:mm:ss'),
                firstBreakOutDaysCover: item.firstBreakOutDaysCover,
                secondBreakIn: this.pipe.transform(item.secondBreakIn, 'HH:mm:ss'),
                secondBreakInDaysCover: item.secondBreakInDaysCover,
                secondBreakOut: this.pipe.transform(item.secondBreakOut, 'HH:mm:ss'),
                secondBreakOutDaysCover: item.secondBreakOutDaysCover,
                thirdBreakIn: this.pipe.transform(item.thirdBreakIn, 'HH:mm:ss'),
                thirdBreakInDaysCover: item.thirdBreakInDaysCover,
                thirdBreakOut: this.pipe.transform(item.thirdBreakOut, 'HH:mm:ss'),
                thirdBreakOutDaysCover: item.thirdBreakOutDaysCover,
            })
        }
        if (this.shiftForm.value.weekCount > 1) {
            for (let item of this.weekTwoSource) {
                this.shiftDetail.push({
                    shiftCodeDetailId: item.shiftCodeDetailId,
                    isFlexi: this.shiftForm.value.isFlexi,
                    timeIn: this.pipe.transform(item.timeIn, 'HH:mm:ss'),
                    timeOut: this.pipe.transform(item.timeOut, 'HH:mm:ss'),
                    timeOutDaysCover: item.timeIn > item.timeOut ? 1 : 0,
                    totalWorkingHours: item.totalWorkingHours,
                    day: item.day,
                    weeks: 2,
                    isRestDay: item.isRestDay,
                    halfDayIn: this.pipe.transform(item.halfDayIn, 'HH:mm:ss'),
                    halfDayInDaysCover: item.halfDayInDaysCover,
                    halfDayOut: this.pipe.transform(item.halfDayOut, 'HH:mm:ss'),
                    halfDayOutDaysCover: item.halfDayOutDaysCover,
                    breakCount: item.breaks,
                    firstBreakIn: this.pipe.transform(item.firstBreakIn, 'HH:mm:ss'),
                    firstBreakInDaysCover: item.firstBreakInDaysCover,
                    firstBreakOut: this.pipe.transform(item.firstBreakOut, 'HH:mm:ss'),
                    firstBreakOutDaysCover: item.firstBreakOutDaysCover,
                    secondBreakIn: this.pipe.transform(item.secondBreakIn, 'HH:mm:ss'),
                    secondBreakInDaysCover: item.secondBreakInDaysCover,
                    secondBreakOut: this.pipe.transform(item.secondBreakOut, 'HH:mm:ss'),
                    secondBreakOutDaysCover: item.secondBreakOutDaysCover,
                    thirdBreakIn: this.pipe.transform(item.thirdBreakIn, 'HH:mm:ss'),
                    thirdBreakInDaysCover: item.thirdBreakInDaysCover,
                    thirdBreakOut: this.pipe.transform(item.thirdBreakOut, 'HH:mm:ss'),
                    thirdBreakOutDaysCover: item.thirdBreakOutDaysCover,
                })
            }
        }
        if (this.shiftForm.value.weekCount > 2) {
            for (let item of this.weekThreeSource) {
                this.shiftDetail.push({
                    shiftCodeDetailId: item.shiftCodeDetailId,
                    isFlexi: this.shiftForm.value.isFlexi,
                    timeIn: this.pipe.transform(item.timeIn, 'HH:mm:ss'),
                    timeOut: this.pipe.transform(item.timeOut, 'HH:mm:ss'),
                    timeOutDaysCover: item.timeIn > item.timeOut ? 1 : 0,
                    totalWorkingHours: item.totalWorkingHours,
                    day: item.day,
                    weeks: 3,
                    isRestDay: item.isRestDay,
                    halfDayIn: this.pipe.transform(item.halfDayIn, 'HH:mm:ss'),
                    halfDayInDaysCover: item.halfDayInDaysCover,
                    halfDayOut: this.pipe.transform(item.halfDayOut, 'HH:mm:ss'),
                    halfDayOutDaysCover: item.halfDayOutDaysCover,
                    breakCount: item.breaks,
                    firstBreakIn: this.pipe.transform(item.firstBreakIn, 'HH:mm:ss'),
                    firstBreakInDaysCover: item.firstBreakInDaysCover,
                    firstBreakOut: this.pipe.transform(item.firstBreakOut, 'HH:mm:ss'),
                    firstBreakOutDaysCover: item.firstBreakOutDaysCover,
                    secondBreakIn: this.pipe.transform(item.secondBreakIn, 'HH:mm:ss'),
                    secondBreakInDaysCover: item.secondBreakInDaysCover,
                    secondBreakOut: this.pipe.transform(item.secondBreakOut, 'HH:mm:ss'),
                    secondBreakOutDaysCover: item.secondBreakOutDaysCover,
                    thirdBreakIn: this.pipe.transform(item.thirdBreakIn, 'HH:mm:ss'),
                    thirdBreakInDaysCover: item.thirdBreakInDaysCover,
                    thirdBreakOut: this.pipe.transform(item.thirdBreakOut, 'HH:mm:ss'),
                    thirdBreakOutDaysCover: item.thirdBreakOutDaysCover,
                })
            }
        }
        if (this.shiftForm.value.weekCount > 3) {
            for (let item of this.weekFourSource) {
                this.shiftDetail.push({
                    shiftCodeDetailId: item.shiftCodeDetailId,
                    isFlexi: this.shiftForm.value.isFlexi,
                    timeIn: this.pipe.transform(item.timeIn, 'HH:mm:ss'),
                    timeOut: this.pipe.transform(item.timeOut, 'HH:mm:ss'),
                    timeOutDaysCover: item.timeIn > item.timeOut ? 1 : 0,
                    totalWorkingHours: item.totalWorkingHours,
                    day: item.day,
                    weeks: 4,
                    isRestDay: item.isRestDay,
                    halfDayIn: this.pipe.transform(item.halfDayIn, 'HH:mm:ss'),
                    halfDayInDaysCover: item.halfDayInDaysCover,
                    halfDayOut: this.pipe.transform(item.halfDayOut, 'HH:mm:ss'),
                    halfDayOutDaysCover: item.halfDayOutDaysCover,
                    breakCount: item.breaks,
                    firstBreakIn: this.pipe.transform(item.firstBreakIn, 'HH:mm:ss'),
                    firstBreakInDaysCover: item.firstBreakInDaysCover,
                    firstBreakOut: this.pipe.transform(item.firstBreakOut, 'HH:mm:ss'),
                    firstBreakOutDaysCover: item.firstBreakOutDaysCover,
                    secondBreakIn: this.pipe.transform(item.secondBreakIn, 'HH:mm:ss'),
                    secondBreakInDaysCover: item.secondBreakInDaysCover,
                    secondBreakOut: this.pipe.transform(item.secondBreakOut, 'HH:mm:ss'),
                    secondBreakOutDaysCover: item.secondBreakOutDaysCover,
                    thirdBreakIn: this.pipe.transform(item.thirdBreakIn, 'HH:mm:ss'),
                    thirdBreakInDaysCover: item.thirdBreakInDaysCover,
                    thirdBreakOut: this.pipe.transform(item.thirdBreakOut, 'HH:mm:ss'),
                    thirdBreakOutDaysCover: item.thirdBreakOutDaysCover,
                })
            }
        }
        this.shiftForm.controls.shiftCodeDetail.patchValue(this.shiftDetail);
    }

    submit(): void {
        this.handleDetailMapping()
        this.shiftForm.markAllAsTouched();
        if (this.shiftForm.valid) {
            const dialogRef = this.message.open(SaveMessage);

            dialogRef.afterClosed().subscribe((result) => {
                if (result == "confirmed") {
                    this.isSave = true

                    this.shiftService.postShift(this.shiftForm.value).subscribe({
                        next: (value: any) => {
                            if (value.statusCode == 200) {
                                this.message.open(SuccessMessage);
                                this.isSave = false,
                                    this.router.navigate(['/search/shift-codes']);
                            }
                            else {
                                this.message.open(FailedMessage);
                                console.log(value.stackTrace)
                                console.log(value.message)
                            }
                        },
                        error: (e) => {
                            this.isSave = false
                            this.message.open(FailedMessage);
                            console.error(e)
                        }
                    });
                }
            });
        }
    }

}
