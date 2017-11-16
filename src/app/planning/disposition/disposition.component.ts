import { Component, OnInit } from '@angular/core';
import { ordersData } from './disposition.data';
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from "rxjs";

@Component({
  selector: 'app-disposition',
  templateUrl: './disposition.component.html',
  styleUrls: ['./disposition.component.css']
})
export class DispositionComponent implements OnInit {

  currentPeriod: number;

  ordersData = ordersData;

  forcast: any;

  previousPeriodData: Observable<any>;

  forecastData: Observable<any>;

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.db.object('currentPeriod').valueChanges().subscribe(currentPeriod => {
      this.currentPeriod = Number(currentPeriod);
      this.previousPeriodData = this.db.object('periods/' + (this.currentPeriod-1).toString()).valueChanges();
      this.previousPeriodData.subscribe(_=> {

        _.warehousestock[0].article.forEach( article => {
          if (this.ordersData.index.indexOf(Number(article.item.id)) >= 0) {
            this.ordersData[article.item.id].inStock = Number(article.item.amount);
          }
        });
        _.futureinwardstockmovement[0].order.forEach( item => {
          if (this.ordersData.index.indexOf(Number(item.item.article)) >=0 ) {
            this.ordersData[item.item.article].futureInwardStockMovement.amount = Number(item.item.amount);
            this.ordersData[item.item.article].futureInwardStockMovement.orderPeriod = Number(item.item.orderperiod);
            this.ordersData[item.item.article].futureInwardStockMovement.mode = Number(item.item.mode);
          }
        });
        this.forecastData = this.db.object('result/forecast').valueChanges();
        this.forecastData.subscribe(forecast=> {
          this.forcast = forecast;
          this.calculateDisposition()

        });

      });


    });
  }

  calculateDisposition() {
    let p1 = this.forcast[0].inputs;
    let p2 = this.forcast[1].inputs;
    let p3 = this.forcast[2].inputs;
    let p4 = this.forcast[3].inputs;

    this.ordersData.index.forEach(index => {
      let orderData = this.ordersData[index];
      let startAmount = orderData.inStock;
      let stockMovement = null;
      if (orderData.futureInwardStockMovement.amount) {
        stockMovement = orderData.futureInwardStockMovement;
      }

      for (let i = 0; i <40; i++) {

        if (stockMovement && stockMovement.mode === 5 && (orderData.deliveryTime.normal-((this.currentPeriod-stockMovement.orderPeriod)*5)) === i) {
          startAmount += stockMovement.amount;
        } else if (stockMovement && stockMovement.mode === 4 && (orderData.deliveryTime.express-((this.currentPeriod-stockMovement.orderPeriod)*5)) === i) {
          startAmount += stockMovement.amount;
        }

        if ( i <5) {
          startAmount -= (orderData.usedIn.p1* Number(p1.P1)*0.2)+(orderData.usedIn.p2* Number(p1.P2)*0.2)+(orderData.usedIn.p3* Number(p1.P3)*0.2);

        } else if (i <10 ) {
          startAmount -= (orderData.usedIn.p1* Number(p2.P1)*0.2)+(orderData.usedIn.p2* Number(p2.P2)*0.2)+(orderData.usedIn.p3* Number(p2.P3)*0.2);

        } else if (i <15) {
          startAmount -= (orderData.usedIn.p1* Number(p3.P1)*0.2)+(orderData.usedIn.p2* Number(p3.P2)*0.2)+(orderData.usedIn.p3* Number(p3.P3)*0.2);

        } else if (i <20) {
          startAmount -= (orderData.usedIn.p1* Number(p4.P1)*0.2)+(orderData.usedIn.p2* Number(p4.P2)*0.2)+(orderData.usedIn.p3* Number(p4.P3)*0.2);

        } else {
          startAmount -= (orderData.usedIn.p1* ((Number(p1.P1)+Number(p2.P1)+Number(p3.P1)+Number(p4.P1))/4)/5)+
                         (orderData.usedIn.p2* ((Number(p1.P1)+Number(p2.P1)+Number(p3.P1)+Number(p4.P1))/4)/5)+
                         (orderData.usedIn.p3* ((Number(p1.P1)+Number(p2.P1)+Number(p3.P1)+Number(p4.P1))/4)/5);
        }

        if (startAmount < 0) {
          if (orderData.deliveryTime.normal+5 < i) {
            break
          } else if (orderData.deliveryTime.normal < i) {
            this.ordersData[index].result.normalOrder = orderData.discontAmount;
            break
          } else if (orderData.deliveryTime.express < i) {
            this.ordersData[index].result.expressOrder = orderData.discontAmount;
            break
          } else {
            this.ordersData[index].result.expressOrder = orderData.discontAmount;
            break
          }
        }

      }

    });

    let result = {};

    this.ordersData.index.forEach(index => {
      if (this.ordersData[index].result.normalOrder || this.ordersData[index].result.expressOrder ) {
        result[index] = {normalOrder: this.ordersData[index].result.normalOrder, expressOrder: this.ordersData[index].result.expressOrder }
      }
    });

    this.db.object('/result/disposition').update(result);


  }
}

