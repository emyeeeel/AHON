import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VictimsPageRoutingModule } from './victims-routing.module';

import { VictimsPage } from './victims.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VictimsPageRoutingModule
  ],
  declarations: [VictimsPage]
})
export class VictimsPageModule {}
