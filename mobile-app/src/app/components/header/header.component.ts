import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MissionStateService } from 'src/app/services/state/mission/mission-state.service';
import { DetectionDataService } from 'src/app/services/state/detection/detection-data.service';
 import { MissionTimerService } from 'src/app/services/components/mission-timer/mission-timer.service';
// Note: MissionApiService and MissionResponseService are not yet needed in this simplified version (we are still on streaming page functionality)
// import { MissionApiService } from 'src/app/services/api/mission/mission-api.service';
// import { MissionResponseService } from 'src/app/services/api/mission/mission-response.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, IonicModule],
  standalone: true
})
export class HeaderComponent implements OnInit, OnDestroy {
  formattedTime = '00:00'; 
  missionStarted = false;
  personCount: number = 0;

  private personCountSub!: Subscription;
  private missionStartedSub!: Subscription;
  private timerSub!: Subscription;

  constructor(
    private missionStateService: MissionStateService,
    private detectionDataService: DetectionDataService,
    private missionTimerService: MissionTimerService
  ) { }

  ngOnInit() {
    this.missionStartedSub = this.missionStateService.isMissionOngoing$.subscribe(started => {
      this.missionStarted = started;
    });

    this.timerSub = this.missionTimerService.formattedTime$.subscribe(time => {
      this.formattedTime = time;
    });

    this.personCountSub = this.detectionDataService.personCount$.subscribe(count => {
      this.personCount = count;
    });
  }

  ngOnDestroy() {
    if (this.personCountSub) {
      this.personCountSub.unsubscribe();
    }
    if (this.missionStartedSub) {
      this.missionStartedSub.unsubscribe();
    }

    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }

  startMission() {
    this.missionTimerService.startMission();
    // This now simply tells the app the mission has started
    this.missionStateService.toggleMissionStartEnd(true);
  }

  endMission() {
    this.missionTimerService.stopMission();
    // This now simply tells the app the mission has ended
    this.missionStateService.toggleMissionStartEnd(false);
  }
}