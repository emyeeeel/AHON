import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiUrlsService } from '../api-urls/api-urls.service';
@Injectable({
  providedIn: 'root'
})
export class MissionApiService {
  baseUrl: any;
  httpHeaders = { 'Content-Type': 'application/json' };

  constructor(
    private apiUrlsService: ApiUrlsService,
    private http: HttpClient
  ) {
    this.baseUrl = this.apiUrlsService.missionUrl;
  }

  createMission(mission: any): Observable<any> {
    const body = { date_time_started: mission.date_time_started };
    return this.http.post(`${this.baseUrl}/missions/`, body, { headers: this.httpHeaders });
  }

  // Updates the mission object with the end time (date_time_ended)
  updateMission(mission: any): Observable<any> {
    const body = { date_time_ended: mission.date_time_ended };
    return this.http.put(`${this.baseUrl}/mission/${mission.id}/`, body, { headers: this.httpHeaders });
  }

  getAllMissions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/missions/`, { headers: this.httpHeaders });
  }

  getMissionById(missionId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/mission/${missionId}/`, { headers: this.httpHeaders });
  }
}
