import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XmlUploadComponent } from './xml-upload/xml-upload.component';
import { PlanningComponent } from './planning/planning.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./shared/auth-guard";



const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'planning',
    component: PlanningComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'xmlinput',
    component: XmlUploadComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});
