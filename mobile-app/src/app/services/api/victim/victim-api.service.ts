import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VictimApiService {
  baseUrl = 'http://172.29.14.173:8000/api';
  httpHeaders = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) { }

  createVictim(victim: any) {
    return this.http.post(`${this.baseUrl}/victims/`, victim, { headers: this.httpHeaders });
  }

  updateVictimsByMission(victims: any[]) {
    return this.http.put(`${this.baseUrl}/mission/${victims[0].mission_id}/victims/`, victims, { headers: this.httpHeaders });
  }

  getVictimsByMission(missionId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/mission/${missionId}/victims/`, { headers: this.httpHeaders });
  }
}
