import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  usuario: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUserData().subscribe((dados) => {
      this.usuario = dados;
    });
  }
}
