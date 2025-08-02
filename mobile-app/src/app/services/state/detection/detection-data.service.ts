import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiUrlsService } from '../../api/api-urls/api-urls.service';

@Injectable({
  providedIn: 'root'
})
export class DetectionDataService {
  private personCountSubject = new BehaviorSubject<number>(0);
  personCount$ = this.personCountSubject.asObservable();
  private eventSource!: EventSource;

  constructor(private apiUrls: ApiUrlsService, private zone: NgZone) {}

  startListening() {
    this.eventSource = new EventSource(this.apiUrls.detectionDataUrl);
    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.zone.run(() => {
        this.personCountSubject.next(data.personCount);
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