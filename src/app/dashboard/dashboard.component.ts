import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Total Stock Value Graph
  public allTotalStockValues: Array<any> = [];
  public lineChartData: any[] = [{ data: [] }, { data: [] }];
  public lineChartType: string = 'line';
  public lineChartLabels: Array<any> = [];
  public lineChartTarget: Array<any> = [];
  public lineChartDiff: Array<any> = [];
  public option = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      yAxes: [{
        ticks: { min: 200000, max: 300000 }
      }]
    }
  };

  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.0)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)'
    },
  ];


  // All Stock Values Graph
  public allStockValues: Array<any> = [];
  public startValues: Array<any> = [];
  public barChartData: any[] = [{ data: [] }, { data: [] }];
  public barChartType: string = 'bar';
  public barChartLabels: Array<any> = [];
  public barChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
  };


  // Profit Graph
  public allProfits: Array<any> = [];
  public cumProfits: Array<any> = [];
  public summaryChartData: any[] = [{ data: [] }, { data: [] }];
  public profitChartLabels: Array<any> = [];
  public profitChartOptions = {
    responsive: true,
    maintainAspectRatio: true
  };

  public profitChartColors: Array<any> = [
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.0)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)'
    },
    { // blue
      backgroundColor: 'rgba(7, 137, 232, 0.2)',
      borderColor: 'rgba(0, 147, 255, 0.7)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ]

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
    var context = this;

    // draw Total Stock Value line graph
    var drawTotalStockValue = function (periods) {
      for (var period in periods) {
        if (period) {
          context.lineChartLabels.push('Periode ' + period);
          context.allTotalStockValues.push(Number(periods[period].warehousestock[0].totalstockvalue[0]));
          context.lineChartTarget.push(250000);
          context.lineChartDiff.push(Math.round((Number(periods[period].warehousestock[0].totalstockvalue[0]) - 250000) * 100) / 100);
        }
      }

      context.lineChartData = [
        { data: context.allTotalStockValues, label: 'Gesamter Lagerwert' },
        { data: context.lineChartTarget, label: 'Zielwert' },
      ]
    }

    // draw all Stock Values bar chart
    var drawAllStockValues = function (periods) {
      var period = periods[periods.length - 1];
      for (var item in period.warehousestock[0].article) {
        context.allStockValues.push(period.warehousestock[0].article[item].item.stockvalue);
        context.startValues.push(Math.round(Number(period.warehousestock[0].article[item].item.startamount) * Number(period.warehousestock[0].article[item].item.price)));
        context.barChartLabels.push(period.warehousestock[0].article[item].item.id);
      }

      context.barChartData = [
        { data: context.allStockValues, label: 'Alle Lagerwerte' },
        { data: context.startValues, label: 'Start Werte' }
      ]
    }

    // draw Profit line graph
    var drawProfitSummary = function (periods) {
      for (var period in periods) {
        if (period) {
          context.allProfits.push(Number(periods[period].result[0].summary[0].profit[0].item.current));
          context.cumProfits.push(Number(periods[period].result[0].summary[0].profit[0].item.all))
        }
      }

      context.summaryChartData = [
        { data: context.allProfits, label: 'Profit' },
        { data: context.cumProfits, label: 'Kumulierter Profit' },
      ]
    }

    this.db.object('periods').valueChanges().subscribe(periods => {
      drawTotalStockValue(periods);
      drawAllStockValues(periods);
      drawProfitSummary(periods);
    });
  }
}
