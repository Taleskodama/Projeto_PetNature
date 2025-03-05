import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.scss'
})
export class UsuariosAdminComponent {
  users: any[] = [];
  searchQuery: string = '';
  showAddUserModal = false;
  showConfirmDeleteModal = false;
  userToDelete: any = null;
  // Definir newUser como um objeto vazio inicialmente
  newUser = { name: '', email: '', password: '', confirmPassword: '' };


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
  async addUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password || !this.newUser.confirmPassword) {
      alert("Preencha todos os campos!");
      return;
    }

    if (this.newUser.password !== this.newUser.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      await this.userService.cadastro(
        this.newUser.name,
        this.newUser.email,
        this.newUser.password,
        this.newUser.confirmPassword
      );
      this.toggleAddUserModal(); // Fecha o modal após o cadastro
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  }

  toggleAddUserModal() {
    this.showAddUserModal = !this.showAddUserModal;
  }

  toggleDeleteUserModal(user?: any) {
    this.userToDelete = user || null;
    this.showConfirmDeleteModal = !!user;
  }
   async deleteSelectedUsers() {
    const selectedUsers = this.users.filter(user => user.selected);
    
    if (selectedUsers.length === 0) {
      alert("Selecione pelo menos um usuário para excluir.");
      return;
    }
  }

  async deleteUser() {
    if (this.userToDelete) {
      try {
        await this.userService.deleteUser(this.userToDelete.uid);
        this.toggleDeleteUserModal(); // Fecha o modal
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
      }
    }
  }
}
