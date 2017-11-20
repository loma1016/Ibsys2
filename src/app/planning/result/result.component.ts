import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  result =  {
    sellwish: [],
    selldirect: [],
    orderlist: [],
    productionlist: [],
    workingtimelist: []
  };

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.db.object('result').valueChanges().subscribe(result=> {
      console.log(result);
      this.result.sellwish = [
        {article:1, quantity:Number((result as any).forecast[0].inputs.P1)},
        {article:2, quantity: Number((result as any).forecast[0].inputs.P2)},
        {article:3, quantity: Number((result as any).forecast[0].inputs.P3)}
      ];
      this.result.selldirect = [
        {article:1, quantity:0, price:0, penalty:0},
        {article:2, quantity:0, price:0, penalty:0},
        {article:2, quantity:0, price:0, penalty:0}
      ];
      this.result.orderlist = (result as any).disposition;
      if ((result as any).production) {
        (result as any).production.item.forEach((item, index) => {
          this.result.productionlist.push({article:item, quantity: (result as any).production.amount[index]})
        });
      }
      this.result.workingtimelist = (result as any).workingtimelist;
    });
  }


  exportToXml() {

  }

}
