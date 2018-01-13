import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {ToastyServiceInt} from "../../util/toasty.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-direct-sales',
  templateUrl: './direct-sales.component.html',
  styleUrls: ['./direct-sales.component.css']
})
export class DirectSalesComponent implements OnInit {

  otherProduct = {
    id: 0,
    amount:0,
    price:0,
    penalty:0
  };


  constructor(private db: AngularFireDatabase, private toastyServiceInt: ToastyServiceInt, private activatedRoute: ActivatedRoute) { }

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

  directSalesSub: Subscription;
  directSales: any

  ngOnInit() {
    this.directSalesSub = this.db.object('/result/directsales').valueChanges().subscribe(result => {
      this.directSalesSub.unsubscribe();
      this.directSales = result;
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        let loadData = params['loadData'];
        if (loadData) {
          this.loadData();
        }
        this.onChange();
      });
    });

  }

  onlyNumbers(e) {
    return e.charCode >= 48 && e.charCode <= 57;
  }

  alreadyExists(e) {

    let alreadyExists = false;

    this.result.forEach(entry => {
      if (Number(e) === Number(entry.id)) {
        alreadyExists = true;
      }
    });

    if (e <= 0 || e > 59) {
      alreadyExists = true;
    }

    return  alreadyExists;
  }

  newOtherProduct() {

    if (!this.alreadyExists(this.otherProduct.id)) {
      this.result.push(this.newObj(this.otherProduct));
    } else {
      this.toastyServiceInt.setToastyDefaultError("Produkt nicht verfügbar", "Das Produkt ist bereits vorhanden oder Sie haben kein gültiges Produkt eingegeben.")
    }

    this.onChange();
  }

  newObj(otherProduct: any): any {
    return {
      id: otherProduct.id,
      amount: otherProduct.amount,
      price: otherProduct.price,
      penalty: otherProduct.penalty
    }
  }

  onChange() {
    this.result.forEach(entry => {
      if (!entry.amount) {
        entry.amount = 0;
      }
      if (!entry.price) {
        entry.price = 0;
      }
      if (!entry.penalty) {
        entry.penalty = 0;
      }
    });

    this.db.object('/result/directsales').set(this.result);
  }

  loadData() {
   this.result = this.directSales;
  }



}
