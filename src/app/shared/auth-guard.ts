/**
 * Created by marvinlott on 27.11.17.
 */
import { Injectable, OnDestroy } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { LoginService } from "./login-service";

@Injectable()
export class AuthGuard implements CanActivate, OnDestroy {

  constructor(private loginService: LoginService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url?: string): boolean {
    if (this.loginService.isLoggedIn() === true ) {
      return true;
    }
    this.loginService.redirectUrl = url;
    this.router.navigate(['/login']);
    return false;
  }

  ngOnDestroy() {}
}

