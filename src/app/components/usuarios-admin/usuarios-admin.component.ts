import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.scss'
})
export class UsuariosAdminComponent {
  users: any[] = [];
  searchTerm: string = '';
  filteredUsers: any[] = [];
  searchQuery: string = '';

  constructor(private userService: AuthService) {}

  ngOnInit(): void {
    this.userService.getUserList().subscribe(data => {
      console.log('dados recebidos', data);
      this.users = data;
    });
  }
  filterUsers(): void {
    const query = this.searchQuery.trim().toLowerCase();
    const sanitizedQuery = query.replace(/[\.\-]/g, '');
  
    if (sanitizedQuery === '') {
      // Se não houver pesquisa, exibe a página atual normalmente
      this.userService.getUserList().subscribe(data => {
        this.users = data;
      });
    } else {
      // Filtra sobre todos os usuários
      const filteredUsers = this.users.filter(user => {
        const titleMatch = user.name ? user.name.toLowerCase().includes(sanitizedQuery) : false;
        return titleMatch;
      });
  
      
    }
  }
}
