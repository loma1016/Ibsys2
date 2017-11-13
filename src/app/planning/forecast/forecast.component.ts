import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {
  forecastPeriod: any[] = [];
  sumFirst: number;
  sumSecond: number;
  sumThird: number;
  sumFourth: number;
  curPeriod = 3;

  constructor() { 
    this.forecastPeriod = [
      {period: 'first', inputs: []},
      {period: 'second', inputs: []},
      {period: 'third', inputs: []},
      {period: 'fourth', inputs: []},
    ];
  }

  ngOnInit() {
  }

  onlyNumbers(e) {
    return e.charCode >= 48 && e.charCode <= 57
  }

  checkSum() {
    this.forecastPeriod.forEach((p, index) => {
      if (p.inputs.P1 && p.inputs.P2 && p.inputs.P3) {
        var sum = Number(p.inputs.P1) + Number(p.inputs.P2) + Number(p.inputs.P3)
        switch (index) {
          case 0: {
            this.sumFirst = sum;
            break;
          }
          case 1: {
            this.sumSecond = sum;
            break;
          }
          case 2: {
            this.sumThird = sum;
            break;
          }
          case 3: {
            this.sumFourth = sum;
            break;
          }
        }
      }
    });
  }
}