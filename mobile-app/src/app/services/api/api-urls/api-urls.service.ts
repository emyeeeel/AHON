import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlsService {
  private readonly BASE_URL = 'http://172.29.14.61:8000'; 
  public readonly videoFeedUrl = `${this.BASE_URL}/api/video_feed/`;
  public readonly detectionDataUrl = `${this.BASE_URL}/api/detection_data/`;
  public readonly missionUrl = `${this.BASE_URL}/mission-api`;
  constructor() { }

}
