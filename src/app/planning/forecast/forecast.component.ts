import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ToastyServiceInt } from "../../util/toasty.service";

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {
  @Input() firstFormGroup: FormGroup;
  forecastPeriod: any[] = [];
  sumFirst: number;
  sumSecond: number;
  sumThird: number;
  sumFourth: number;
  currPeriod = 1;

  constructor(private db: AngularFireDatabase, private toastyServiceInt: ToastyServiceInt) {
    this.forecastPeriod = [
      { period: 'first', inputs: [] },
      { period: 'second', inputs: [] },
      { period: 'third', inputs: [] },
      { period: 'fourth', inputs: [] },
    ];
  }

  ngOnInit() {
    this.db.object('currentPeriod').valueChanges().subscribe(currentPeriod => {
      this.currPeriod =  + currentPeriod;
    })
  }

  onlyNumbers(e) {
    return e.charCode >= 48 && e.charCode <= 57;
  }

  checkSum() {
    this.forecastPeriod.forEach((p, index) => {
      if (Number(p.inputs.P1) >= 0 && Number(p.inputs.P2) >= 0 && Number(p.inputs.P3) >= 0) {
        var sum = Number(p.inputs.P1) + Number(p.inputs.P2) + Number(p.inputs.P3);
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
      } else {
        switch (index) {
          case 0: {
            if (this.sumFirst) {
              this.sumFirst = undefined;
            }
            break;
          }
          case 1: {
            if (this.sumSecond) {
              this.sumSecond = undefined;
            }
            break;
          }
          case 2: {
            if (this.sumThird) {
              this.sumThird = undefined;
            }
            break;
          }
          case 3: {
            if (this.sumFourth) {
              this.sumFourth = undefined;
            }
            break;
          }
        }
      }

      if (this.sumFirst && this.sumSecond && this.sumThird && this.sumFourth) {
        this.db.object('/result/forecast').set(this.forecastPeriod);
      }
    });
  }

  ifDisabled() {
    if (this.firstFormGroup.status === "INVALID") {
      this.toastyServiceInt.setToastyDefaultError('Warnung!', 'Bitte fülle Sie die erfolderlichen Inputs aus!')
    }
  }
}
