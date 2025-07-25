import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { DeviceService } from '../../services/locator/device.service';
import { DeviceData } from '../../models/device.model';

@Component({
  selector: 'app-map-location',
  imports: [CommonModule],
  templateUrl: './map-location.component.html',
  styleUrl: './map-location.component.scss'
})
export class MapLocationComponent implements OnInit, OnDestroy  {
  private map: L.Map | undefined;
  private deviceMarkers: Map<number, L.Marker> = new Map();
  private cameraCircles: Map<number, L.Circle> = new Map();
  private refreshInterval: Subscription | undefined;
  
  public loadingStatus = 'Loading devices...';
  public loadingError = '';
  public devices: DeviceData[] = [];

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    // Initialize Leaflet CSS
    this.initLeafletCSS();
    
    // Initialize map
    this.initializeMap();
    
    // Subscribe to drone updates from service
    this.deviceService.devices$.subscribe(devices => {
      this.devices = devices;
      this.updateMap();
      this.loadingStatus = `Found ${devices.length} devices`;
    });
    
    // Initial load
    this.fetchAllDevices();
    
    // Set up refresh interval
    this.refreshInterval = interval(10000).subscribe(() => {
      this.fetchAllDevices();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      this.refreshInterval.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
    }
  }

  private initLeafletCSS(): void {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }

  private initializeMap(): void {
    // Initialize map with default location
    this.map = L.map('map', {
      center: [14.5995, 120.9842], 
      zoom: 15,
      zoomControl: true
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
      
    // Force map to recalculate size
    this.map.invalidateSize();
  }

  public fetchAllDevices(): void {
    this.loadingStatus = 'Loading devices...';
    
    this.deviceService.fetchAllDevices().subscribe({
      error: (error) => {
        console.error('Error fetching devices:', error);
        this.loadingError = 'Failed to fetch device data from server.';
        this.loadingStatus = 'Error';
      }
    });
  }

  private updateMap(): void {
    if (!this.map) return;

    const bounds = new L.LatLngBounds([]);
    
    const currentDeviceIds = new Set<number>();
    
    this.devices.forEach(device => {
      const position = [device.location.lat, device.location.lon] as [number, number];
      currentDeviceIds.add(device.id);
      

      if (this.deviceMarkers.has(device.id)) {

        this.deviceMarkers.get(device.id)!.setLatLng(position);
      } else {

        const deviceIcon = L.divIcon({
          className: 'device-icon',
          html: device.is_active ? '📍' : '📌', 
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker(position, { icon: deviceIcon })
          .addTo(this.map!) 
          .bindTooltip(`Device #${device.id} - ${device.is_active ? 'Active' : 'Inactive'}`, 
                       { permanent: false });
                       
        this.deviceMarkers.set(device.id, marker);
      }
      
      if (this.cameraCircles.has(device.id)) {
        const circle = this.cameraCircles.get(device.id)!;
        circle.setLatLng(position);
        circle.setRadius(device.camera_radius.display_radius);
        circle.setStyle({
          color: device.is_active ? 'blue' : 'gray',
          fillColor: device.is_active ? 'blue' : 'gray'
        });
      } else {
        const circle = L.circle(position, {
          radius: device.camera_radius.display_radius,
          color: device.is_active ? 'blue' : 'gray',
          fillColor: device.is_active ? 'blue' : 'gray',
          fillOpacity: 0.3,
          weight: 2
        }).addTo(this.map!); 
        
        circle.bindTooltip(`📷 Camera FOV: ${device.camera_radius.actual_radius} m`, 
                          { permanent: false });
                          
        this.cameraCircles.set(device.id, circle);
      }
    });
    
    Array.from(this.deviceMarkers.keys()).forEach(id => {
      if (!currentDeviceIds.has(id)) {
        this.deviceMarkers.get(id)!.remove();
        this.deviceMarkers.delete(id);
      }
    });
    
    Array.from(this.cameraCircles.keys()).forEach(id => {
      if (!currentDeviceIds.has(id)) {
        this.cameraCircles.get(id)!.remove();
        this.cameraCircles.delete(id);
      }
    });
    
    if (this.devices.length > 0) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  public refreshDevices(): void {
    this.fetchAllDevices();
  }

  formatConfidence(confidence: number): string {
    return (confidence * 100).toFixed(2) + '%';
  }
}
