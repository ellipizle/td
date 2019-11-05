import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Observable, timer, NEVER, BehaviorSubject, Subject } from 'rxjs';
import { map, scan, tap, takeUntil, takeWhile, switchMap } from 'rxjs/operators';
import { Todo } from '../todo';
@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  private timer$ = new BehaviorSubject(false);
  private unsubscribe$: Subject<void> = new Subject<void>();
  running: boolean = false // running state;
  timeTotal: number = 1800 // 30min in seconds;
  timeRemaining: number = 0;
  interval = 1000 // 1 seconds
  _todo: Todo


  @Input()
  set todo(todo: Todo) {
    console.log(todo)
    this._todo = todo;
  }

  @Output() updateTimeSpent = new EventEmitter()

  constructor() { }
  ngOnInit() {
    this.initTimer()
  }

  initTimer() {
    this.timer$.pipe(
      switchMap((running: boolean) => (
        running ? timer(0, this.interval) : NEVER
      )),
      scan(acc => acc - 1, this._todo.timeRemaining ? this._todo.timeRemaining : this.timeTotal),
      tap(timeValue => this.computeTiming(timeValue)),
    ).subscribe(value => {
     console.log(value)
    })
  }

  toggle() {
    this.running = !this.running
    if (!this.running) {
      this.updateTimeSpent.emit(this._todo)
    }
    this.timer$.next(this.running)
  }

  computeTiming(timeValue) {
    this._todo.timeRemaining = timeValue
    this._todo.timeSpent = this.timeTotal - this._todo.timeRemaining;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }




}
