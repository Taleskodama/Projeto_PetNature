import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.scss'
})
export class UsuariosAdminComponent {
  users: any[] = [];

  constructor(private userService: AuthService) {}

  ngOnInit(): void {
    this.userService.getUserList().subscribe(data => {
      console.log('dados recebidos', data);
      this.users = data;
    });
  }
}
