import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { Subscription } from 'rxjs';

import { ApiUrlsStateService } from 'src/app/services/state/api-urls/api-urls-state.service';
import { MissionStateService } from 'src/app/services/state/mission/mission-state.service';


@Component({
  selector: 'app-mission-stream',
  templateUrl: './mission-stream.component.html',
  styleUrls: ['./mission-stream.component.scss'],
  imports: [IonIcon, IonButton],
  standalone: true
})
export class MissionStreamComponent implements OnInit, OnDestroy {
  // mission-state variables
  private missionSub!: Subscription;
  currentMission: any;

  // victim-state variables
  victimsCount: number = 0;

  // streaming variables
  isStreaming = false;
  streamUrl: any;
  currentImageUrl = 'assets/placeholder.jpg';

  constructor(
    private apiUrlsStateService: ApiUrlsStateService,
    private missionStateService: MissionStateService,
  ) {
    this.streamUrl = this.apiUrlsStateService.streamUrl;

    this.missionSub = this.missionStateService.currentMission$.subscribe(mission => {
      this.currentMission = mission;
    });
  }


  ngOnInit() {
    this.startStream();
  }

  ngOnDestroy() {
    this.stopStream();
    this.missionSub.unsubscribe();
  }

  startStream() {
    this.isStreaming = true;
    // Add timestamp to prevent caching
    this.currentImageUrl = `${this.streamUrl}?t=${Date.now()}`;
  }

  stopStream() {
    this.isStreaming = false;
    this.currentImageUrl = 'assets/placeholder.jpg';
  }

  onImageError() {
    if (this.isStreaming) {
      // Retry connection after 2 seconds
      setTimeout(() => {
        if (this.isStreaming) {
          this.currentImageUrl = `${this.streamUrl}?t=${Date.now()}`;
        }
      }, 2000);
    }
  }

  onImageLoad() {
    console.log('Stream connected successfully');
  }

}
