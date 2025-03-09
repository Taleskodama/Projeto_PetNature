import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserInterface } from '../../shared/interfaces/user-interface';

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

  newUser: any = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getUserList().subscribe(data => {
      this.users = data;
    });
  }

  filterUsers(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (query === '') {
      // Se não houver pesquisa, exibe todos os usuários
      this.auth.getUserList().subscribe(data => {
        this.users = data;
      });
    } else {
      // Filtra os usuários pelo nome
      this.users = this.users.filter(user =>
        user.name?.toLowerCase().includes(query)
      );
    }
  }

  validateForm(): boolean {
    return this.newUser.name.trim() !== '' &&
           this.newUser.email.trim() !== '' &&
           this.newUser.password.trim() !== '' &&
           this.newUser.confirmPassword.trim() !== '';
  }

  cadastrar() {
    if (this.validateForm()) {
      this.auth.cadastro(this.newUser.name, this.newUser.email, this.newUser.password, this.newUser.confirmPassword)
      
    } else {
      alert('Preencha todos os campos');
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
        await this.auth.deleteUser(this.userToDelete.uid);
        this.toggleDeleteUserModal(); // Fecha o modal
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
      }
    }
  }
}
