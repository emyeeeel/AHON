import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DeviceData } from '../../models/device.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceStreamService {
  private readonly streamUrl = 'https://7pd4fg47-8000.asse.devtunnels.ms/api/stream/'; // change to backend API stream
  private readonly imageUrl = 'https://7pd4fg47-8000.asse.devtunnels.ms/api/image/';  // for thumbnail

  private thumbnailCache: { [deviceId: number]: SafeUrl } = {};

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  /** Returns live stream URL */
  getStreamUrl(): string {
    return this.streamUrl;
  }

  /** Caches thumbnail fetched from backend image endpoint */
  fetchAndCacheThumbnail(deviceId: number): void {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = this.imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.warn('[THUMBNAIL] Canvas context not available');
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(blob => {
        if (blob) {
          const objectURL = URL.createObjectURL(blob);
          const safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.thumbnailCache[deviceId] = safeUrl;
          console.log(`[THUMBNAIL] Cached thumbnail for Device #${deviceId}`);
        } else {
          console.warn('[THUMBNAIL] Failed to convert canvas to blob');
        }
      }, 'image/jpeg');
    };

    img.onerror = (e) => {
      console.error('[THUMBNAIL] Error loading thumbnail image:', e);
    };
  }

  /** Returns cached thumbnail or fallback placeholder */
  getThumbnail(deviceId: number): SafeUrl {
    return this.thumbnailCache[deviceId] || this.sanitizer.bypassSecurityTrustUrl('assets/images/placeholder.png');
  }

  private selectedDeviceSubject = new BehaviorSubject<DeviceData | null>(null);
  selectedDevice$ = this.selectedDeviceSubject.asObservable();

  private selectedStreamNumberSubject = new BehaviorSubject<number>(0);
  selectedStreamNumber$ = this.selectedStreamNumberSubject.asObservable();

  selectDevice(device: DeviceData, streamNumber: number): void {
    this.selectedDeviceSubject.next(device);
    this.selectedStreamNumberSubject.next(streamNumber);
  }

  getSelectedDevice(): DeviceData | null {
    return this.selectedDeviceSubject.getValue();
  }

  selectFirstDevice(devices: DeviceData[]): void {
    if (devices.length > 0) {
      this.selectDevice(devices[0], 1);
    }
  }
}
