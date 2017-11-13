import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

@Component({
  selector: 'app-production-planning',
  templateUrl: './production-planning.component.html',
  styleUrls: ['./production-planning.component.css']
})
export class ProductionPlanningComponent implements OnInit {

  //Order, inWarehouse, inWaitlist, inProduction aus DB
  // plannedWHend 2 Way Databinding
  currentPeriod: 3;

  plannedWHEndP1 = 0;
  plannedWHEndP2: 0;
  plannedWHEndP3: 0;

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.getValueFromDB();
  }

  calculateFinishedBikes(order:number, plannedWHend: number, inWarehouse:number, inWaitlist:number, inProduction: number): number {

    return order + plannedWHend - inWarehouse - inWaitlist - inProduction;
  }

  getValueFromDB(): number{
    let returnValue;
     this.db.object('periods/' + (this.currentPeriod-1)).valueChanges().subscribe(value => {
       returnValue = value;
    })
    return returnValue;
  }
}
