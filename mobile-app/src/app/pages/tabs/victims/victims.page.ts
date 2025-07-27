import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-victims',
  templateUrl: './victims.page.html',
  styleUrls: ['./victims.page.scss'],
  standalone: false,
})
export class VictimsPage implements OnInit {
  victims: any[] = [
    {
      id: 203,
      estimated_latitude: 10.2925,
      estimated_longitude: 123.8615,
      date_time_detected: "2025-07-27T14:30:00Z",
      person_recognition_confidence: 0.68,
    },
    {
      id: 204,
      estimated_latitude: 10.2925,
      estimated_longitude: 123.8615,
      date_time_detected: "2025-07-27T14:30:00Z",
      person_recognition_confidence: 0.68,
    },
  ]

  filteredVictims: any[] = [];

  constructor() { }

  ngOnInit() {
  }

  getStableVictims() {

  }

}
