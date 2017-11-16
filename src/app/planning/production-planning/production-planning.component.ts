import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs";
import {FinishedProduct} from "./finishedProduct-model";
import {SubProduct} from "./subProduct-model";
import {Dependency} from "./dependency-model";

@Component({
  selector: 'app-production-planning',
  templateUrl: './production-planning.component.html',
  styleUrls: ['./production-planning.component.css']
})
export class ProductionPlanningComponent implements OnInit {

  //Order, inWarehouse, inWaitlist, inProduction aus DB
  // plannedWHend 2 Way Databinding

  //MOCKDATA
  mockedPeriod = 3;
  mockedOrders = 100;

   dependencyList = [
   new Dependency(26, [1, 2, 3]), new Dependency(51, [1]), new Dependency(56, [2]), new Dependency(31, [3]),
   new Dependency(16, [51, 56, 31]), new Dependency(17, [51, 56, 31]), new Dependency(50, [51]), new Dependency(55, [56]), new Dependency(30, [31]),
   new Dependency(4, [50]), new Dependency(10, [50]), new Dependency(49, [50]), new Dependency(5, [55]), new Dependency(11, [55]), new Dependency(54, [55]), new Dependency(6, [30]), new Dependency(12, [30]), new Dependency(29, [30]),
   new Dependency(7, [49]), new Dependency(13, [49]), new Dependency(18, [49]), new Dependency(8, [54]), new Dependency(14, [54]), new Dependency(19, [54]), new Dependency(9, [29]), new Dependency(15, [29]), new Dependency(20, [29])
   ];

  //


  dbResults: Observable<any>;
  workPlaceWithWaitList: Array<any> = [];
  values: any;


  constructor(private db: AngularFireDatabase) {
    this.dbResults = this.getValuesFromDB();
  }

  ngOnInit() {
    this.dbResults.subscribe(values => {
      console.log(values);
      this.values = values;
      this.workPlaceWithWaitList = this.getWorkPlaceWithWaitlist();
      const finishedProducts = [this.setFinishedProduct(1),this.setFinishedProduct(2),this.setFinishedProduct(3)];
      console.log('finished Products: ',finishedProducts)
    })
  }

  setFinishedProduct(id: number): FinishedProduct {
    let fP = new FinishedProduct();
    fP.id = id;
    fP.orders = this.mockedOrders;
    fP.inWaitlist = this.getAmmountOfWaitlistByID(id);
    fP.plannedWHEnd = 0;
    fP.inProduction = this.getOrdersInWorkByID(id);
    fP.inWarehouse = this.getWarehouseAmountByID(id);
    fP.amountneeded = this.calculateAmmountForFinishedProduct(fP);
    return fP;
  }

  setSubProduct(id: number): SubProduct {
    let sP = new SubProduct();
    sP.id = id;

    return sP;
  }



  calculateAmmountForFinishedProduct(fP: FinishedProduct): number {
    let result = (fP.orders + fP.plannedWHEnd - fP.inWaitlist - fP.inProduction - fP.inWarehouse);
    if (result >= 0) {
      return result;
    } else {
      return 0;
    }
  }


  /*  getOrdersByDependencyID(id: number): number {
   let result = 0;
   this.dependencyList.forEach(dependency => {
   if (dependency.id === id) {
   if (dependency.dependencies.length > 1) {
   dependency.dependencies.forEach(item => {
   this.finishedProducts.forEach(product =>{
   if(product.id === item )
   result += product.amountneeded;
   })
   })
   }
   }
   });
   return result
   }*/


  getValuesFromDB(): any {
    return this.db.object('periods/' + (this.mockedPeriod - 1)).valueChanges();
  }


  getWorkPlaceWithWaitlist(): Array<any> {
    let workplacelist = this.values.waitinglistworkstations[0].workplace;
    let resultlist = [];
    workplacelist.forEach(workplace => {
      if (workplace.waitinglist) {
        resultlist.push(workplace)
      }
    });
    return resultlist;
  }


  getAmmountOfWaitlistByID(id: number) {
    let result = 0;
    this.workPlaceWithWaitList.forEach(workplace => {
      workplace.waitinglist.forEach(waitinglist => {
        if (Number(waitinglist.item.item) === id) {
          result += Number(waitinglist.item.amount);
        }
      })
    });
    return result;
  }


  getOrdersInWorkByID(id: number): number {
    let result = 0;
    let workplaces = this.values.ordersinwork[0].workplace;
    if (workplaces) {
      workplaces.forEach(workplace => {
        if (Number(workplace.item.item) === id) {
          result += Number(workplace.item.amount);
        }
      })
    }
    return result;
  }

  getWarehouseAmountByID(id: number): number {
    let result = 0;
    let warehouse = this.values.warehousestock[0].article;
    warehouse.forEach(thing => {
      if (Number(thing.item.id) === id) {
        result += Number(thing.item.amount);
      }
    });
    return result;
  }
}
