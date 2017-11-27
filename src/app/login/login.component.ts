import { Component, OnInit } from '@angular/core';
import {LoginService} from "../shared/login-service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  modal = false;
  username: string;
  password: string;

  constructor(private router: Router,
  private loginService: LoginService,
  private formbuilder: FormBuilder) {
    this.loginForm = this.formbuilder.group({
      username: [null, [<any>Validators.required]],
      password: [null, [<any>Validators.required]]
    });
  }

  ngOnInit() {
    this.username = null;
    this.password = null;
  }

  login(){
    if(this.loginService.login(this.username, this.password)){
      this.modal = false;
      const redirect = this.loginService.redirectUrl ? this.loginService.redirectUrl : '/dashboard';
      console.log(redirect);
      this.router.navigate([redirect]);
    }
    this.modal = true;
  }

  closeModal(){
    this.modal = false;
  }
}
