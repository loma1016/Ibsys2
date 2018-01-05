import {Component, HostListener} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items: Observable<any[]>;
  showXmlUpload = false;
  public setPeriod = false;

  constructor(db: AngularFirestore,
              private router: Router) {
    this.items = db.collection('article').valueChanges();
  }

  openXmlUpload() {
    this.showXmlUpload = true;
  }

  closeXmlUpload() {
    this.showXmlUpload = false;
  }


  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.closeXmlUpload();
  }

  logout(){
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }
}
