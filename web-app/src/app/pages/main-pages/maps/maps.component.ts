import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapLocationComponent } from '../../../components/map-location/map-location.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { DeviceData } from '../../../models/device.model';
import { DeviceService } from '../../../services/locator/device.service';

@Component({
  selector: 'app-maps',
  imports: [MapLocationComponent, NavBarComponent, CommonModule],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.scss'
})
export class MapsComponent implements OnInit, OnDestroy {
  devices: DeviceData[] = [];
  private deviceSubscription: Subscription | undefined;
  
  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.deviceSubscription = this.deviceService.devices$.subscribe(devices => {
      this.devices = devices;
    });
    
    this.deviceService.fetchAllDevices().subscribe();
  }
  
  ngOnDestroy(): void {
    if (this.deviceSubscription) {
      this.deviceSubscription.unsubscribe();
    }
  }
  
  formatCoordinates(lat: number, lon: number): string {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
  }
}
