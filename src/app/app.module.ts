import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { XmlUploadComponent } from './xml-upload/xml-upload.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { XmlUploadService } from './shared/xml-upload/xml-upload.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';

import { AppComponent } from './app.component';
import { WorkspacePlanningComponent } from './planning/workplace-planning/workplace-planning.component';
import { routes } from './app.routes';
import { PlanningComponent } from './planning/planning.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForecastComponent } from './planning/forecast/forecast.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    XmlUploadComponent,
    WorkspacePlanningComponent,
    PlanningComponent,
    DashboardComponent,
    ForecastComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatStepperModule,
    MatButtonModule,
    MatTableModule,
    FormsModule,
    HttpModule,
    routes,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    ChartsModule
  ],
  providers: [XmlUploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
