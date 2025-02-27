import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserInterface } from '../../shared/interfaces/user-interface';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  user$: Observable<UserInterface | null> = of (null);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user$ = this.authService.getUserData();
  
}
}
