import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeviceStreamService } from '../../services/stream/device-stream.service';

@Component({
  selector: 'app-thumbnail',
  imports: [CommonModule],
  templateUrl: './thumbnail.component.html',
  styleUrl: './thumbnail.component.scss'
})
export class ThumbnailComponent implements OnInit {
  @Input() deviceId!: number;
  @Input() streamNumber!: number;
  @Input() isActive!: boolean;
  @Input() isSelected!: boolean;
  @Input() location!: string;
  @Output() select = new EventEmitter<void>();
  

  readonly thumbnailUrl = 'https://7pd4fg47-8000.asse.devtunnels.ms/api/image/';

  constructor(private deviceStreamService: DeviceStreamService) {}

  ngOnInit(): void {
    
  }

  onSelect(): void {
    this.select.emit();
  }
}