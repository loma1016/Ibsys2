import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-workspace-planning',
  templateUrl: './workplace-planning.component.html',
  styleUrls: ['./workplace-planning.component.css']
})
export class WorkspacePlanningComponent implements OnInit {

  currentPeriod: number;

  workTimeList = {
    workplace: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 14, 15, 15],
    item: [49, 54, 29, 50, 55, 30, 51, 56, 31, 1, 2, 3, 16, 18, 19, 20, 10, 11, 12, 13, 14, 15, 18, 19, 20, 26, 10, 11, 12, 13, 14, 15, 18, 19, 20, 10, 11, 12, 13, 14, 15, 18, 19, 20, 4, 5, 6, 7, 8, 9, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 10, 11, 12, 13, 14, 15, 16, 17, 26],
    time: [6, 6, 6, 5, 5, 5, 5, 6, 6, 6, 7, 7, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3]
  };


  workTimeObj = {
    1: { 4: 6 },
    2: { 4: 7 },
    3: { 4: 7 },
    4: {
      10: 4,
      11: 3
    },
    5: {
      10: 4,
      11: 3
    },
    6: {
      10: 4,
      11: 3
    },
    7: {
      10: 4,
      11: 3
    },
    8: {
      10: 4,
      11: 3
    },
    9: {
      10: 4,
      11: 3
    },
    10: {
      13: 2,
      12: 3,
      8: 1,
      7: 2,
      9: 3
    },
    11: {
      13: 2,
      12: 3,
      8: 2,
      7: 2,
      9: 3
    },
    12: {
      13: 2,
      12: 3,
      8: 2,
      7: 2,
      9: 3
    },
    13: {
      13: 2,
      12: 3,
      8: 1,
      7: 2,
      9: 3
    },
    14: {
      13: 2,
      12: 3,
      8: 2,
      7: 2,
      9: 3
    },
    15: {
      13: 2,
      12: 3,
      8: 2,
      7: 2,
      9: 3
    },
    16: {
      6: 2,
      14: 3
    },
    17: { 15: 3 },
    18: {
      6: 3,
      8: 3,
      7: 2,
      9: 2
    },
    19: {
      6: 3,
      8: 3,
      7: 2,
      9: 2
    },
    20: {
      6: 3,
      8: 3,
      7: 2,
      9: 2
    },
    26: {
      7: 2,
      15: 3
    },
    29: { 1: 6 },
    30: { 2: 5 },
    31: { 3: 6 },
    49: { 1: 6 },
    50: { 2: 5 },
    51: { 3: 5 },
    54: { 1: 6 },
    55: { 2: 5 },
    56: { 3: 6 }
  };

  setup = {
    workplace: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 14, 15, 15],
    item: [49, 54, 29, 50, 55, 30, 51, 56, 31, 1, 2, 3, 16, 18, 19, 20, 10, 11, 12, 13, 14, 15, 18, 19, 20, 26, 10, 11, 12, 13, 14, 15, 18, 19, 20, 10, 11, 12, 13, 14, 15, 18, 19, 20, 4, 5, 6, 7, 8, 9, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 10, 11, 12, 13, 14, 15, 16, 17, 26],
    time: [20, 20, 20, 30, 30, 30, 20, 20, 20, 30, 20, 30, 15, 15, 15, 15, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 15, 15, 15, 15, 15, 15, 20, 25, 20, 15, 15, 15, 15, 15, 15, 15, 20, 15, 20, 20, 20, 20, 20, 20, 10, 10, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15],
    mean: [20, 30, 20, 27, 0, 15, 21, 17.5, 15.5, 20, 17, 0, 0, 0, 15],
    factor: [450, 600, 500, 500, 0, 80, 150, 200, 400, 300, 300, 300, 200, 300, 300],
    maxSetupTimes: [8, 6, 3, 3, 0, 4, 34, 38, 12, 6, 8, 6, 6, 1, 13]
  };

  workspaceOfItem = {
    1: [4],
    2: [4],
    3: [4],
    4: [10, 11],
    5: [10, 11],
    6: [10, 11],
    7: [10, 11],
    8: [10, 11],
    9: [10, 11],
    10: [13, 12, 8, 7, 9],
    11: [13, 12, 8, 7, 9],
    12: [13, 12, 8, 7, 9],
    13: [13, 12, 8, 7, 9],
    14: [13, 12, 8, 7, 9],
    15: [13, 12, 8, 7, 9],
    16: [6, 14],
    17: [15],
    18: [6, 8, 7, 9],
    19: [6, 8, 7, 9],
    20: [6, 8, 7, 9],
    26: [7, 15],
    29: [1],
    30: [2],
    31: [3],
    49: [1],
    50: [2],
    51: [3],
    54: [1],
    55: [2],
    56: [3]
  };

  productionPlan = {
    item: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 26, 49, 54, 29, 50, 55, 30, 51, 56, 31],
    amount: [150, 100, 100, 130, 100, 100, 130, 100, 100, 130, 100, 100, 130, 100, 100, 680, 680, 130, 100, 100, 330, 130, 100, 100, 280, 200, 200, 180, 100, 200]
  };

  productionQueTime = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  inProductionTime = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  setupTime = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  extraTime = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  workplacePlan = {
    totalTime: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    shift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    overtime: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };

  previousPeriodData: Observable<any>;
  productionData: Observable<any>;


  constructor(private db: AngularFireDatabase) {
  }


  ngOnInit() {
    this.db.object('currentPeriod').valueChanges().subscribe(currentPeriod => {
      this.previousPeriodData = this.db.object('periods/' + (Number(currentPeriod) - 1).toString()).valueChanges();
      this.previousPeriodData.subscribe(_ => {
        if (_.ordersinwork[0].workplace) {
          _.ordersinwork[0].workplace.forEach(workplace => {
            let itemId = workplace.item.item;
            let itemAmount = workplace.item.amount;
            let index;
            for (let i = 0; i < this.workspaceOfItem[itemId].length; i++) {
              if (this.workspaceOfItem[itemId][i] === Number(workplace.item.id)) {
                index = i;
              }
            }
            for (let i = 0; i < this.workspaceOfItem[itemId].length; i++) {
              if (i >= index) {
                this.inProductionTime[this.workspaceOfItem[itemId][i] - 1] += itemAmount * this.workTimeObj[itemId][this.workspaceOfItem[itemId][i]];
              }
            }
          });
        }

        _.waitinglistworkstations[0].workplace.forEach(workplace => {
          if (workplace.waitinglist) {
            workplace.waitinglist.forEach(item => {
              let itemId = item.item.item;
              let itemAmount = item.item.amount;
              let index;
              for (let i = 0; i < this.workspaceOfItem[itemId].length; i++) {
                if (this.workspaceOfItem[itemId][i] === Number(workplace.item.id)) {
                  index = i;
                }
              }

              for (let i = 0; i < this.workspaceOfItem[itemId].length; i++) {
                if (i >= index) {
                  this.productionQueTime[this.workspaceOfItem[itemId][i] - 1] += itemAmount * this.workTimeObj[itemId][this.workspaceOfItem[itemId][i]];
                }
              }
            });
          }
        });

        this.productionData = this.db.object('result/production').valueChanges();
        this.productionData.subscribe(productionPlan => {
          this.productionPlan = productionPlan;
          this.calculateWorkspacePlan();
        });

      });
    });
  }

  calculateWorkspacePlan() {
    this.resetWorkspacePlan();
    for (let i = 0; i < this.productionPlan.item.length; i++) {
      for (let e = 0; e < this.workTimeList.item.length; e++) {
        if (this.workTimeList.item[e] === this.productionPlan.item[i]) {
          this.workplacePlan.totalTime[this.workTimeList.workplace[e] - 1] += this.productionPlan.amount[i] * this.workTimeList.time[e];
        }
      }
    }

    for (let i = 0; i < this.productionQueTime.length; i++) {
      this.workplacePlan.totalTime[i] += this.productionQueTime[i];
    }

    for (let i = 0; i < this.inProductionTime.length; i++) {
      this.workplacePlan.totalTime[i] += this.inProductionTime[i];
    }

    for (let i = 0; i < this.extraTime.length; i++) {
      this.workplacePlan.totalTime[i] += Number(this.extraTime[i]);
    }

    for (let i = 0; i < this.workplacePlan.totalTime.length; i++) {
      if (this.setup.factor[i]) {
        this.setupTime[i] = Math.round(this.setup.maxSetupTimes[i]) * this.setup.mean[i];
      }
    }

    for (let i = 0; i < this.extraTime.length; i++) {
      this.workplacePlan.totalTime[i] += this.setupTime[i];
    }

    for (let i = 0; i < this.workplacePlan.totalTime.length; i++) {
      if (this.workplacePlan.totalTime[i] === 0) {
        this.workplacePlan.shift[i] = 0;
      } else if (this.workplacePlan.totalTime[i] <= 3600) {
        this.workplacePlan.shift[i] = 1;
      } else if (this.workplacePlan.totalTime[i] > 3600 && this.workplacePlan.totalTime[i] <= 6000) {
        this.workplacePlan.shift[i] = 2;
      } else if (this.workplacePlan.totalTime[i] > 6000 && this.workplacePlan.totalTime[i] <= 7200) {
        this.workplacePlan.shift[i] = 3;
      } else {
        this.workplacePlan.shift[i] = 3;
        console.log("Warning, not enough capacity")
      }

      if ((this.workplacePlan.totalTime[i] - (2400 * this.workplacePlan.shift[i]) > 0) && this.workplacePlan.shift[i] != 3) {
        this.workplacePlan.overtime[i] = (this.workplacePlan.totalTime[i] - (2400 * this.workplacePlan.shift[i])) / 5
      }
    }
    this.saveWorkplacePlan();
  }

  onExtraTimeChange() {
    this.calculateWorkspacePlan();
  }

  resetWorkspacePlan() {
    this.workplacePlan = {
      totalTime: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      shift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      overtime: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
  }

  saveWorkplacePlan() {
    let result = [];
    this.workplacePlan.shift.forEach((shift, index) => {
      result.push({station: index+1, shift: shift, overtime: this.workplacePlan.overtime[index]});
    });
    this.db.object('/result/workingtimelist').set(result);
  }

}
