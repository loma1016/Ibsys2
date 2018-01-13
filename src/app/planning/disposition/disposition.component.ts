import { Component, OnInit } from '@angular/core';
import { ordersData } from './disposition.data';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { ToastyServiceInt } from "../../util/toasty.service";

@Component({
  selector: 'app-disposition',
  templateUrl: './disposition.component.html',
  styleUrls: ['./disposition.component.css']
})
export class DispositionComponent implements OnInit {

  currentPeriod: number;

  ordersData = ordersData;

  forecast: any;

  productionPlan: any;

  previousStockValue = 0;

  previousPeriodData: Observable<any>;

  previousPeriod: any;

  forecastData: Observable<any>;

  plannedStockData: Observable<any>;

  newOrderData = {item:0, amount:0, mode:5, modeLabel: 'normal'};

  constructor(private db: AngularFireDatabase,  private toastyService: ToastyServiceInt) { }

  ngOnInit() {

    this.calculateDeliveryTime();

    this.db.object('currentPeriod').valueChanges().subscribe(currentPeriod => {
      this.currentPeriod = Number(currentPeriod);
      this.previousPeriodData = this.db.object('periods/' + (this.currentPeriod - 1).toString()).valueChanges();
      this.previousPeriodData.subscribe(_ => {

        this.previousPeriod = _;

        _.warehousestock[0].article.forEach(article => {
          if (this.ordersData.index.indexOf(Number(article.item.id)) >= 0) {
            this.ordersData[article.item.id].inStock = Number(article.item.amount);
          }
        });

        if(_.futureinwardstockmovement[0]) {
          _.futureinwardstockmovement[0].order.forEach(item => {
            if (this.ordersData.index.indexOf(Number(item.item.article)) >= 0) {
              this.ordersData[item.item.article].futureInwardStockMovement.amount = Number(item.item.amount);
              this.ordersData[item.item.article].futureInwardStockMovement.orderPeriod = Number(item.item.orderperiod);
              this.ordersData[item.item.article].futureInwardStockMovement.mode = Number(item.item.mode);
            }
          });
        }

        if(_.warehousestock[0]) {
          this.previousStockValue = Number(_.warehousestock[0].totalstockvalue[0]);
        }

        this.forecastData = this.db.object('result/forecast').valueChanges();
        this.forecastData.subscribe(result => {
          this.forecast = result;
          this.plannedStockData = this.db.object('result/production').valueChanges();
          this.plannedStockData.subscribe(result => {
            this.productionPlan = result;
            this.calculateDisposition()
        });
      });
    });
  });
  }

  calculateDisposition() {

    let p1 = this.forecast[0].inputs;
    let p2 = this.forecast[1].inputs;
    let p3 = this.forecast[2].inputs;
    let p4 = this.forecast[3].inputs;

    this.ordersData.index.forEach(index => {
      this.ordersData[index].result.normalOrder = 0;
      this.ordersData[index].result.expressOrder = 0;
    });

    this.ordersData.index.forEach(index => {
      let orderData = this.ordersData[index];
      let startAmount = orderData.inStock;
      let stockMovement = null;
      if (orderData.futureInwardStockMovement.amount) {
        stockMovement = orderData.futureInwardStockMovement;
      }

      for (let i = 0; i < 40; i++) {

        if (stockMovement && stockMovement.mode === 5 && (orderData.deliveryTime.normal - ((this.currentPeriod - stockMovement.orderPeriod) * 5)) === i) {
          startAmount += stockMovement.amount;
        } else if (stockMovement && stockMovement.mode === 4 && (orderData.deliveryTime.express - ((this.currentPeriod - stockMovement.orderPeriod) * 5)) === i) {
          startAmount += stockMovement.amount;
        }

        if (i < 5) {
          orderData.usedIn.details.forEach(entry => {
            startAmount -= (this.productionPlan.amount[this.productionPlan.item.indexOf(entry.article)] * entry.amount) *0.2;
          });

        } else if (i < 10) {
          startAmount -= (orderData.usedIn.p1 * Number(p2.P1) * 0.2) + (orderData.usedIn.p2 * Number(p2.P2) * 0.2) + (orderData.usedIn.p3 * Number(p2.P3) * 0.2);

        } else if (i < 15) {
          startAmount -= (orderData.usedIn.p1 * Number(p3.P1) * 0.2) + (orderData.usedIn.p2 * Number(p3.P2) * 0.2) + (orderData.usedIn.p3 * Number(p3.P3) * 0.2);

        } else if (i < 20) {
          startAmount -= (orderData.usedIn.p1 * Number(p4.P1) * 0.2) + (orderData.usedIn.p2 * Number(p4.P2) * 0.2) + (orderData.usedIn.p3 * Number(p4.P3) * 0.2);

        } else {
          startAmount -= (orderData.usedIn.p1 * ((Number(p1.P1) + Number(p2.P1) + Number(p3.P1) + Number(p4.P1)) / 4) / 5) +
            (orderData.usedIn.p2 * ((Number(p1.P1) + Number(p2.P1) + Number(p3.P1) + Number(p4.P1)) / 4) / 5) +
            (orderData.usedIn.p3 * ((Number(p1.P1) + Number(p2.P1) + Number(p3.P1) + Number(p4.P1)) / 4) / 5);
        }

        if (startAmount < 0) {
          if (orderData.deliveryTime.normal + 5 <= i+1) {
            break;
          } else if (orderData.deliveryTime.normal <= i+1) {
            this.ordersData[index].result.normalOrder = orderData.discontAmount;
            break;
          } else if (orderData.deliveryTime.express <= i+1) {
            this.ordersData[index].result.expressOrder = orderData.discontAmount;
            break;
          } else {
            this.ordersData[index].result.expressOrder = orderData.discontAmount;
            break;
          }
        }

      }

    });
    this.saveResult();
  }

