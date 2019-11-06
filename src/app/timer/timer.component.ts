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
  interval = 1000 // 1 seconds
  _todo: Todo

  animateValue: any = "";


  @Input()
  set todo(todo: Todo) {
    console.log(todo)
    this._todo = todo;
    if (this._todo.timeSpent) {
      this.calculateLoaderTime()
    }
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
      takeWhile(timeRemaining => timeRemaining > 0),
      takeUntil(this.unsubscribe$)
    ).subscribe(value => {
      this.calculateLoaderTime()
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
    if (this._todo.timeSpent == this.timeTotal) {
      this.updateTimeSpent.emit(this._todo)
    }
  }

  calculateLoaderTime() {
    const PI = Math.PI;
    const fullPie = this.timeTotal;
    const halfPie = fullPie / 2;

    this._todo.timeSpent %= fullPie;
    const r = (this._todo.timeSpent * PI / halfPie);
    const x = Math.sin(r) * 125;
    const y = Math.cos(r) * - 125;
    const mid = (this._todo.timeSpent > halfPie) ? 1 : 0;
    const anim = 'M 0 0 v -125 A 125 125 1 ' + mid + ' 1 ' + x + ' ' + y + ' z';

    this.animateValue = anim;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }




}
