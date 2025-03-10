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
  usersFiltrados:any[] = [];
  searchTerm: string = '';
  showAddUserModal = false;
  showEditUserModal = false;
  selectedUser: any = null;

 
  filtroTipo: string = ''; // Filtro de tipo de usuário (role)
  filtroEmail: string = ''; // Filtro por email
  mostrarModalFiltro: boolean = false; // Controla a exibição do modal de filtros


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
      this.usersFiltrados = data;
    });
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

  filtrarUsuarios(): void {
    this.usersFiltrados = this.users.filter(user => {
      const nomeFiltrado = user.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const tipoFiltrado = this.filtroTipo ? user.role.toLowerCase().includes(this.filtroTipo.toLowerCase()) : true;
      const emailFiltrado = this.filtroEmail ? user.email.toLowerCase().includes(this.filtroEmail.toLowerCase()) : true;
      
      return nomeFiltrado && tipoFiltrado && emailFiltrado;
    });
  }

  resetarFiltros(): void {
    this.filtroTipo = '';
    this.filtroEmail = '';
    this.filtrarUsuarios();
    this.mostrarModalFiltro = false; // Fechar o modal ao resetar os filtros
  }

  pesquisarUsuarios(): void {
    const termo = this.searchTerm.toLowerCase().trim();
  
    // Se a barra estiver vazia, retorna todos os usuários
    if (!termo) {
      this.usersFiltrados = [...this.users];
      return;
    }
  
    // Filtra apenas pelo nome e não altera o estado do modal
    this.usersFiltrados = this.users.filter(user => 
      user.name?.toLowerCase().includes(termo)
    );
  }
  
  
}
  

