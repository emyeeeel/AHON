import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MissionTimerService {
  private timerSub?: Subscription;
  private elapsedSeconds = 0;

  private missionStartedSubject = new BehaviorSubject<boolean>(false);
  private timeSubject = new BehaviorSubject<string>('00:00');

  missionStarted$ = this.missionStartedSubject.asObservable();
  formattedTime$ = this.timeSubject.asObservable();

  startMission() {
    this.missionStartedSubject.next(true);
    this.timerSub = interval(1000).subscribe(() => {
      this.elapsedSeconds++;
      this.updateFormattedTime();
    });
  }

  stopMission() {
    this.missionStartedSubject.next(false);
    this.timerSub?.unsubscribe();
    this.timerSub = undefined;

    this.elapsedSeconds = 0;
    this.timeSubject.next('00:00');
  }

  private updateFormattedTime() {
    const h = Math.floor(this.elapsedSeconds / 3600);
    const m = Math.floor((this.elapsedSeconds % 3600) / 60);
    const s = this.elapsedSeconds % 60;

    const format = h > 0
      ? `${this.pad(h)}:${this.pad(m)}:${this.pad(s)}`
      : `${this.pad(m)}:${this.pad(s)}`;

    this.timeSubject.next(format);
  }

  private pad(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }

  constructor() { }
}
