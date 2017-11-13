import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XmlUploadComponent } from "./xml-upload/xml-upload.component";
import { PlanningComponent } from "./planning/planning.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

const appRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'planning',
    component: PlanningComponent
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
