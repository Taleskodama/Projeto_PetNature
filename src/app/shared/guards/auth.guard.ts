import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getUserData().pipe(
      map(user => !!user), // Retorna true se o usuário está autenticado
      tap(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/login']); // Redireciona para login se não estiver logado
        }
      })
    );
  }
}
