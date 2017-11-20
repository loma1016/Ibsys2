import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-select-period',
  templateUrl: './select-period.component.html',
  styleUrls: ['./select-period.component.css']
})

export class SelectPeriodComponent implements OnInit {
  @Output() closeSelectPeriod = new EventEmitter();  
  public possiblePeriods = 7;
  public currPeriod = 1;

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
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
}
