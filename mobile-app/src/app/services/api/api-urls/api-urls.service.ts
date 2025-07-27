import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlsService {
  baseUrl: any = 'http://192.168.1.3:8000/api';

  // Stream API Url
  streamUrl: string = `${this.baseUrl}/stream/`;

  // Mission Api Url
  missionUrl: string = `${this.baseUrl}/mission-api`;

  constructor() { }
}
