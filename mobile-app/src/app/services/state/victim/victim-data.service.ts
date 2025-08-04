import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VictimDataService {
  // Holds the raw data for all detected persons in the last frame
  private detectionsSubject = new BehaviorSubject<any[]>([]);
  detections$ = this.detectionsSubject.asObservable();

  // Holds the raw, un-annotated image of the last frame
  private snapshotImageSubject = new BehaviorSubject<string | null>(null);
  snapshotImage$ = this.snapshotImageSubject.asObservable();

  constructor() { }

  // Method for other services to call to update the latest data
  updateLatestDetections(snapshot: string, detections: any[]) {
    this.snapshotImageSubject.next(snapshot);
    this.detectionsSubject.next(detections);
  }
}