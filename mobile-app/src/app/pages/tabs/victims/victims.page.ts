import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { VictimDataService } from 'src/app/services/state/victim/victim-data.service';

@Component({
  selector: 'app-victims',
  templateUrl: './victims.page.html',
  styleUrls: ['./victims.page.scss'],
  standalone: false
})
export class VictimsPage implements OnInit, OnDestroy {
  public snapshotImage: string | null = null;
  public detectedVictims: any[] = [];

  private snapshotSub!: Subscription;
  private detectionsSub!: Subscription;

  constructor(private victimDataService: VictimDataService) { }

  ngOnInit() {
    // Subscribe to the latest snapshot image
    this.snapshotSub = this.victimDataService.snapshotImage$.subscribe(src => {
      this.snapshotImage = src;
    });

    // Subscribe to the latest list of detected victims
    this.detectionsSub = this.victimDataService.detections$.subscribe(victims => {
      this.detectedVictims = victims;
    });
  }

  ngOnDestroy() {
    if (this.snapshotSub) this.snapshotSub.unsubscribe();
    if (this.detectionsSub) this.detectionsSub.unsubscribe();
  }

  // Helper function to format confidence as a percentage
  formatConfidence(confidence: number): string {
    return `${Math.round(confidence * 100)}%`;
  }
}