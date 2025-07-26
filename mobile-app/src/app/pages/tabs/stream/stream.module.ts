import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StreamPageRoutingModule } from './stream-routing.module';
import { StreamPage } from './stream.page';
import { HeaderComponent } from "src/app/components/header/header.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StreamPageRoutingModule,
    HeaderComponent,
  ],
  declarations: [StreamPage]
})
export class StreamPageModule { }
