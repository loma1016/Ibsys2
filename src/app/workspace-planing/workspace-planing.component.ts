import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workspace-planing',
  templateUrl: './workspace-planing.component.html',
  styleUrls: ['./workspace-planing.component.css']
})
export class WorkspacePlaningComponent implements OnInit {

  workspaces = {
    workspace: [1,1,1,2,2,2,3,3,3,4,4,4,6,6,6,6,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,10,10,10,10,10,10,11,11,11,11,11,11,12,12,12,12,12,12,13,13,13,13,13,13,14,15,15],
    id: [49,54,29,50,55,30,51,56,31,1,2,3,16,18,19,20,10,11,12,13,14,15,18,19,20,26,10,11,12,13,14,15,18,19,20,10,11,12,13,14,15,18,19,20,4,5,6,7,8,9,4,5,6,7,8,9,10,11,12,13,14,15,10,11,12,13,14,15,16,17,26],
    time: [6,6,6,5,5,5,5,6,6,6,7,7,2,3,3,3,2,2,2,2,2,2,2,2,2,2,1,2,2,1,2,2,3,3,3,3,3,3,3,3,3,2,2,2,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,3,3,3]
  };

  productionPlan = {
    id: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,26,49,54,29,50,55,30,51,56,31],
    amount: [150,100,100,130,100,100,130,100,100,130,100,100,130,100,100,680,680,130,100,100,330,130,100,100,280,200,200,180,100,200]
  };

  productionQue = {
    workspace: [7,8,9],
    time:[300,200,100]
  };

  inProduction = {
    workspace: [7],
    time: [50]
  };

  workspacePlan = {
    totalTime: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    shift: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    overtime: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  };

  constructor() { }

  ngOnInit() {

    for (let i=0; i<this.productionPlan.id.length; i++) {
      for (let e=0; e<this.workspaces.id.length; e++) {
        if (this.workspaces.id[e] === this.productionPlan.id[i]) {
          this.workspacePlan.totalTime[this.workspaces.workspace[e]] += this.productionPlan.amount[i]*this.workspaces.time[e];
        }
      }

    }
    for (let i=0; i<this.productionQue.workspace.length; i++) {
      this.workspacePlan.totalTime[this.productionQue.workspace[i]] += this.productionQue.time[i];
    }

    for (let i=0; i<this.inProduction.workspace.length; i++) {
      this.workspacePlan.totalTime[this.inProduction.workspace[i]] += this.inProduction.time[i];
    }

    for (let i=0; i<this.workspacePlan.totalTime.length; i++) {
      if (this.workspacePlan.totalTime[i]<=3600) {
        this.workspacePlan.shift[i] = 1;
      } else if (this.workspacePlan.totalTime[i]>3600 && this.workspacePlan.totalTime[i]<=6000) {
        this.workspacePlan.shift[i] = 2;
      } else if (this.workspacePlan.totalTime[i]>6000 && this.workspacePlan.totalTime[i]<=7200) {
        this.workspacePlan.shift[i] = 3;
      }

      if ((this.workspacePlan.totalTime[i]- (2400*this.workspacePlan.shift[i])>0)) {
        this.workspacePlan.overtime[i] = (this.workspacePlan.totalTime[i] - (2400 * this.workspacePlan.shift[i])) / 5
      }

    }
    console.log(this.workspacePlan);

  }

}
