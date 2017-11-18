import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items: Observable<any[]>;
  showXmlUpload = false;

  constructor(db: AngularFirestore) {
    this.items = db.collection('article').valueChanges();
  }

  openXmlUpload() {
    this.showXmlUpload = true;
  }

  closeXmlUpload() {
    this.showXmlUpload = false;
  }
}
