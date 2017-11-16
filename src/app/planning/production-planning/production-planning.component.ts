import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs";
import {FinishedProduct} from "./models/finishedProduct-model";
import {SubProduct} from "./models/subProduct-model";
import {Dependency} from "./models/dependency-model";

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
  //Hardcoded Shit
  dependencyList: Array<Dependency> = [
    new Dependency(26, [1, 2, 3]), new Dependency(51, [1]), new Dependency(56, [2]), new Dependency(31, [3]),
    new Dependency(16, [51, 56, 31]), new Dependency(17, [51, 56, 31]), new Dependency(50, [51]), new Dependency(55, [56]), new Dependency(30, [31]),
    new Dependency(4, [50]), new Dependency(10, [50]), new Dependency(49, [50]), new Dependency(5, [55]), new Dependency(11, [55]), new Dependency(54, [55]), new Dependency(6, [30]), new Dependency(12, [30]), new Dependency(29, [30]),
    new Dependency(7, [49]), new Dependency(13, [49]), new Dependency(18, [49]), new Dependency(8, [54]), new Dependency(14, [54]), new Dependency(19, [54]), new Dependency(9, [29]), new Dependency(15, [29]), new Dependency(20, [29])
  ];

  //Initialisierung für 2 Way DataBinding
  finishedProducts: Array<FinishedProduct> = [new FinishedProduct(), new FinishedProduct(), new FinishedProduct()];
  subProducts: Array<SubProduct> = [new SubProduct(), new SubProduct(), new SubProduct(), new SubProduct(), new SubProduct(),
    new SubProduct(), new SubProduct(), new SubProduct(), new SubProduct(), new SubProduct(), new SubProduct(), new SubProduct(),
    new SubProduct(), new SubProduct(), new SubProduct(), new SubProduct(), new SubProduct(), new SubProduct(), new SubProduct(),
    new SubProduct(), new SubProduct(), new SubProduct(), new SubProduct(), new SubProduct(), new SubProduct(), new SubProduct(),];

  //Zwischen Vartiablen
  runner = 0;
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
      this.finishedProducts = [this.setFinishedProduct(1), this.setFinishedProduct(2), this.setFinishedProduct(3)];
      this.subProducts[0] = this.setSubProduct(26);
      this.subProducts[1] = this.setSubProduct(51);
      this.subProducts[2] = this.setSubProduct(56);
      this.subProducts[3] = this.setSubProduct(31);
      this.subProducts[4] = this.setSubProduct(16);
      this.subProducts[5] = this.setSubProduct(17);
      this.subProducts[6] = this.setSubProduct(50);
      this.subProducts[7] = this.setSubProduct(55);
      this.subProducts[8] = this.setSubProduct(30);
      this.subProducts[9] = this.setSubProduct(4);
      this.subProducts[10] = this.setSubProduct(10);
      this.subProducts[11] = this.setSubProduct(49);
      this.subProducts[12] = this.setSubProduct(5);
      this.subProducts[13] = this.setSubProduct(11);
      this.subProducts[14] = this.setSubProduct(54);
      this.subProducts[15] = this.setSubProduct(6);
      this.subProducts[16] = this.setSubProduct(12);
      this.subProducts[17] = this.setSubProduct(29);
      this.subProducts[18] = this.setSubProduct(7);
      this.subProducts[19] = this.setSubProduct(13);
      this.subProducts[20] = this.setSubProduct(18);
      this.subProducts[21] = this.setSubProduct(8);
      this.subProducts[22] = this.setSubProduct(14);
      this.subProducts[23] = this.setSubProduct(19);
      this.subProducts[24] = this.setSubProduct(9);
      this.subProducts[25] = this.setSubProduct(15);
      this.subProducts[26] = this.setSubProduct(20);
      console.log('SubProducts: ', this.subProducts);
      console.log('finished Products: ', this.finishedProducts);
    })
  }

  //ObjektKonstruktoren

  setFinishedProduct(id: number): FinishedProduct {
    let fP = new FinishedProduct();
    fP.id = id;
    fP.orders = this.mockedOrders;
    fP.inWaitlist = this.getWaitlistSumByID(id);
    fP.inProduction = this.getOrdersInWorkByID(id);
    fP.plannedWHEnd = null;
    fP.inWarehouse = this.getWarehouseAmountByID(id);
    fP.amountneeded = ProductionPlanningComponent.calculateAmountForProducts(fP);
    return fP;
  }

  setSubProduct(id: number): SubProduct {
    let sP = new SubProduct();
    sP.id = id;
    sP.dependency = this.getDependenciesByID(id);
    sP.orders = this.getOrdersForSubProduct(sP);
    sP.inWaitlist = this.getWaitlistSumByID(id);
    sP.inProduction = this.getOrdersInWorkByID(id);
    sP.plannedWHEnd = null;
    sP.inWarehouse = this.getWarehouseAmountByID(id);
    sP.amountneeded = ProductionPlanningComponent.calculateAmountForProducts(sP);
    return sP;
  }

  //NgModelChange Methoden

  updateAmmountNeededForFinishedProducts(listPlace: number) {
    this.finishedProducts[listPlace].amountneeded = ProductionPlanningComponent.calculateAmountForProducts(this.finishedProducts[listPlace]);
  }

  updateAmountNeededForSubProducts(listPlace: number) {
    this.subProducts[listPlace].orders = this.getOrdersForSubProduct(this.subProducts[listPlace]);
    this.subProducts[listPlace].amountneeded = ProductionPlanningComponent.calculateAmountForProducts(this.subProducts[listPlace]);
  }

  //Rechnungen

  static calculateAmountForProducts(product: any): number {
    let result = (product.orders + product.plannedWHEnd - product.inWaitlist - product.inProduction - product.inWarehouse);
    if (result >= 0) {
      return result;
    } else {
      return 0;
    }
  }

  //ExtractValues

  getOrdersForSubProduct(product: SubProduct): number {
    let result = 0;
    product.dependency.forEach(dependency => {
      result += this.getAmountneededOfFinishedProductByID(dependency);
      result += this.getAmountneededOFSubProductByID(dependency);
    });
    return result;
  }

  getAmountneededOfFinishedProductByID(id: number): number {
    let result = 0;
    this.finishedProducts.forEach(product => {
      if (product.id === id) {
        result += product.amountneeded;
      }
    });
    return result;
  }

  getAmountneededOFSubProductByID(id: number): number {
    let result = 0;
    this.subProducts.forEach(subProduct => {
      if (subProduct.id === id) {
        result += subProduct.amountneeded
      }
    });
    return result;
  }


  getDependenciesByID(id: number): Array<number> {
    let resultlist = [];
    this.dependencyList.forEach(dependency => {
      if (dependency.id === id) {
        resultlist = dependency.dependencies;
      }
    });
    return resultlist;
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

  getWaitlistSumByID(id: number) {
    let result = 0;
    this.workPlaceWithWaitList.forEach(workplace => {
      workplace.waitinglist.forEach(waitinglist => {
        if (Number(waitinglist.item.item) === id) {
          result += Number(waitinglist.item.amount);
        }
      })
    });
    //console.log('Waitlist ItemID: ' +id + 'Amount: ' + result)
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

  //VALUES FROM DATABASE

  getValuesFromDB(): any {
    return this.db.object('periods/' + (this.mockedPeriod - 1)).valueChanges();
  }
}
