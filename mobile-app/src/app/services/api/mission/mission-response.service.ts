import { Injectable } from '@angular/core';
import { MissionApiService } from './mission-api.service';

@Injectable({
  providedIn: 'root'
})
export class MissionResponseService {
  constructor(private missionApiService: MissionApiService) { }

  async createMission(mission: any): Promise<any> {
    try {
      const response = await this.missionApiService.createMission(mission).toPromise();
      return response;
    } catch (error) {
      throw new Error('Failed to update detection model');
    }
  }

  async updateMission(mission: any): Promise<any> {
    try {
      const response = await this.missionApiService.updateMission(mission).toPromise();
      return response;
    } catch (error) {
      throw new Error('Failed to update detection model');
    }
  }

  async getAllMissions(): Promise<any> {
    try {
      const response = await this.missionApiService.getAllMissions().toPromise();
      return response;
    } catch (error) {
      throw new Error('Failed to update detection model');
    }
  }


  async getMissionById(missionId: number): Promise<any> {
    try {
      const response = await this.missionApiService.getMissionById(missionId).toPromise();
      return response;
    } catch (error) {
      throw new Error('Failed to update detection model');
    }
  }
}
