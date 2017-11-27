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
  profit = 0;

  stockValue = {
    previous: 0,
    current: 0,
  };

  costs = {
    shifts: 0,
    machine: 0,
    disposition: 0,
    warehouse: 0,
  };

  costsData = {
    shifts : {
      first: 0.45,
      second: 0.55,
      third: 0.70,
      overtime: 0.90
    },

    machineVar: [0.05, 0.05, 0.05, 0.05, 0.00, 0.30, 0.30, 0.30, 0.80, 0.30, 0.30, 0.30, 0.50, 0.05, 0.05],
    machineFix: [0.01, 0.01, 0.01, 0.01, 0.00, 0.10, 0.10, 0.10, 0.25, 0.10, 0.10, 0.10, 0.15, 0.01, 0.01],
    productValue: {
      p1: 156.13,
      p2: 163.33,
      p3: 165.08
    }
  };

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.db.object('result').valueChanges().subscribe(result=> {

      console.log(result);

      this.setResult(result);

      this.calculateSales(result);

      this.calculateShiftAndMachineCosts(result);

      this.calculateDispositionCosts(result);

      this.calculateStockValue(result);

      this.calculateWarehouseCosts();

      this.profit = this.sales - (this.costs.shifts + this.costs.machine + this.costs.disposition + this.costs.warehouse);
      console.log(this.costs);
      console.log(this.sales);
      console.log(this.profit);
      console.log(this.stockValue);

    });
  }

  calculateStockValue(result: any) {
    let stockValue = this.stockValue.previous + this.costs.disposition  - (
      Number(result.forecast[0].inputs.P1*this.costsData.productValue.p1) +
      Number(result.forecast[0].inputs.P2*this.costsData.productValue.p2) +
      Number(result.forecast[0].inputs.P3*this.costsData.productValue.p3)
    );

    this.stockValue.current = Math.round((this.stockValue.previous+stockValue)/2);
  }

  calculateWarehouseCosts() {
    let warehouseCost = 0;

    if(this.stockValue.current <=250000) {
      warehouseCost = this.stockValue.current*0.006;
    } else {
      warehouseCost = 250000*0.006 + (this.stockValue.current-250000)*0.012 + 5000;
    }
    this.costs.warehouse = Math.round(warehouseCost);
  }

  calculateDispositionCosts(result: any) {
    let dispositionCost = 0;

    result.disposition.inwardstockmovement.forEach( order => {
      if (order.quantity < order.discontAmount) {
        dispositionCost += order.quantity * order.price;
      } else {
        dispositionCost += (order.quantity * order.price) * 0.9;
      }

      if (order.modus === 4) {
        dispositionCost += 10 * order.orderCost;
      } else if (order.modus === 5) {
        dispositionCost += + order.orderCost;
      }
    });

    this.costs.disposition = Math.round(dispositionCost);
  }


  calculateShiftAndMachineCosts(result: any) {
    let wageCost = 0;
    let machineCost = 0;

    result.workingtimelist.forEach((place,index) => {
      if (place.shift === 1) {
        wageCost += 2400*this.costsData.shifts.first + place.overtime*5*this.costsData.shifts.overtime;
      } else if (place.shift === 2) {
        wageCost += 2400*this.costsData.shifts.first + 2400*this.costsData.shifts.second + place.overtime*5*this.costsData.shifts.overtime;
      } else if (place.shift === 3) {
        wageCost += 2400*this.costsData.shifts.first + 2400*this.costsData.shifts.second +  2400*this.costsData.shifts.third;
      }

      machineCost += (2400 * place.shift + place.overtime*5)*this.costsData.machineVar[index];

      this.costs.machine = Math.round(machineCost);
      this.costs.shifts = Math.round(wageCost);
    });
  }

  calculateSales(result: any) {
    this.sales = 200* (Number(result.forecast[0].inputs.P1) + Number(result.forecast[0].inputs.P2) + Number(result.forecast[0].inputs.P3));
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
      if (result.disposition.priveousstockvalue) {
        this.stockValue.previous = result.disposition.priveousstockvalue;
      }
      if (result.disposition.orders) {
        result.disposition.orders.forEach(order => {
          this.result.orderlist.order.push({"@": {article:order.article, quantity: order.quantity, modus: order.modus}})
        });
      }
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
