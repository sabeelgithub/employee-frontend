import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  router = inject(Router);

  canActivate(): boolean {
    if (!localStorage.getItem('accessToken')) {
        // this.router.navigate(['/app/home'])
      return true;
    } else {
     
      this.router.navigate(['/app/home']);
      return false;
    }
  }
}
