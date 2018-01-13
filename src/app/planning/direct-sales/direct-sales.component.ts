import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-direct-sales',
  templateUrl: './direct-sales.component.html',
  styleUrls: ['./direct-sales.component.css']
})
export class DirectSalesComponent implements OnInit {

  constructor(private db: AngularFireDatabase, private activatedRoute: ActivatedRoute) { }

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
  directSales: any;

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
