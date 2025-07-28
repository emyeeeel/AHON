import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThumbnailComponent } from '../../../components/thumbnail/thumbnail.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { DeviceData } from '../../../models/device.model';
import { Subscription } from 'rxjs';
import { DeviceService } from '../../../services/locator/device.service';
import { DeviceStreamService } from '../../../services/stream/device-stream.service';

@Component({
  selector: 'app-streams',
  standalone: true,
  imports: [ThumbnailComponent, CommonModule, NavBarComponent],
  templateUrl: './streams.component.html',
  styleUrl: './streams.component.scss'
})
export class StreamsComponent implements OnInit, OnDestroy {
  devices: DeviceData[] = [];
  selectedDevice: DeviceData | null = null;
  selectedStreamNumber: number = 0;

  

  private subscriptions: Subscription[] = [];

  constructor(
    private deviceService: DeviceService,
    private deviceStreamService: DeviceStreamService
  ) {}

  ngOnInit(): void {
    this.fetchAllDevices();

    this.subscriptions.push(
      this.deviceService.devices$.subscribe(devices => {
        this.devices = devices;

        if (devices.length > 0 && !this.selectedDevice) {
          this.selectDevice(devices[0], 1);
        }

        // Fetch and cache thumbnails
        devices.forEach(device => {
          this.deviceStreamService.fetchAndCacheThumbnail(device.id);
        });
      }),

      this.deviceStreamService.selectedDevice$.subscribe(device => {
        this.selectedDevice = device;
      }),

      this.deviceStreamService.selectedStreamNumber$.subscribe(number => {
        this.selectedStreamNumber = number;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  fetchAllDevices(): void {
    this.deviceService.fetchAllDevices().subscribe();
  }

  selectDevice(device: DeviceData, streamNumber: number): void {
    this.deviceStreamService.selectDevice(device, streamNumber);
  }

  getLiveStreamUrl(): string {
    return this.deviceStreamService.getStreamUrl();
  }

  formatCoordinates(lat: number, lon: number): string {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
  }
}
