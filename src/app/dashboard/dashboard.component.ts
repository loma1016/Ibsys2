import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public allTotalStockValues: Array<any> = [];
  public lineChartData: any[] = [{ data: [] }, { data: [] }];
  public lineChartType:string = 'line';  
  public lineChartLabels: Array<any> = [];
  public option = {
    responsive: false,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {min: 200000, max: 300000}
      }]
    }
  };
  
  public lineChartColors:Array<any> = [
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
  ]

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
    this.db.object('periods').valueChanges().subscribe(periods => {
      for (var period in periods) {
        if (period) {
          this.lineChartLabels.push("Periode " + period);
          this.allTotalStockValues.push(Number(periods[period].warehousestock[0].totalstockvalue[0]));
        }
      }

      this.lineChartData = [
        {data: this.allTotalStockValues, label: 'TotalStockValue'},
        {data: [250000, 250000, 250000], label: 'Target'},        
      ]   
    });
  }
}
