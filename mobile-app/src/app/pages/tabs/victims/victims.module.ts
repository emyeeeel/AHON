import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VictimsPageRoutingModule } from './victims-routing.module';

import { VictimsPage } from './victims.page';
import { HeaderComponent } from "src/app/components/header/header.component";
import { VictimInfoCardComponent } from "src/app/components/victim-info-card/victim-info-card.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VictimsPageRoutingModule,
    HeaderComponent,
    VictimInfoCardComponent
  ],
  declarations: [VictimsPage]
})
export class VictimsPageModule { }
