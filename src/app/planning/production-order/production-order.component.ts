import { Component, OnDestroy, OnInit } from '@angular/core';
import { DragulaService } from "ng2-dragula";
import { AngularFireDatabase } from "angularfire2/database";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-production-order',
  templateUrl: './production-order.component.html',
  styleUrls: ['./production-order.component.css', '../../../assets/css/dragula.css']
})
export class ProductionOrderComponent implements OnInit, OnDestroy {

  productionSub: Subscription;
  production: any;
  order: any;
  amount: any;

  constructor(private db: AngularFireDatabase, private dragulaService: DragulaService) {
    dragulaService.setOptions('first-bag', {
      moves: function (el, source, handle) {
        return handle.className.indexOf("draggable") > -1;
      },
    });
    dragulaService.dropModel.subscribe((value) => {
      this.onDrop(value.slice(1));
      this.sortProduction();
    });
  }

  ngOnInit() {
    this.productionSub = this.db.object('/result/production').valueChanges().subscribe(result => {
      this.production = result;
      this.order = (this.production as any).order;
      this.sortProduction();
    });
  };

  ngOnDestroy() {
    this.dragulaService.destroy('first-bag');
  }

  sortProduction() {
    this.db.object('/result/production/order').set(this.order);
  }

  private onDrop(args) {
    let [e] = args;
    if (e.className.indexOf("pos-changed") === -1) {
      e.className = e.className ? [e.className, "pos-changed"].join(' ') : "pos-changed";
    }
  }

}
