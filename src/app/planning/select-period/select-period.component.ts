import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from "@angular/router";
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Component({
  selector: 'app-select-period',
  templateUrl: './select-period.component.html',
  styleUrls: ['./select-period.component.css']
})

export class SelectPeriodComponent implements OnInit {
  @Output() closeSelectPeriod = new EventEmitter();  
  public possiblePeriods: number;
  public currPeriod = 1;
  toastOptions: ToastOptions = {
    title: 'Warnung!',
    msg: 'Planung wurde abgebrochen!',
    timeout: 3000,
    theme: 'material'
  }

  constructor(private db: AngularFireDatabase, private router: Router, private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'material';
    
  }

  ngOnInit() {
    this.db.object('periods').valueChanges().subscribe(count => {
      this.possiblePeriods = Object.keys(count).length + 1;
    });      
  }

  createRange() {
    var items: number[] = [];
    for(var i = 1; i <= this.possiblePeriods; i++) {
      items.push(i)
    }
    return items;
  }

  submitPeriod(period) {
    this.db.object('periods/' + (period - 1).toString()).valueChanges().subscribe(per => {
      if (per) {
        this.db.object('/').update({currentPeriod: period});        
        this.closeSelectPeriod.emit();        
      } else {
        console.log("error");
      }
    });    
  }

  closeModal() {
    this.router.navigate(['/']);
    this.toastyService.warning(this.toastOptions);    
  }
}
