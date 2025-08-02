import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MissionStateService } from 'src/app/services/state/mission/mission-state.service';
import { ApiUrlsService } from '../../../services/api/api-urls/api-urls.service';
import { DetectionDataService } from 'src/app/services/state/detection/detection-data.service';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.page.html',
  styleUrls: ['./stream.page.scss'],
  standalone: false,
})
export class StreamPage implements OnInit, OnDestroy {
  isMissionOngoingSubscription!: Subscription;
  isMissionOngoing: boolean = false;
  
  public videoFeedUrl: string;

  constructor(
    private missionStateService: MissionStateService,
    private apiUrls: ApiUrlsService,
    private detectionDataService: DetectionDataService
  ) {
    this.videoFeedUrl = this.apiUrls.videoFeedUrl;
  }

  ngOnInit() {
    this.isMissionOngoingSubscription = this.missionStateService.isMissionOngoing$.subscribe(isOngoing => {
      this.isMissionOngoing = isOngoing;
      if (isOngoing) {
        this.detectionDataService.startListening();
      } else {
        this.detectionDataService.stopListening();
      }
    });
  }

  ngOnDestroy() {
    this.isMissionOngoingSubscription.unsubscribe();
    this.detectionDataService.stopListening();
  }
}






