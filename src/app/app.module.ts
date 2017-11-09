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

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    XmlUploadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule 
  ],
  providers: [XmlUploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
