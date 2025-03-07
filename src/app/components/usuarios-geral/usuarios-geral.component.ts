import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-usuarios-geral',
  templateUrl: './usuarios-geral.component.html',
  styleUrl: './usuarios-geral.component.scss'
})
export class UsuariosGeralComponent {
  users: any[] = [];
  searchQuery: string = '';

  constructor(private userService: AuthService) {}

  ngOnInit(): void {
    this.userService.getUserList().subscribe(data => {
      this.users = data;
    });
  }
  filterUsers(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (query === '') {
      // Se não houver pesquisa, exibe todos os usuários
      this.userService.getUserList().subscribe(data => {
        this.users = data;
      });
    } else {
      // Filtra os usuários pelo nome
      this.users = this.users.filter(user =>
        user.name?.toLowerCase().includes(query)
      );
    }
  }
  
}
