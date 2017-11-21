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
  public possiblePeriods = [];
  public currPeriod = 1;
  public periods: any[];
  public setPeriod: true;
  public butDisabled = true;

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
      var periods = Object.keys(count);
      periods.forEach(per => {
        this.possiblePeriods.push(Number(per) + 1);
      });
    });      
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

  startPlanning() {
    this.closeSelectPeriod.emit();            
  }

  enableBtn() {
    this.butDisabled = false;
  }
}
