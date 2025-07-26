import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StreamPageRoutingModule } from './stream-routing.module';
import { StreamPage } from './stream.page';
import { HeaderComponent } from "src/app/components/header/header.component";
import { MissionStreamComponent } from "src/app/components/mission-stream/mission-stream.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StreamPageRoutingModule,
    HeaderComponent,
    MissionStreamComponent
  ],
  declarations: [StreamPage]
})
export class StreamPageModule { }
