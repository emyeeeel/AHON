import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlsService {
  baseUrl: any = 'http://172.29.5.209:8000/api';

  // Stream API Url
  streamUrl: string = `${this.baseUrl}/stream/`;

  // Mission Api Url
  missionUrl: string = `${this.baseUrl}/mission-api`;

  constructor() { }
}
