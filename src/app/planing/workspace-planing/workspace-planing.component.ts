import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-workspace-planing',
  templateUrl: './workspace-planing.component.html',
  styleUrls: ['./workspace-planing.component.css']
})
export class WorkspacePlaningComponent implements OnInit {

  currentPeriod = 3;

  worktime = {
    workplace: [1,1,1,2,2,2,3,3,3,4,4,4,6,6,6,6,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,10,10,10,10,10,10,11,11,11,11,11,11,12,12,12,12,12,12,13,13,13,13,13,13,14,15,15],
    item: [49,54,29,50,55,30,51,56,31,1,2,3,16,18,19,20,10,11,12,13,14,15,18,19,20,26,10,11,12,13,14,15,18,19,20,10,11,12,13,14,15,18,19,20,4,5,6,7,8,9,4,5,6,7,8,9,10,11,12,13,14,15,10,11,12,13,14,15,16,17,26],
    time: [6,6,6,5,5,5,5,6,6,6,7,7,2,3,3,3,2,2,2,2,2,2,2,2,2,2,1,2,2,1,2,2,3,3,3,3,3,3,3,3,3,2,2,2,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,3,3,3]
  };

  setuptime = {
    workplace: [1,1,1,2,2,2,3,3,3,4,4,4,6,6,6,6,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,10,10,10,10,10,10,11,11,11,11,11,11,12,12,12,12,12,12,13,13,13,13,13,13,14,15,15],
    item: [49,54,29,50,55,30,51,56,31,1,2,3,16,18,19,20,10,11,12,13,14,15,18,19,20,26,10,11,12,13,14,15,18,19,20,10,11,12,13,14,15,18,19,20,4,5,6,7,8,9,4,5,6,7,8,9,10,11,12,13,14,15,10,11,12,13,14,15,16,17,26],
    time: [20,20,20,30,30,30,20,20,20,30,20,30,15,15,15,15,20,20,20,20,20,20,20,20,20,30,15,15,15,15,15,15,20,25,20,15,15,15,15,15,15,15,20,15,20,20,20,20,20,20,10,10,20,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,15,15]
  };

  productionPlan = {
    item: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,26,49,54,29,50,55,30,51,56,31],
    amount: [150,100,100,130,100,100,130,100,100,130,100,100,130,100,100,680,680,130,100,100,330,130,100,100,280,200,200,180,100,200]
  };

  productionQue = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  inProduction = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  extraTime = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  workplacePlan = {
    totalTime: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    shift: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    overtime: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  };



  previousPeriodData: Observable<any>;

  constructor(db: AngularFireDatabase) {

    this.previousPeriodData = db.object('periods/' + (this.currentPeriod-1)).valueChanges();
  }

  ngOnInit() {
    this.previousPeriodData.subscribe(_=> {
      _.waitinglistworkstations[0].workplace.forEach(workplace=>{
        if (workplace.waitinglist) {
          this.productionQue[workplace.item.id-1] = Number(workplace.item.timeneed);
        }
      });
      _.ordersinwork[0].workplace.forEach(workplace=>{
          this.inProduction[workplace.item.id-1] = Number(workplace.item.timeneed);
      });
      this.calculateWorkspacePlan();
      console.log(this.inProduction);
      console.log(this.productionQue);
    });

  }

  calculateWorkspacePlan() {
    this.resetWorkspacePlan();
    for (let i=0; i<this.productionPlan.item.length; i++) {
      for (let e=0; e<this.worktime.item.length; e++) {
        if (this.worktime.item[e] === this.productionPlan.item[i]) {
          this.workplacePlan.totalTime[this.worktime.workplace[e]-1] += this.productionPlan.amount[i]*this.worktime.time[e];
        }
      }
    }

    for (let i=0; i<this.productionQue.length; i++) {
      this.workplacePlan.totalTime[i] += this.productionQue[i];
    }

    for (let i=0; i<this.inProduction.length; i++) {
      this.workplacePlan.totalTime[i] += this.inProduction[i];
    }

    for (let i=0; i<this.extraTime.length; i++) {
      this.workplacePlan.totalTime[i] += Number(this.extraTime[i]);
    }

    for (let i=0; i<this.workplacePlan.totalTime.length; i++) {
      if (this.workplacePlan.totalTime[i]<=3600) {
        this.workplacePlan.shift[i] = 1;
      } else if (this.workplacePlan.totalTime[i]>3600 && this.workplacePlan.totalTime[i]<=6000) {
        this.workplacePlan.shift[i] = 2;
      } else if (this.workplacePlan.totalTime[i]>6000 && this.workplacePlan.totalTime[i]<=7200) {
        this.workplacePlan.shift[i] = 3;
      }

      if ((this.workplacePlan.totalTime[i]- (2400*this.workplacePlan.shift[i])>0)) {
        this.workplacePlan.overtime[i] = (this.workplacePlan.totalTime[i] - (2400 * this.workplacePlan.shift[i])) / 5
      }

    }

  }

  onExtraTimeChange() {
    this.calculateWorkspacePlan();
  }

  resetWorkspacePlan(){
    this.workplacePlan = {
      totalTime: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      shift: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      overtime: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    };
  }

}