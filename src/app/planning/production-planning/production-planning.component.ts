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
  previousPeriodData: Observable<any>;
  forecastData: Observable<any>;
  forecast: any;
  workPlaceWithWaitList: Array<any> = [];
  values: any;

  subProductsIndex = [26,51,56,31,16,17,50,55,30,4,10,49,5,11,54,6,12,29,7,13,18,8,14,19,9,15,20];

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.db.object('currentPeriod').valueChanges().subscribe(currentPeriod => {
      this.previousPeriodData = this.db.object('periods/' + (Number(currentPeriod)-1).toString()).valueChanges();
      this.previousPeriodData.subscribe(values=>{
        this.values = values;
        this.workPlaceWithWaitList = this.getWorkPlaceWithWaitlist();
        this.finishedProducts = [this.setFinishedProduct(1), this.setFinishedProduct(2), this.setFinishedProduct(3)];
        this.subProductsIndex.forEach((subProductIndex, index) => {
          this.subProducts[index] = this.setSubProduct(subProductIndex);
        });
        this.forecastData = this.db.object('result/forecast').valueChanges();
        this.forecastData.subscribe(forecast=> {
          this.forecast = forecast;
          this.updateOrders();
          this.updateAmmountNeededForFinishedProducts();
        });
      });
    });
  }

  updateOrders(){
    this.finishedProducts[0].orders = Number(this.forecast[0].inputs.P1);
    this.finishedProducts[1].orders = Number(this.forecast[0].inputs.P2);
    this.finishedProducts[2].orders = Number(this.forecast[0].inputs.P3);
  }

  //ObjektKonstruktoren

  setFinishedProduct(id: number): FinishedProduct {
    let fP = new FinishedProduct();
    fP.id = id;
    fP.orders = this.mockedOrders;
    fP.inWaitlist = this.getWaitlistSumByID(id);
    fP.inProduction = this.getOrdersInWorkByID(id);
    fP.plannedWHEnd = 100;
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
    if (id === 16 || id === 17 || id === 26) {
      sP.plannedWHEnd = 300;
    } else {
      sP.plannedWHEnd = 100;
    }
    sP.inWarehouse = this.getWarehouseAmountByID(id);
    sP.amountneeded = ProductionPlanningComponent.calculateAmountForProducts(sP);
    return sP;
  }

  //NgModelChange Methoden

  updateAmmountNeededForFinishedProducts() {
    this.finishedProducts.forEach((finishedProduct, index) => {
      this.finishedProducts[index].amountneeded = ProductionPlanningComponent.calculateAmountForProducts(finishedProduct);
    });
    this.updateAmountNeededForSubProducts();
  }



  updateAmountNeededForSubProducts() {
    this.subProducts.forEach((subProduct, index) => {
      this.subProducts[index].orders = this.getOrdersForSubProduct(subProduct);
      this.subProducts[index].amountneeded = ProductionPlanningComponent.calculateAmountForProducts(subProduct);
    });
    this.saveResult();
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

  saveResult() {
    let result = {item:[], amount:[]};

    this.finishedProducts.forEach((finishedProduct) => {
      result.item.push(finishedProduct.id);
      result.amount.push(finishedProduct.amountneeded);
    });
    this.subProducts.forEach((subProduct) => {
      result.item.push(subProduct.id);
      result.amount.push(subProduct.amountneeded);
    });
    this.db.object('/result/production').update(result);

  }
}
