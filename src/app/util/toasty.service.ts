import { ToastOptions, ToastyService } from 'ng2-toasty';
import { Injectable } from '@angular/core';


@Injectable()
export class ToastyServiceInt {

  constructor(private toastyService: ToastyService) {}

  defaultTimeout = 4000;
  defaultShowClose = true;

  setToastyDefaultError(title: string, msg: string) {
    this.toastyService.error(this.getToastOptions(title, msg, this.defaultShowClose, this.defaultTimeout));
  }

  setToastyDefaultSuccess(title: string, msg: string) {
    this.toastyService.success(this.getToastOptions(title, msg, this.defaultShowClose, this.defaultTimeout ));
  }

  setToastyCustomError(title: string, msg: string, showClose: boolean, timeout: number) {
    this.toastyService.error(this.getToastOptions(title, msg, showClose, timeout));
  }

  setToastyCustomSuccess(title: string, msg: string, showClose: boolean, timeout: number) {
    this.toastyService.success(this.getToastOptions(title, msg,  showClose, timeout));
  }

  private getToastOptions(title: string, msg: string, showClose: boolean, timeout: number): ToastOptions {
    const toastOptions: ToastOptions = {
      title: title,
      msg: msg,
      showClose: showClose,
      timeout: timeout,
      theme: 'material',
      onAdd: (toast) => {},
      onRemove: function(toast) {}
    };
    return toastOptions;
  }
}

