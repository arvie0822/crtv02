import { Component, EventEmitter, Output } from "@angular/core";
import { DateRange, DefaultMatCalendarRangeStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY} from "@angular/material/datepicker";

@Component({
  selector: 'date-range-picker',
  templateUrl: './date-range-picker.component.html',
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy,
    },
  ],
})
export class DateRangePickerComponent {

  @Output() filter = new EventEmitter<any>();

  constructor() { }

  selectedDateRange: DateRange<Date>;

  _onSelectedChange(date: Date): void {
    if (
      this.selectedDateRange &&
      this.selectedDateRange.start &&
      date > this.selectedDateRange.start &&
      !this.selectedDateRange.end
    ) {
      this.selectedDateRange = new DateRange(
        this.selectedDateRange.start,
        date
      );
    } else {
      this.selectedDateRange = new DateRange(date, null);
    }

    this.filter.emit(this.selectedDateRange)
  }
}
