
import { takeUntil, distinctUntilChanged, map } from 'rxjs/operators';
import { Component, OnInit, Input, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;
import { FormControl } from '@angular/forms';


import { Subject } from 'rxjs';

@Component({
  selector: 'app-period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: ['./period-selector.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class PeriodSelectorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() minDate: number;
  @Output() minDateChange = new EventEmitter<number>();

  @Input() maxDate: number;
  @Output() maxDateChange = new EventEmitter<number>();

  @Input() minBound: number;
  firstBound: Moment;
  @Input() maxBound: number;
  lastBound: Moment;

  first = new FormControl(moment(), { updateOn: 'blur' });
  last = new FormControl(moment(), { updateOn: 'blur' });

  private unsubscribe: Subject<void> = new Subject();

  constructor() {
  }

  ngOnInit() {
    this.first.valueChanges.pipe(takeUntil(this.unsubscribe), distinctUntilChanged(),
      map(value => {
        if (!value) {
          return this.firstBound;
        }
        const val = value as Moment;
        return (val.isBefore(this.firstBound) || val.isAfter(this.last.value)) ? this.firstBound : value;
      })
    )
      .subscribe(value => this.minDateChange.emit(value.valueOf()));

    this.last.valueChanges.pipe(takeUntil(this.unsubscribe), distinctUntilChanged(),
      map(value => {
        if (!value) {
          return this.lastBound;
        }
        const val = value as Moment;
        return (val.isBefore(this.first.value) || val.isAfter(this.lastBound)) ? this.lastBound : value;
      })
    )
      .subscribe(value => this.maxDateChange.emit(value.valueOf()));
  }

  ngOnChanges() {
    this.initAll();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initBounds() {
    this.firstBound = moment(this.minBound);
    this.lastBound = moment(this.maxBound);
  }

  initAll() {
    this.initBounds();
    this.first.reset(moment(this.minDate));
    this.last.reset(moment(this.maxDate));
  }
}
