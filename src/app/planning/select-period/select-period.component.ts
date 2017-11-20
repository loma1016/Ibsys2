import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select-period',
  templateUrl: './select-period.component.html',
  styleUrls: ['./select-period.component.css']
})

export class SelectPeriodComponent implements OnInit {
  @Output() closeSelectPeriod = new EventEmitter();  
  public possiblePeriods = 7;

  constructor() { }

  ngOnInit() {
  }

  periodIsSet() {
    this.closeSelectPeriod.emit();
  }

  createRange() {
    var items: number[] = [];
    for(var i = 1; i <= this.possiblePeriods; i++) {
      items.push(i)
    }
    return items;
  }

}
