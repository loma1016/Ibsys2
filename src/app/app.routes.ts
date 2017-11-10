import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XmlUploadComponent } from "./xml-upload/xml-upload.component";
import { PlaningComponent } from "./planing/planing.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

const appRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'planing',
    component: PlaningComponent
  },
  {
    path: 'xmlinput',
    component: XmlUploadComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});
