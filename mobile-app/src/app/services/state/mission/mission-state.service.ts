import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MissionStateService {
  // Current Mission Subject State
  private missionSubject = new BehaviorSubject<any | null>(null);
  public currentMission$ = this.missionSubject.asObservable();

  // Mission Ongoing (Started/Ended) Subject State
  private isMissionOngoingSubject = new BehaviorSubject<boolean>(false);
  public isMissionOngoing$ = this.isMissionOngoingSubject.asObservable();

  constructor() { }

  // Method to set/update the Current Mission
  setMission(mission: any) {
    this.missionSubject.next(mission);
  }

  toggleMissionStartEnd(isOngoing: boolean) {
    this.isMissionOngoingSubject.next(isOngoing);
  }
}
