import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VictimsPage } from './victims.page';

const routes: Routes = [
  {
    path: '',
    component: VictimsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VictimsPageRoutingModule {}
