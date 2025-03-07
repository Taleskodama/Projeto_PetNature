import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getUserData().pipe(
      map(user => user?.role === 'admin'), // Apenas admin pode acessar
      tap(isAdmin => {
        if (!isAdmin) {
          this.router.navigate(['/telaPrincipal']); // Redireciona se não for admin
        }
      })
    );
  }
}
