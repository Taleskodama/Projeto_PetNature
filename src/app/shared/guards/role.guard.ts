import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getUserData().pipe(
      map(user => {
        const isAuthorized = user?.role === 'admin' || user?.role === 'estoquista';
        console.log('RoleGuard 🚀 - Usuário tem permissão?', isAuthorized);
        return isAuthorized;
      }),
      tap(isAuthorized => {
        if (!isAuthorized) {
          this.router.navigate(['/telaPrincipal']);
        }
      })
    );
  }
}
