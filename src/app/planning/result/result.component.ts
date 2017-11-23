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

  sales = 0;

  costs = {
    shifts: 0,
    machine: 0
  };

  costsData = {
    shifts : {
      first: 0.45,
      second: 0.55,
      third: 0.70,
      overtime: 0.90
    },
    machine: [0.06,0.06,0.06,0.06,0,0.4,0.4,0.4,1.05,0.4,0.4,0.4,0.65,0.06,0.06]
  };

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.db.object('result').valueChanges().subscribe(result=> {

      this.setResult(result);

      console.log(result);

      this.sales = 200* (Number((result as any).forecast[0].inputs.P1) + Number((result as any).forecast[0].inputs.P2) + Number((result as any).forecast[0].inputs.P3));

      let wageCost = 0;
      let machineCost = 0;
      (result as any).workingtimelist.forEach((place,index) => {
        if (place.shift === 1) {
          wageCost += 2400*this.costsData.shifts.first + place.overtime*5*this.costsData.shifts.overtime;

        } else if (place.shift === 2) {
          wageCost += 2400*this.costsData.shifts.first + 2400*this.costsData.shifts.second + place.overtime*5*this.costsData.shifts.overtime;
        } else if (place.shift === 3) {
          wageCost += 2400*this.costsData.shifts.first + 2400*this.costsData.shifts.second +  2400*this.costsData.shifts.third;
        }

        machineCost += (2400 * place.shift + place.overtime*5)*this.costsData.machine[index];



        this.costs.machine = Math.round(machineCost);
        this.costs.shifts = Math.round(wageCost);
      });

      console.log(this.costs);
    });
  }

  setResult(result: any) {

    this.resetResult();

    this.result.sellwish.item = [
      {"@": {article:1, quantity: Number(result.forecast[0].inputs.P1)}},
      {"@": {article:2, quantity: Number(result.forecast[0].inputs.P2)}},
      {"@": {article:3, quantity: Number(result.forecast[0].inputs.P3)}}
    ];
    this.result.selldirect.item = [
      {"@": {article:1, quantity:0, price:0, penalty:0}},
      {"@": {article:2, quantity:0, price:0, penalty:0}},
      {"@": {article:2, quantity:0, price:0, penalty:0}}
    ];

    if (result.production) {
      result.production.item.forEach((item, index) => {
        this.result.productionlist.production.push({"@": {article:item, quantity: result.production.amount[index]}})
      });
    }

    if (result.workingtimelist) {
      result.workingtimelist.forEach(place => {
        this.result.workingtimelist.workingtime.push({"@": {station: place.station, schift: place.shift, overtime: place.overtime}})
      });
    }

    if (result.disposition) {
      result.disposition.forEach(order => {
        this.result.orderlist.order.push({"@": {article:order.article, quantity: order.quantity, modus: order.modus}})
      });
    }
  }

  resetResult(){
    this.result =  {
      qualitycontrol: {"@": {type:"no", losequantity: "0", delay:"0"}},
      sellwish: {item:[]},
      selldirect: {item:[]},
      orderlist: {order:[]},
      productionlist: {production:[]},
      workingtimelist: {workingtime:[]},
    };
  }

  exportToXml() {
    var js2xmlparser = require("js2xmlparser");
    var xmlInput = js2xmlparser.parse("input", this.result);
    var blob = new Blob([xmlInput], { type: 'text/xml' });
    FileSaver.saveAs(blob, "export.xml");
  }
}
