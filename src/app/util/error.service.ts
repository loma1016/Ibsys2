import { ErrorHandler } from '@angular/core';

export default class MyErrorHandler implements ErrorHandler {
  handleError(error) {
    //window.location.reload();

    console.log(error);
  }
}
