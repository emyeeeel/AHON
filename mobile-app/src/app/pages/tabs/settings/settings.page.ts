import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {
  selectedMode: string = 'thermal';
  selectedViewAngle: 'front' | 'angled' | 'top' = 'front';
  confidenceThreshold: number = 50;

  constructor() { }

  ngOnInit() {
  }

  selectMode(mode: string) {
    this.selectedMode = mode;
  }

  async selectViewAngle(angle: 'front' | 'angled' | 'top') {
    this.selectedViewAngle = angle;
  }

  getModelDescription(angle: 'front' | 'angled' | 'top'): string {
    const descriptions = {
      'front': 'Front/Side detection model loaded',
      'angled': 'Angled view detection model loaded',
      'top': 'Top view detection model loaded'
    };
    return descriptions[angle];
  }


  onConfidenceChange(event: any) {
    this.confidenceThreshold = event.detail.value;
  }

  onLogout() {
    // Logic for logging out the user
    console.log('User logged out');
  }
}
