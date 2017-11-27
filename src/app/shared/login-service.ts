/**
 * Created by marvinlott on 27.11.17.
 */
import {Injectable, OnInit} from "@angular/core";
import {Router} from "@angular/router";
@Injectable()
export class LoginService implements OnInit{

  username= 'scmuser';
  password = 'scmpassword';
  redirectUrl: string;

  ngOnInit(){

  }
  login(username: string,password: string):boolean{
    if(username === this.username && password===this.password){
      localStorage.setItem('user',this.username);
      return true;
    }
    return false;
  }

  isLoggedIn():boolean{
    return localStorage.getItem('user') !== null;
  }
}
