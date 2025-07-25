import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: false
})
export class TabsPage implements OnInit {
  selectedTab = signal<string>('stream');

  constructor() { }

  ngOnInit() {
  }

  getSelected(event: any) {
    this.selectedTab.set(event?.tab);
  }

}
