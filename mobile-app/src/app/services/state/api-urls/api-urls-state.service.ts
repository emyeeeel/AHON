import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlsStateService {
  baseUrl: any = 'http://172.29.1.175:8000/api';

  // Current Stream Url Subject State
  private streamUrlSubject = new BehaviorSubject<any | null>(`${this.baseUrl}/stream/`);
  public currentStreamUrl$ = this.streamUrlSubject.asObservable();

  // Stream API Url
  streamUrl: string = `${this.baseUrl}/stream/`;

  // Mission Api Url
  missionUrl: string = 'http://172.29.1.175:8000/mission-api';

  constructor() { }
}
