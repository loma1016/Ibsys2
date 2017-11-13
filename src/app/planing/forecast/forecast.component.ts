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
  displayedColumns = ['empty', 'Auftraege', 'GeplanteAuftraege1', 'GeplanteAuftraege2', 'GeplanteAuftraege3'];
  //dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

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

export interface Element {
  empty: string;
  Auftraege: number;
  GeplanteAuftraege1: number;
  GeplanteAuftraege2: number;
  GeplanteAuftraege3: number;
}

/*

const ELEMENT_DATA: Element[] = [
  {empty: 'Periode', Auftraege: 1, GeplanteAuftraege1: 2, GeplanteAuftraege2: 3, GeplanteAuftraege3: 4},
  {empty: 'P1', Auftraege: 100, GeplanteAuftraege1: 50, GeplanteAuftraege2: 75, GeplanteAuftraege3: 100},
  {empty: 'P2', Auftraege: 100, GeplanteAuftraege1: 50, GeplanteAuftraege2: 75, GeplanteAuftraege3: 100},
  {empty: 'P3', Auftraege: 100, GeplanteAuftraege1: 50, GeplanteAuftraege2: 75, GeplanteAuftraege3: 100},
  {empty: 'Summe', Auftraege: 300, GeplanteAuftraege1: 150, GeplanteAuftraege2: 225, GeplanteAuftraege3: 300},
];

*/
