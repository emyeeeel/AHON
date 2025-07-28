import { Component, Input, OnInit } from '@angular/core';
import { IonIcon, IonProgressBar, IonCardContent, IonCard } from "@ionic/angular/standalone";
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-victim-info-card',
  templateUrl: './victim-info-card.component.html',
  styleUrls: ['./victim-info-card.component.scss'],
  imports: [IonCard, IonCardContent, IonProgressBar, IonIcon, DatePipe, DecimalPipe],
})
export class VictimInfoCardComponent implements OnInit {
  @Input() victim: any;

  constructor() { }

  ngOnInit() { }

}
