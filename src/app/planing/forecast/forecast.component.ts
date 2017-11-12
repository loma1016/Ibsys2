import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {

  displayedColumns = ['empty', 'Auftraege', 'GeplanteAuftraege1', 'GeplanteAuftraege2', 'GeplanteAuftraege3'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

  constructor() { }

  ngOnInit() {
  }
}

export interface Element {
  empty: string;
  Auftraege: number;
  GeplanteAuftraege1: number;
  GeplanteAuftraege2: number;
  GeplanteAuftraege3: number;
}

const ELEMENT_DATA: Element[] = [
  {empty: 'Periode', Auftraege: 1, GeplanteAuftraege1: 2, GeplanteAuftraege2: 3, GeplanteAuftraege3: 4},
  {empty: 'P1', Auftraege: 100, GeplanteAuftraege1: 50, GeplanteAuftraege2: 75, GeplanteAuftraege3: 100},
  {empty: 'P2', Auftraege: 100, GeplanteAuftraege1: 50, GeplanteAuftraege2: 75, GeplanteAuftraege3: 100},
  {empty: 'P3', Auftraege: 100, GeplanteAuftraege1: 50, GeplanteAuftraege2: 75, GeplanteAuftraege3: 100},
  {empty: 'Summe', Auftraege: 300, GeplanteAuftraege1: 150, GeplanteAuftraege2: 225, GeplanteAuftraege3: 300},
];
