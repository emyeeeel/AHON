import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-victim-filter',
  templateUrl: './victim-filter.component.html',
  styleUrls: ['./victim-filter.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
})
export class VictimFilterComponent implements OnInit {
  @Input() allVictimsCount: number = 0;
  @Input() stableCount: number = 0;
  @Input() criticalCount: number = 0;
  @Input() initialFilter: string = 'all';
  @Input() isCollapsedInitially: boolean = true;

  @Output() filterChanged = new EventEmitter<string>();
  @Output() collapseChanged = new EventEmitter<boolean>();

  selectedFilter: string = 'all';
  isCollapsed: boolean = false;

  constructor() { }

  ngOnInit() {
    this.selectedFilter = this.initialFilter;
    this.isCollapsed = this.isCollapsedInitially;
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.collapseChanged.emit(this.isCollapsed);
  }

  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.filterChanged.emit(filter);
  }
}
