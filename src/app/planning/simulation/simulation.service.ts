import { Injectable } from '@angular/core';

@Injectable()
export class SimulationService {

  warehouseStock = {data:{},index:[]};
  productionPlan = {data:{},index:[]};
  workTime = {data:{},index:[]};
  simulation = {byItem:{data:{},index:[]}, byWorkspace:{data:{},index:[]}};
  inwardStockMovement: any;
  currentPeriod: number;

  workTimeList = {
    workplace: [ 1,  1,  1,  2,  2,  2,  3,  3,  3, 4, 4, 4,  6,  6,  6,  6,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  8,  8,  8,  8,  8,  8,  8,  8,  8,  9,  9,  9,  9,  9,  9,  9,  9,  9, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 14, 15, 15],
    item:      [49, 54, 29, 50, 55, 30, 51, 56, 31, 1, 2, 3, 16, 18, 19, 20, 10, 11, 12, 13, 14, 15, 18, 19, 20, 26, 10, 11, 12, 13, 14, 15, 18, 19, 20, 10, 11, 12, 13, 14, 15, 18, 19, 20,  4,  5,  6,  7,  8,  9,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 10, 11, 12, 13, 14, 15, 16, 17, 26],
    time:      [ 6,  6,  6,  5,  5,  5,  5,  6,  6, 6, 7, 7,  2,  3,  3,  3,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  1,  2,  2,  3,  3,  3,  3,  3,  3,  3,  3,  3,  2,  2,  2,  4,  4,  4,  4,  4,  4,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  2,  2,  2,  2,  2,  2,  3,  3,  3],
    setupTime: [20, 20, 20, 30, 30, 30, 20, 20, 20, 30, 20, 30, 15, 15, 15, 15, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 15, 15, 15, 15, 15, 15, 20, 25, 20, 15, 15, 15, 15, 15, 15, 15, 20, 15, 20, 20, 20, 20, 20, 20, 10, 10, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15],
    material: [
      [ {id: 7, amount:1}, // 1 49
        {id:13, amount:1},
        {id:18, amount:1},
        {id:24, amount:2},
        {id:25, amount:2}],
      [ {id: 8, amount:1}, // 1 54
        {id:14, amount:1},
        {id:19, amount:1},
        {id:24, amount:2},
        {id:25, amount:2}],
      [ {id: 9, amount:1}, // 1 29
        {id:15, amount:1},
        {id:20, amount:1},
        {id:24, amount:2},
        {id:25, amount:2}],
      [ {id: 4, amount:1}, // 2 50
        {id:10, amount:1},
        {id:49, amount:1},
        {id:24, amount:2},
        {id:25, amount:2}],
      [ {id: 5, amount:1}, // 2 55
        {id:11, amount:1},
        {id:54, amount:1},
        {id:24, amount:2},
        {id:25, amount:2}],
      [ {id: 6, amount:1}, // 2 30
        {id:12, amount:1},
        {id:29, amount:1},
        {id:24, amount:2},
        {id:25, amount:2}],
      [ {id:16, amount:1}, // 3 51
        {id:17, amount:1},
        {id:50, amount:1},
        {id:24, amount:2},
        {id:27, amount:1}],
      [ {id:16, amount:1}, // 3 56
        {id:17, amount:1},
        {id:55, amount:1},
        {id:24, amount:1},
        {id:27, amount:1}],
      [ {id:16, amount:1}, // 3 31
        {id:17, amount:1},
        {id:30, amount:1},
        {id:24, amount:1},
        {id:27, amount:1}],
      [ {id:26, amount:1}, // 4 1
        {id:51, amount:1},
        {id:21, amount:1},
        {id:24, amount:1},
        {id:27, amount:1}],
      [ {id:26, amount:1}, // 4 2
        {id:56, amount:1},
        {id:22, amount:1},
        {id:24, amount:1},
        {id:27, amount:1}],
      [ {id:26, amount:1}, // 4 3
        {id:31, amount:1},
        {id:23, amount:1},
        {id:24, amount:1},
        {id:27, amount:1}],
      [ {id:28, amount:1}], // 6 16
      [ {id:28, amount:3}], // 6 18
      [ {id:28, amount:4}], // 6 19
      [ {id:28, amount:5}], // 6 20
      [ ], // 7 10
      [ ], // 7 11
      [ ], // 7 12
      [ ], // 7 13
      [ ], // 7 14
      [ ], // 7 15
      [ {id:59, amount:2}], // 7 18
      [ {id:59, amount:2}], // 7 19
      [ {id:59, amount:2}], // 7 20
      [ {id:44, amount:2},  // 7 26
        {id:48, amount:2}],
      [ ], // 8 10
      [ ], // 8 11
      [ ], // 8 12
      [ ], // 8 13
      [ ], // 8 14
      [ ], // 8 15
      [ ], // 8 18
      [ ], // 8 19
      [ ], // 8 20
      [ {id:32, amount:1}], // 9 10
      [ {id:32, amount:1}], // 9 11
      [ {id:32, amount:1}], // 9 12
      [ {id:32, amount:1}], // 9 13
      [ {id:32, amount:1}], // 9 14
      [ {id:32, amount:1}], // 9 15
      [ {id:32, amount:1}], // 9 18
      [ {id:32, amount:1}], // 9 19
      [ {id:32, amount:1}], // 9 20
      [ {id:52, amount:1},  // 10 4
        {id:53, amount:36}],
      [ {id:57, amount:1},  // 10 5
        {id:58, amount:36}],
      [ {id:33, amount:1},  // 10 6
        {id:34, amount:36}],
      [ {id:52, amount:1},  // 10 7
        {id:53, amount:36}],
      [ {id:57, amount:1},  // 10 8
        {id:58, amount:36}],
      [ {id:33, amount:1},  // 10 9
        {id:34, amount:36}],
      [ {id:35, amount:2},  // 11  4
        {id:36, amount:1}],
      [ {id:35, amount:2},  // 11  5
        {id:36, amount:1}],
      [ {id:35, amount:2},  // 11  6
        {id:36, amount:1}],
      [ {id:35, amount:2},  // 11  7
        {id:37, amount:1},
        {id:38, amount:1}],
      [ {id:35, amount:2},  // 11  8
        {id:37, amount:1},
        {id:38, amount:1}],
      [ {id:35, amount:2},  // 11  9
        {id:37, amount:1},
        {id:38, amount:1}],
      [ ],  // 12  10
      [ ],  // 12  11
      [ ],  // 12  12
      [ ],  // 12  13
      [ ],  // 12  14
      [ ],  // 12  15
      [ {id:39, amount:1}], // 13 10
      [ {id:39, amount:1}], // 13 11
      [ {id:39, amount:1}], // 13 12
      [ {id:39, amount:1}], // 13 13
      [ {id:39, amount:1}], // 13 14
      [ {id:39, amount:1}], // 13 15
      [ {id:24, amount:1},  // 14 16
        {id:28, amount:1},
        {id:40, amount:1},
        {id:41, amount:1},
        {id:42, amount:2}],
      [ {id:43, amount:1},  // 15 17
        {id:44, amount:1},
        {id:45, amount:1},
        {id:46, amount:1}],
      [ {id:47, amount:1}], // 15 26

    ]

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

  workspaces = {
    data: {
      1: {
        time:0,
        amount:0,
        setupId:0,
        notWorkingTime:0,
        setupTimes:0
      },
      2: {
        time:0,
        amount:0,
        setupId:0,
        notWorkingTime:0,
        setupTimes:0
      },
      3: {
        time:0,
        amount:0,
        setupId:0,
        notWorkingTime:0,
        setupTimes:0
      },
      4: {
        time:0,
        amount:0,
        setupId:0,
        notWorkingTime:0,
        setupTimes:0
      },
      6: {
        time:0,
        amount:0,
        setupId:0,
        notWorkingTime:0,
        setupTimes:0
      },
      7: {
        time:0,
        amount:0,
        setupId:0,
        notWorkingTime:0,
        setupTimes:0
      },
      8: {
        time:0,
        amount:0,
        setupId:0,
        notWorkingTime:0,
        setupTimes:0
      },
      9: {
        time:0,
        amount:0,
        setupId:0,
        notWorkingTime:0,
        setupTimes:0
      },
      10: {
        time:0,
        amount:0,
        setupId:0,
        notWorkingTime:0,
        setupTimes:0
      },
      11: {
        time:0,
        amount:0,
        setupId:0,
        notWorkingTime:0,
        setupTimes:0
      },
      12: {
        time:0,
        amount:0,
        setupId:0,
        notWorkingTime:0,
        setupTimes:0
      },
      13: {
        time:0,
        amount:0,
        setupId:0,
        notWorkingTime:0,
        setupTimes:0
      },
      14: {
        time:0,
        amount:0,
        setupId:0,
        notWorkingTime:0,
        setupTimes:0
      },
      15: {
        time:0,
        amount:0,
        setupId:0,
        notWorkingTime:0,
        setupTimes:0
      }
    },
    index: [1,2,3,4,6,7,8,9,10,11,12,13,14,15]
  };

  ticksPassed = 0;

  leerZeit = 0;

  time = 7200;

  constructor() { }

  simulate(periodData: any, productionPlan: any, inwardStockMovement: any, currentPeriod: any): any {
    this.setData(periodData, productionPlan, inwardStockMovement, currentPeriod);

    let inProgress = true;

    while(inProgress) {

      this.productionPlan.index.forEach(id => {

        let steps = Object.keys(this.workTime.data[id]).length;

        if(steps > 1) {

          for ( let step = 0; step<steps-1; step++) {
            if (this.workTime.data[id][step].waitlist > 0 ) {

              let amount = 0;
              if (this.workTime.data[id][step].waitlist > 10) {
                amount = 10;
              } else {
                amount = this.workTime.data[id][step].waitlist;
              }

              if (this.checkMaterial(amount, id, step+1)) {


                if (this.checkWorkspace(id, step+1)) {

                  this.setWorkspace(id, step+1, amount, true);

                }
              }
            }
          }
        }

        if (this.productionPlan.data[id].waitlist>0) {

          let amount = 0;
          if (this.productionPlan.data[id].waitlist > 10) {
            amount = 10;
          } else {
            amount = this.productionPlan.data[id].waitlist;
          }

          let step = 0;

          if (this.checkMaterial(amount, id, step)) {

            if (this.checkWorkspace(id, step)) {

              this.setWorkspace(id, step, amount, true);


            }
          }
        }
      });

      this.productionPlan.index.forEach(id => {

        let steps = Object.keys(this.workTime.data[id]).length;

        if(steps > 1) {

          for ( let step = 0; step<steps-1; step++) {
            if (this.workTime.data[id][step].amount > 0 ) {

              let amount = 0;
              if (this.workTime.data[id][step].amount > 10) {
                amount = 10;
              } else {
                amount = this.workTime.data[id][step].amount;
              }

              if (this.checkMaterial(amount, id, step+1)) {


                if (this.checkWorkspace(id, step+1)) {

                  this.setWorkspace(id, step+1, amount, false);

                }
              }
            }
          }
        }


        if (this.productionPlan.data[id].amount>0) {

          let amount = 0;
          if (this.productionPlan.data[id].amount > 10) {
            amount = 10;
          } else {
            amount = this.productionPlan.data[id].amount;
          }

          let step = 0;

          if (this.checkMaterial(amount, id, step)) {

            if (this.checkWorkspace(id, step)) {

              this.setWorkspace(id, step, amount, false);

            }
          }
        }
      });

      this.tick();

      this.checkInwardStockMovement();

      if (this.ticksPassed === this.time) {
        inProgress = false;
      }

    }

    this.simulation.byItem.index.forEach(index => {
      this.simulation.byItem.data[index].forEach(entry => {
        if(!this.workspaces.data[entry.workspace].lastProductFinished || this.workspaces.data[entry.workspace].lastProductFinished<entry.time) {
          this.workspaces.data[entry.workspace].lastProductFinished = entry.time;
        }
      })
    });

    this.workspaces.index.forEach(index => {
      this.workspaces.data[index].notWorkingTime = this.workspaces.data[index].notWorkingTime - (this.time-this.workspaces.data[index].lastProductFinished);
    });

    let result = {simulation: this.simulation,
                  workspaces: this.workspaces};

    return result;
  }

  // check if enough material is in stock to produce amount of product with the id
  checkMaterial(amount: number, id: number, step: number): boolean {
    let result = true;

    this.workTime.data[id][step].material.forEach(material => {
      if (this.warehouseStock.data[material.id].amount - (material.amount * amount) < 0) {
        result = false;
      }
    });

    return result;
  }

  // check if the workspace is awailable
  checkWorkspace(id: number, step: number) {
    if (this.workspaces.data[this.workTime.data[id][step].station].time) {
      return false
    } else {
      return true;
    }
  }

  setWorkspace(id: number, step: number, amount: number, fromWaitlist: boolean) {
    let workspaceId = this.workTime.data[id][step].station;
    this.workspaces.data[workspaceId].amount = amount;
    this.workspaces.data[workspaceId].fromWaitlist = fromWaitlist;
    if (this.workspaces.data[workspaceId].setupId !== id) {
      this.workspaces.data[workspaceId].time = this.workTime.data[id][step].setupTime + 10 * this.workTime.data[id][step].time
      this.workspaces.data[workspaceId].setupTimes +=1;
    } else {
      this.workspaces.data[workspaceId].time = 10 * this.workTime.data[id][step].time
    }
    this.workspaces.data[workspaceId].setupId = id;

    if (fromWaitlist) {
      if (step === 0) {
        this.productionPlan.data[id].waitlist -= amount;
      } else {
        this.workTime.data[id][step-1].waitlist -= amount;
      }
    } else {
      if (step === 0) {
        this.productionPlan.data[id].amount -= amount;
      } else {
        this.workTime.data[id][step-1].amount -= amount;
      }
    }

    this.workTime.data[id][step].material.forEach(material => {
      this.warehouseStock.data[material.id].amount -= (material.amount * amount);
    });

  }

  tick() {

    this.ticksPassed += 1;

    this.workspaces.index.forEach( id => {

      if (this.workspaces.data[id].time > 0) {
        this.workspaces.data[id].time -= 1;
      } else {
        this.leerZeit +=1;
        this.workspaces.data[id].notWorkingTime +=1;
      }

      if( this.workspaces.data[id].time === 0 && this.workspaces.data[id].setupId !== 0 ) {

        let stepId = 0;
        for ( let step in this.workTime.data[this.workspaces.data[id].setupId]) {
          if (this.workTime.data[this.workspaces.data[id].setupId][step].station === id) {
            stepId = Number(step);
          }
        }



        if (this.workspaces.data[id].amount>0) {

          let materialArry = [];

          this.workTime.data[this.workspaces.data[id].setupId][stepId].material.forEach(material => {
            materialArry.push({material: material.id, amount: this.warehouseStock.data[material.id].amount});

          });

          if (this.simulation.byItem.data[this.workspaces.data[id].setupId]) {
            this.simulation.byItem.data[this.workspaces.data[id].setupId].push({
              step: stepId+1,
              time: this.ticksPassed,
              amount: this.workspaces.data[id].amount,
              workspace: id,
              material: materialArry
            });
          } else {
            this.simulation.byItem.data[this.workspaces.data[id].setupId] = [{
              step: stepId+1,
              time: this.ticksPassed,
              amount: this.workspaces.data[id].amount,
              workspace: id,
              material: materialArry
            }];
            this.simulation.byItem.index.push(this.workspaces.data[id].setupId);
          }

          if (this.simulation.byWorkspace.data[id]) {
            this.simulation.byWorkspace.data[id].push({
              item: this.workspaces.data[id].setupId,
              step: stepId+1,
              time: this.ticksPassed,
              amount: this.workspaces.data[id].amount,
              material: materialArry
            });
          } else {
            this.simulation.byWorkspace.data[id] = [{
              item: this.workspaces.data[id].setupId,
              step: stepId+1,
              time: this.ticksPassed,
              amount: this.workspaces.data[id].amount,
              material: materialArry
            }];
            this.simulation.byWorkspace.index.push(id);
          }

          if (Object.keys(this.workTime.data[this.workspaces.data[id].setupId]).length === stepId + 1) {
            this.warehouseStock.data[this.workspaces.data[id].setupId].amount += this.workspaces.data[id].amount;
          }

          if (this.workspaces.data[id].fromWaitlist) {
            this.workTime.data[this.workspaces.data[id].setupId][stepId].waitlist += this.workspaces.data[id].amount;
          } else {
            this.workTime.data[this.workspaces.data[id].setupId][stepId].amount += this.workspaces.data[id].amount;
          }
          this.workspaces.data[id].amount = 0;
        }
      }
    });
  }

  checkInwardStockMovement() {
    this.inwardStockMovement.forEach(article => {
      if (!article.deliverd &&((article.deliveryTime-4)-((this.currentPeriod-article.orderPeriod)*5))*(this.time/5)<this.ticksPassed) {
        this.warehouseStock.data[article.article].amount += article.quantity;
        article.deliverd = true;
      }
    });
  }

  setData(periodData: any, productionPlan: any, inwardStockMovement: any, currentPeriod: number) {
    this.ticksPassed = 0;
    this.leerZeit = 0;

    this.simulation = {byItem:{data:{},index:[]}, byWorkspace:{data:{},index:[]}};

    this.warehouseStock.data = {};
    this.productionPlan.data = {};
    this.warehouseStock.index = [];
    this.productionPlan.index = [];

    this.inwardStockMovement = inwardStockMovement;
    this.currentPeriod = currentPeriod;

    periodData.warehousestock[0].article.forEach(article => {
      this.warehouseStock.data[Number(article.item.id)] = {amount: Number(article.item.amount)};
      this.warehouseStock.index.push(Number(article.item.id));
    });

    productionPlan.order.forEach(id => {
      this.productionPlan.data[id] = {amount: productionPlan.amount[productionPlan.item.indexOf(id)], waitlist: productionPlan.waitlist[productionPlan.item.indexOf(id)] };
      this.productionPlan.index.push(id);
    });

    this.workspaces.index.forEach(id => {
      this.workspaces.data[id] = {
        time:0,
        amount:0,
        setupId:0,
        notWorkingTime:0,
        setupTimes:0,
        lastProductFinished:0
      }
    });

    for (let entry in this.workspaceOfItem) {
      this.workTime.data[entry] = {};
      this.workTime.index.push(Number(entry));

      for (let entry2 in this.workspaceOfItem[entry]) {
        this.workTime.data[entry][entry2] = {station: this.workspaceOfItem[entry][entry2]};

        this.workTimeList.item.forEach( (id, index) =>{
          if (Number(id) === Number(entry) && this.workTimeList.workplace[index] === this.workspaceOfItem[entry][entry2]) {
            this.workTime.data[entry][entry2] = {
              station: this.workspaceOfItem[entry][entry2],
              time: this.workTimeList.time[index],
              setupTime: this.workTimeList.setupTime[index],
              amount: 0,
              waitlist:0,
              material:this.workTimeList.material[index]
            };
          }
        });
      }
    }
  }
}
