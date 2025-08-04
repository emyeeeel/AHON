import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiUrlsService } from '../../api/api-urls/api-urls.service';
import { VictimDataService } from '../victim/victim-data.service';

@Injectable({
  providedIn: 'root'
})
export class DetectionDataService {
  private personCountSubject = new BehaviorSubject<number>(0);
  personCount$ = this.personCountSubject.asObservable();
  private eventSource!: EventSource;

  constructor(private apiUrls: ApiUrlsService, private zone: NgZone, private victimDataService: VictimDataService) {}

  startListening() {
    this.eventSource = new EventSource(this.apiUrls.detectionDataUrl);
    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const snapshot = 'data:image/jpeg;base64,' + data.snapshot;
      this.zone.run(() => {
        this.personCountSubject.next(data.personCount);

        this.victimDataService.updateLatestDetections(snapshot, data.detections);
      });
    };
    this.eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      this.eventSource.close();
    };
  }

  stopListening() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}