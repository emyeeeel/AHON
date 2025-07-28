import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false,
})
export class HistoryPage implements OnInit {
  // Overall Filter variables
  showFilters: boolean = false;

  // Date Filter variables
  selectedDateRange: string = 'all';
  selectedStatus: string = 'all';

  // Missions data variables
  expandedMission: string | null = null;
  filteredMissions: any[] = [];
  missions: any[] = [
    {
      id: 'MSN001',
      date: new Date('2024-01-15T10:30:00'),
      duration: '2h 15m',
      status: 'Completed',
      victimsFound: 3,
      totalDetections: 8,
      avgConfidence: 87,
      confidenceThreshold: 70,
      model: 'front',
      tempRange: '35.2°C - 37.8°C',
      victims: [
        {
          id: 'V001',
          status: 'Stable',
          bodyTemp: 36.5,
          confidence: 92,
          coordinates: '40.7128°N, 74.0060°W',
          detectionTime: new Date('2024-01-15T10:45:00')
        },
        {
          id: 'V002',
          status: 'Critical',
          bodyTemp: 35.2,
          confidence: 85,
          coordinates: '40.7130°N, 74.0058°W',
          detectionTime: new Date('2024-01-15T11:20:00')
        }
      ]
    },
    {
      id: 'MSN002',
      date: new Date('2024-01-14T14:15:00'),
      duration: '1h 45m',
      status: 'Completed',
      victimsFound: 1,
      totalDetections: 3,
      avgConfidence: 78,
      confidenceThreshold: 75,
      model: 'angled',
      tempRange: '36.8°C',
      victims: [
        {
          id: 'V003',
          status: 'Stable',
          bodyTemp: 36.8,
          confidence: 89,
          detectionTime: new Date('2024-01-14T14:45:00')
        }
      ]
    },
    {
      id: 'MSN003',
      date: new Date('2024-01-13T09:00:00'),
      duration: '3h 30m',
      status: 'Ongoing',
      victimsFound: 0,
      totalDetections: 12,
      avgConfidence: 65,
      confidenceThreshold: 80,
      model: 'top',
      tempRange: 'N/A',
      victims: []
    }
  ];

  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.filteredMissions = [...this.missions];
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  toggleMissionExpansion(missionId: string) {
    this.expandedMission = this.expandedMission === missionId ? null : missionId;
  }

  clearFilters() {
    this.selectedDateRange = 'all';
    this.selectedStatus = 'all';
    this.filteredMissions = [...this.missions];
    this.showFilters = false;
  }

  onDateRangeChange() {
    this.applyFilters();
  }

  onStatusChange() {
    this.applyFilters();
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'Completed': return 'checkmark-circle-outline';
      case 'aborted': return 'close-circle-outline';
      case 'Ongoing': return 'time-outline';
      default: return 'help-circle-outline';
    }
  }


  applyFilters() {
    let filtered = [...this.missions];

    // Date range filter
    if (this.selectedDateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (this.selectedDateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter((mission: any) => mission.date >= filterDate);
    }

    // Status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter((mission: any) =>
        mission.status.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }

    this.filteredMissions = filtered;
  }


  async viewVictimDetails(victim: any, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: `Victim #${victim.id}`,
      message: `
        <strong>Status:</strong> ${victim.status}<br>
        <strong>Body Temperature:</strong> ${victim.bodyTemp}°C<br>
        <strong>Detection Confidence:</strong> ${victim.confidence}%<br>
        <strong>Detection Time:</strong> ${victim.detectionTime.toLocaleString()}<br>
        ${victim.coordinates ? `<strong>Coordinates:</strong> ${victim.coordinates}` : ''}
      `,
      buttons: ['Close']
    });
    await alert.present();
  }


  async exportMission(mission: any, event: Event) {
    event.stopPropagation();

    // In real implementation, this would generate and download a report
    const toast = await this.toastController.create({
      message: `Mission ${mission.id} report exported successfully`,
      duration: 2000,
      position: 'top',
      color: 'success'
    });

    await toast.present();
    // TODO: Implement actual export functionality
    console.log('Exporting mission:', mission);
  }


  async deleteMission(missionId: string, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Delete Mission',
      message: 'Are you sure you want to delete this mission? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.showDeletedToast();
          }
        }
      ]
    });
    await alert.present();
  }


  async showDeletedToast() {
    const toast = await this.toastController.create({
      message: 'Mission deleted successfully',
      duration: 2000,
      position: 'top',
      color: 'success'
    });

    await toast.present();
  }


  trackMissionById(index: number, mission: any): string {
    return mission.id;
  }

}
