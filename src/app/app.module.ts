import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler  } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { XmlUploadComponent } from './xml-upload/xml-upload.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { XmlUploadService } from './shared/xml-upload/xml-upload.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
import { ModalComponent } from './util/modal/modal.component';
import { SelectPeriodComponent } from './planning/select-period/select-period.component';
import { ToastyServiceInt } from './util/toasty.service';
import { LoginComponent } from './login/login.component';
import {LoginService} from "./shared/login-service";
import {AuthGuard} from "./shared/auth-guard";
import { DirectSalesComponent } from './planning/direct-sales/direct-sales.component';
import {BusyModule} from 'angular2-busy';
import MyErrorHandler from "./util/error.service";


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
    ModalComponent,
    ResultComponent,
    SelectPeriodComponent,
    LoginComponent,
    DirectSalesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BusyModule,
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
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routes,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    ChartsModule,
    MatTabsModule,
    ToastyModule.forRoot(),
    DragulaModule
  ],
  providers: [XmlUploadService,ToastyServiceInt, LoginService, AuthGuard, { provide: ErrorHandler, useClass: MyErrorHandler }],
  bootstrap: [AppComponent]
})
export class AppModule { }
