import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'stream',
        pathMatch: 'full'
      },
      {
        path: 'stream',
        loadChildren: () => import('./stream/stream.module').then(m => m.StreamPageModule)
      },
      {
        path: 'victims',
        loadChildren: () => import('./victims/victims.module').then(m => m.VictimsPageModule)
      },
      {
        path: 'history',
        loadChildren: () => import('./history/history.module').then(m => m.HistoryPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule)
      }
    ]
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then(m => m.HistoryPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'stream',
    loadChildren: () => import('./stream/stream.module').then(m => m.StreamPageModule)
  },
  {
    path: 'victims',
    loadChildren: () => import('./victims/victims.module').then(m => m.VictimsPageModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
