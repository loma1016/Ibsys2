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
      this.previousPeriodData = this.db.object('periods/' + (Number(currentPeriod)-1).toString()).valueChanges();
      this.previousPeriodData.subscribe(_=> {
        console.log(_);

        _.warehousestock[0].article.forEach( article => {
          if (this.ordersData.index.indexOf(Number(article.item.id)) >= 0) {
            this.ordersData[article.item.id].inStock = article.item.amount;
          }
        });
        this.forecastData = this.db.object('result/forecast').valueChanges();
        this.forecastData.subscribe(forecast=> {
          this.forcast = forecast;
          this.calculateDisposition()

        });



        console.log(this.ordersData);

      });


    });
  }

  calculateDisposition() {
    let p1 = this.forcast[0].inputs;
    let p2 = this.forcast[1].inputs;
    let p3 = this.forcast[2].inputs;
    let p4 = this.forcast[3].inputs;

    this.ordersData.index.forEach(index => {
      let startAmount = this.ordersData[index].inStock;


      console.log(startAmount);


      for (let i = 0; i <20; i++) {
        if ( i <5) {
          startAmount -= (this.ordersData[index].usedIn.p1* p1.P1*0.2)+(this.ordersData[index].usedIn.p2* p1.P2*0.2)+(this.ordersData[index].usedIn.p3* p1.P3*0.2);

        } else if (i <10 ) {
          startAmount -= (this.ordersData[index].usedIn.p1* p2.P1*0.2)+(this.ordersData[index].usedIn.p2* p2.P2*0.2)+(this.ordersData[index].usedIn.p3* p2.P3*0.2);

        } else if (i <15) {
          startAmount -= (this.ordersData[index].usedIn.p1* p3.P1*0.2)+(this.ordersData[index].usedIn.p2* p3.P2*0.2)+(this.ordersData[index].usedIn.p3* p3.P3*0.2);

        } else if (i <20) {
          startAmount -= (this.ordersData[index].usedIn.p1* p4.P1*0.2)+(this.ordersData[index].usedIn.p2* p4.P2*0.2)+(this.ordersData[index].usedIn.p3* p4.P3*0.2);

        }

        if (startAmount < 0) {
          if (this.ordersData[index].diliveryTime.normal+5 < i) {
            console.log("next period n");
            break
          } else if (this.ordersData[index].diliveryTime.normal < i) {
            this.ordersData[index].result.normalOrder = this.ordersData[index].discontAmount;
            console.log("this period n");
            break
          } else if (this.ordersData[index].diliveryTime.express < i) {
            this.ordersData[index].result.expressOrder = this.ordersData[index].discontAmount;
            console.log("this period e");
            break
          } else {
            this.ordersData[index].result.expressOrder = this.ordersData[index].discontAmount;
            console.log("also this period e");
            break
          }
        }
        console.log(i);
        console.log(startAmount);

      }

      console.log('_____________________')
    });
  }
}

