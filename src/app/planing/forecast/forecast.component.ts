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

  {empty: 'Periode', Auftraege: 5, GeplanteAuftraege1: 1.0079, GeplanteAuftraege2: 10, GeplanteAuftraege3: 15},
  {empty: 'P1', Auftraege: 6, GeplanteAuftraege1: 1.0079, GeplanteAuftraege2: 11, GeplanteAuftraege3: 16},
  {empty: 'P2', Auftraege: 7, GeplanteAuftraege1: 1.0079, GeplanteAuftraege2: 12, GeplanteAuftraege3: 17},
  {empty: 'P3', Auftraege: 8, GeplanteAuftraege1: 1.0079, GeplanteAuftraege2: 13, GeplanteAuftraege3: 18},
  {empty: 'Summe', Auftraege: 9, GeplanteAuftraege1: 1.0079, GeplanteAuftraege2: 14, GeplanteAuftraege3: 19},

];
