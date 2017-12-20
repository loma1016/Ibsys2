import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

@Component({
  selector: 'app-direct-sales',
  templateUrl: './direct-sales.component.html',
  styleUrls: ['./direct-sales.component.css']
})
export class DirectSalesComponent implements OnInit {

  otherProduct = {
    id: null,
    amount:null,
    price:null,
    penalty:null
  };


  constructor(private db: AngularFireDatabase) { }

  result = [{
      id: 1,
      amount:0,
      price:0,
      penalty:0},
    {
      id: 2,
      amount:0,
      price:0,
      penalty:0},
    {
      id: 3,
      amount:0,
      price:0,
      penalty:0},
  ];

  ngOnInit() {
    this.onChange();
  }

  onlyNumbers(e) {
    return e.charCode >= 48 && e.charCode <= 57;
  }

  newOtherProduct() {
    this.result.push(this.otherProduct);
    this.onChange();
  }

  onChange() {
    this.db.object('/result/directsales').set(this.result);
  }



}
