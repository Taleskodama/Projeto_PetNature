import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserInterface } from '../../shared/interfaces/user-interface';
import { TmplAstRecursiveVisitor } from '@angular/compiler';

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.scss'
})
export class UsuariosAdminComponent {
  users: any[] = [];
  searchQuery: string = '';
  showAddUserModal = false;
  showEditUserModal = false;
  selectedUser: any = null;


  newUser: any = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
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
  openEditUserModal(user: any) {
    this.selectedUser = { ...user }; 
    this.showEditUserModal = true;
  }

  
  async saveUserChanges() {
    if (!this.selectedUser) return;
    const userUpdateData: any = {};
    Object.keys(this.selectedUser).forEach(key => {
      if (this.selectedUser[key] !== undefined) {
        userUpdateData[key] = this.selectedUser[key];
      }
    });

    try {
      await this.auth.updateUser(this.selectedUser.uid, userUpdateData);
      alert("Usuário atualizado com sucesso!");

      
      this.users = this.users.map(user => 
        user.uid === this.selectedUser.uid ? { ...this.selectedUser } : user
      );

      this.showEditUserModal = false; 
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  }

  
  async deleteUser() {
    if (!this.selectedUser) return;
    const confirmDelete = confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmDelete) return;

    try {
      await this.auth.deleteUser(this.selectedUser.uid);
      alert("Usuário removido com sucesso!");

      
      this.users = this.users.filter(user => user.uid !== this.selectedUser.uid);

      this.showEditUserModal = false; 
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
    }
  }

}
