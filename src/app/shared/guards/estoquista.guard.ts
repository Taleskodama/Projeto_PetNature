import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EstoquistaGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getUserData().pipe(
      map(user => user?.role === 'estoquista'), // Apenas estoquista pode acessar
      tap(isEstoquista => {
        if (!isEstoquista) {
          this.router.navigate(['/telaPrincipal']); // Redireciona se não for estoquista
        }
      })
    );
  }
}
