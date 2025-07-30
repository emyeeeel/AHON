import { Injectable } from '@angular/core';
import { VictimApiService } from './victim-api.service';

@Injectable({
  providedIn: 'root'
})
export class VictimResponseService {
  constructor(
    private victimApiService: VictimApiService
  ) { }


  async getVictimsByMission(missionId: number): Promise<any> {
    try {
      const response = await this.victimApiService.getVictimsByMission(missionId).toPromise();
      return response;
    } catch (error) {
      throw new Error('Failed to get victims by mission');
    }
  }
}
