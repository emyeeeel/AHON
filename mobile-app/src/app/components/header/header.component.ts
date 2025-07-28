import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';

import { MissionTimerService } from 'src/app/services/components/mission-timer/mission-timer.service';
import { MissionApiService } from 'src/app/services/api/mission/mission-api.service';
import { MissionResponseService } from 'src/app/services/api/mission/mission-response.service';
import { MissionStateService } from 'src/app/services/state/mission/mission-state.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, IonicModule],
  standalone: true
})

export class HeaderComponent implements OnInit, OnDestroy {
  // mission-timer variables
  formattedTime = '00:00';
  missionStarted = false;

  // mission-state variables
  private missionSub!: Subscription;
  currentMission: any;
  currentMissionData: any;

  private victimPollingSub!: Subscription;

  constructor(
    private missionTimerService: MissionTimerService,
    private missionApiService: MissionApiService,
    private missionResponseService: MissionResponseService,
    private missionStateService: MissionStateService,

  ) { }


  ngOnInit() {
    this.missionTimerService.missionStarted$.subscribe(started => {
      this.missionStarted = started;
    });

    this.missionTimerService.formattedTime$.subscribe(time => {
      this.formattedTime = time;
    });

    this.missionSub = this.missionStateService.currentMission$.subscribe(mission => {
      this.currentMission = mission;
    });
  }

  ngOnDestroy() {
    this.missionSub.unsubscribe();
  }

  async startMission() {
    this.missionTimerService.startMission();
    this.missionStateService.toggleMissionStartEnd(true);
    await this.createMission();
  }

  async endMission() {
    this.missionTimerService.stopMission();
    this.missionStateService.toggleMissionStartEnd(false);
    await this.updateMission();
  }


  // async createMission() {
  //   const mission = {
  //     date_time_started: new Date().toISOString(), // Current time in ISO format
  //   }

  //   this.currentMissionData = await this.missionResponseService.createMission(mission);

  //   // Set the current mission & isMissionOngoing = true in the Mission state service
  //   this.missionStateService.setMission(this.currentMissionData);
  //   this.missionStateService.toggleMissionStartEnd(true);
  // }

  createMission() {

    let mission = {
      date_time_started: new Date().toISOString(), // Current time in ISO format
    }
    this.missionApiService.createMission(mission).subscribe(
      data => {
        this.currentMissionData = data;

        // Set the current mission in the Mission state service
        this.missionStateService.setMission(this.currentMissionData);
        this.missionStateService.toggleMissionStartEnd(true);
      },
      error => { console.log('Error: ', error); }
    );
  }

  async updateMission() {
    let mission = {
      id: this.currentMissionData.id,
      date_time_ended: new Date().toISOString(), // Current time in ISO format
    }

    await this.missionResponseService.updateMission(mission);
    this.missionStateService.toggleMissionStartEnd(false); // Set isMissionOngoing = false
  }

}
