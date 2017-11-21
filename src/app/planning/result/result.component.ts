import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  result =  {
    qualitycontrol: {"@": {type:"no", losequantity: "0", delay:"0"}},
    sellwish: {item:[]},
    selldirect: {item:[]},
    orderlist: {order:[]},
    productionlist: {production:[]},
    workingtimelist: {workingtime:[]},
  };

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.db.object('result').valueChanges().subscribe(result=> {
      this.result.sellwish.item = [
        {"@": {article:1, quantity:Number((result as any).forecast[0].inputs.P1)}},
        {"@": {article:2, quantity: Number((result as any).forecast[0].inputs.P2)}},
        {"@": {article:3, quantity: Number((result as any).forecast[0].inputs.P3)}}
      ];
      this.result.selldirect.item = [
        {"@": {article:1, quantity:0, price:0, penalty:0}},
        {"@": {article:2, quantity:0, price:0, penalty:0}},
        {"@": {article:2, quantity:0, price:0, penalty:0}}
      ];

      if ((result as any).production) {
        (result as any).production.item.forEach((item, index) => {
          this.result.productionlist.production.push({"@": {article:item, quantity: (result as any).production.amount[index]}})
        });
      }

      if ((result as any).workingtimelist) {
        (result as any).workingtimelist.forEach(place => {
          this.result.workingtimelist.workingtime.push({"@": {station: place.station, schift: place.shift, overtime: place.overtime}})
        });
      }

     if ((result as any).disposition) {
        (result as any).disposition.forEach(order => {
          this.result.orderlist.order.push({"@": {article:order.article, quantity: order.quantity, modus: order.modus}})
        });
      }

    });
  }


  exportToXml() {
    console.log(this.result);
    var js2xmlparser = require("js2xmlparser");
    var xmlInput = js2xmlparser.parse("input", this.result);
    var blob = new Blob([xmlInput], { type: 'text/xml' });
    FileSaver.saveAs(blob, "export.xml");
  }
}
