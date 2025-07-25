import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { DeviceData, DeviceApiResponse } from '../../models/device.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'http://localhost:8000/api/devices/';

  // ✅ Add this line to fix the error
  private deviceSubject = new BehaviorSubject<DeviceData[]>([]);

  public devices$ = this.deviceSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchAllDevices(): Observable<DeviceApiResponse> {
    return this.http.get<DeviceApiResponse>(this.apiUrl).pipe(
      tap(response => {
        this.deviceSubject.next(response.devices);
      })
    );
  }

  getCurrentDevices(): DeviceData[] {
    return this.deviceSubject.getValue();
  }

  toggleDeviceStatus(id: number, isActive: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}${id}/`, { is_active: isActive });
  }
}