  sliderChangeEvent(event) {
    if (event.checked) {
      this.newOrderData.modeLabel = 'express';
      this.newOrderData.mode = 4;
    } else {
      this.newOrderData.modeLabel = 'normal';
      this.newOrderData.mode = 5;
    }
  }

  newOrder(){
    if (this.ordersData.index.indexOf(Number(this.newOrderData.item)) >= 0) {
      this.ordersData[Number(this.newOrderData.item)].result.normalOrder = 0;
      this.ordersData[Number(this.newOrderData.item)].result.expressOrder = 0;
      if (this.newOrderData.mode === 4) {
        this.ordersData[Number(this.newOrderData.item)].result.expressOrder = Number(this.newOrderData.amount);
      } else if (this.newOrderData.mode === 5) {
        this.ordersData[Number(this.newOrderData.item)].result.normalOrder = Number(this.newOrderData.amount);
      }
      this.saveResult();
    } else {
      this.toastyService.setToastyDefaultError('Fehler', 'Bitte geben Sie eine korrekte Kaufteilnummer ein!');
    }
  }

  saveResult() {

    let disposition = [];
    let inwardStockMovement = [];

    this.ordersData.index.forEach(index => {
      let orderData = this.ordersData[index];
      let stockMovement = null;
      if (orderData.futureInwardStockMovement.amount) {
        stockMovement = orderData.futureInwardStockMovement;
      }

      if (orderData.result.normalOrder) {
        disposition.push({
          article: index,
          quantity: orderData.result.normalOrder,
          modus: 5
        });

        if (orderData.deliveryTime.mean <= 5) {
          inwardStockMovement.push({
            article: index,
            quantity:  orderData.result.normalOrder,
            orderPeriod: this.currentPeriod,
            deliveryTime: orderData.deliveryTime.mean+1,
            price: orderData.price,
            discontAmount: orderData.discontAmount,
            orderCost: orderData.orderCost,
            modus: 5
          });
        }

      } else if (orderData.result.expressOrder) {
        disposition.push({
          article: index,
          quantity: orderData.result.expressOrder,
          modus: 4
        });

        if (orderData.deliveryTime.express <= 5) {
          inwardStockMovement.push({
            article: index,
            quantity:  orderData.result.expressOrder,
            orderPeriod: this.currentPeriod,
            deliveryTime: orderData.deliveryTime.express,
            price: orderData.price,
            discontAmount: orderData.discontAmount,
            orderCost: orderData.orderCost,
            modus: 4
          });
        }

      }

      if (stockMovement && stockMovement.mode === 5 && (orderData.deliveryTime.mean - ((this.currentPeriod - stockMovement.orderPeriod) * 5)) <= 5) {
        inwardStockMovement.push({
          article: index,
          quantity: stockMovement.amount,
          orderPeriod: stockMovement.orderPeriod,
          deliveryTime: orderData.deliveryTime.mean+1,
          price: orderData.price,
          discontAmount: orderData.discontAmount,
          orderCost: orderData.orderCost,
          modus: 5
        });
      } else if (stockMovement && stockMovement.mode === 4 && (orderData.deliveryTime.express - ((this.currentPeriod - stockMovement.orderPeriod) * 5)) <= 5) {
        inwardStockMovement.push({
          article: index,
          quantity: stockMovement.amount,
          orderPeriod: stockMovement.orderPeriod,
          deliveryTime: orderData.deliveryTime.express,
          price: orderData.price,
          discontAmount: orderData.discontAmount,
          orderCost: orderData.orderCost,
          modus: 4
        });
      }
    });

    this.db.object('/result/disposition').set({
      orders: disposition,
      inwardstockmovement: inwardStockMovement,
      priveousstockvalue: this.previousStockValue
    });
  }

  calculateDeliveryTime() {
    this.ordersData.index.forEach(index => {
      this.ordersData[index].deliveryTime.express = Math.trunc(this.ordersData[index].deliveryTime.mean / 2 +1);
      this.ordersData[index].deliveryTime.normal = Math.trunc(this.ordersData[index].deliveryTime.mean + this.ordersData[index].deliveryTime.dev  + 2);
    });
  }
}

