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
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { ToastyModule } from 'ng2-toasty';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DispositionComponent } from './planning/disposition/disposition.component';
import { ForecastComponent } from './planning/forecast/forecast.component';
import { PlanningComponent } from './planning/planning.component';
import { WorkspacePlanningComponent } from './planning/workplace-planning/workplace-planning.component';
import { ProductionPlanningComponent } from './planning/production-planning/production-planning.component';
import { ResultComponent } from './planning/result/result.component';
import { SelectPeriodComponent } from './planning/select-period/select-period.component';


@NgModule({
  declarations: [
    AppComponent,
    XmlUploadComponent,
    WorkspacePlanningComponent,
    PlanningComponent,
    ProductionPlanningComponent,
    DashboardComponent,
    DispositionComponent,
    DashboardComponent,
    ForecastComponent,
    ResultComponent,
    SelectPeriodComponent
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
    MatSelectModule,
    MatStepperModule,
    MatButtonModule,
    MatTableModule,
    FormsModule,
    HttpModule,
    routes,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    ChartsModule,
    MatTabsModule,
    ToastyModule.forRoot()
  ],
  providers: [XmlUploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
