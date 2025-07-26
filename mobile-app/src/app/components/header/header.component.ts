import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';

import { MissionTimerService } from 'src/app/services/components/mission-timer/mission-timer.service';
import { MissionApiService } from 'src/app/services/api/mission/mission-api.service';
import { MissionStateService } from 'src/app/services/state/mission/mission-state.service';
import { VictimApiService } from 'src/app/services/api/victim/victim-api.service';
import { VictimStateService } from 'src/app/services/state/victim/victim-state.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class HeaderComponent implements OnInit {
  // mission-timer variables
  formattedTime = '00:00';
  missionStarted = false;

  // mission-state variables
  currentMission: any;
  currentMissionData: any;

  private victimPollingSub!: Subscription;

  constructor(
    private missionTimerService: MissionTimerService,
    private missionApiService: MissionApiService,
    private missionStateService: MissionStateService,

  ) { }

  ngOnInit() {
    this.missionTimerService.missionStarted$.subscribe(started => {
      this.missionStarted = started;
    });

    this.missionTimerService.formattedTime$.subscribe(time => {
      this.formattedTime = time;
    });

    this.missionStateService.currentMission$.subscribe(mission => {
      this.currentMission = mission;
    });
  }

  async startMission() {
    this.missionTimerService.startMission();
    this.createMission();
  }

  endMission() {
    this.missionTimerService.stopMission();
    this.updateMission();
  }


  createMission() {
    const mission = {
      date_time_started: new Date().toISOString(), // Current time in ISO format
    }

    this.currentMissionData = this.missionApiService.createMission(mission);

    // Set the current mission & isMissionOngoing = true in the Mission state service
    this.missionStateService.setMission(this.currentMissionData);
    this.missionStateService.toggleMissionStartEnd(true);
  }

  updateMission() {
    let mission = {
      id: this.currentMissionData.id,
      date_time_ended: new Date().toISOString(), // Current time in ISO format
    }

    this.missionApiService.updateMission(mission);
    this.missionStateService.toggleMissionStartEnd(false); // Set isMissionOngoing = false
  }

}
