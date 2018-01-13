import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import * as FileSaver from 'file-saver';
import { Observable } from "rxjs";
import { SimulationService } from "../simulation/simulation.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  providers: [SimulationService]
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

  currentPeriod: number;

  previousPeriodData: Observable<any>;

  previousPeriod: any;

  resultData: Observable<any>;

  resultRaw:any;

  simulated = false;

  workspacesCalculated = [];

  simulationResult: any;

  constructor(private db: AngularFireDatabase,  private productionPlanningService: SimulationService, private router: Router) {}

  ngOnInit() {
    this.db.object('currentPeriod').valueChanges().subscribe(currentPeriod => {
      this.currentPeriod = Number(currentPeriod);
      this.previousPeriodData = this.db.object('periods/' + (this.currentPeriod - 1).toString()).valueChanges();
      this.previousPeriodData.subscribe(_ => {

        this.previousPeriod = _;

        this.resultData = this.db.object('result').valueChanges();
        this.resultData.subscribe(result => {

          this.resultRaw = result;

          this.setResult(result);
          this.calculateSales(result);
          this.calculateShiftAndMachineCosts(result);
          this.calculateDispositionCosts(result);
          this.calculateStockValue(result);
          this.calculateWarehouseCosts();

          this.profit = this.sales - (this.costs.shifts + this.costs.machine + this.costs.disposition + this.costs.warehouse);
        });
      });
    });
  }

  simulatePeriod() {
    this.simulationResult = this.productionPlanningService.simulate(this.previousPeriod, this.resultRaw.production, this.resultRaw.disposition.inwardstockmovement, this.currentPeriod);
  }

  getArrayOf(obj): Array<any> {
    return Object.keys(obj);
  }

  getMissingMaterial(material): string {
    let result = '';
    material.forEach( _ => {
      if (_.amount === 0) {
        result += _.material + ' ';
      }
    });

    return result;
  }


  disableSimulation() {
    this.simulated = true;
  }

  refresh() {
    this.router.navigate(['/planning'], { queryParams: { loadData: true } }).then( _ => {
      window.location.reload();
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


    if (result.directsales) {
      result.directsales.forEach(article => {
        this.result.selldirect.item.push({"@": {article:article.id, quantity:article.amount, price:article.price, penalty:article.penalty}})
      });
    }

    if (result.production) {
      result.production.order.forEach(item => {
        this.result.productionlist.production.push({"@": {article:item, quantity: result.production.amount[result.production.item.indexOf(item)]}})
      });
    }

    if (result.workingtimelist) {
      result.workingtimelist.forEach(place => {
        this.result.workingtimelist.workingtime.push({"@": {station: place.station, shift: place.shift, overtime: place.overtime}});

        if ( place.station !==5) {
          this.workspacesCalculated.push(place.shift * 2400 + place.overtime * 5)
        }

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

    this.workspacesCalculated = [];
  }

  exportToXml() {
    var js2xmlparser = require("js2xmlparser");
    var xmlInput = js2xmlparser.parse("input", this.result);
    var blob = new Blob([xmlInput], { type: 'text/xml' });
    FileSaver.saveAs(blob, "export.xml");
  }
}
