import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MissionStateService } from 'src/app/services/state/mission/mission-state.service';
@Component({
  selector: 'app-stream',
  templateUrl: './stream.page.html',
  styleUrls: ['./stream.page.scss'],
  standalone: false,
})
export class StreamPage implements OnInit {
  // mission-state variables
  isMissionOngoingSubscription!: Subscription;
  isMissionOngoing: boolean = false;
  missionSub!: Subscription;
  currentMission: any;

  // input selection variables
  currentInputType: 'image' | 'video' | 'stream' = 'stream';

  // stream variables
  isStreamActive = false;

  constructor(
    private missionStateService: MissionStateService
  ) { }

  ngOnInit() {
    // Subscribe to mission status changes
    this.isMissionOngoingSubscription = this.missionStateService.isMissionOngoing$.subscribe(isOngoing => {
      this.isMissionOngoing = isOngoing;
    });

    // Subscribe to mission changes
    this.missionSub = this.missionStateService.currentMission$.subscribe(mission => {
      this.currentMission = mission;
    });

    this.isMissionOngoing = true;
  }

  onInputTypeChange(event: any) {
    this.currentInputType = event.detail.value;
  }

}
