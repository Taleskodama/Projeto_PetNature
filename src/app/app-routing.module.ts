import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { RecuperarSenhaComponent } from './components/recuperar-senha/recuperar-senha.component';
import { HomeComponent } from './components/home/home.component';
import { TelaPrincipalComponent } from './components/tela-principal/tela-principal.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { UsuariosAdminComponent } from './components/usuarios-admin/usuarios-admin.component';
import { EditarUsuarioComponent } from './components/editar-usuario/editar-usuario.component';

import { AuthGuard } from './shared/guards/auth.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { EstoqueComponent } from './components/estoque/estoque.component';
import { RegistroBaixasComponent } from './components/registro-baixas/registro-baixas.component';
import { RoleGuard } from './shared/guards/role.guard';
import { ProdutosComponent } from './components/produtos/produtos.component';
import { DetalhesProdutoComponent } from './components/produtos/detalhes-produto/detalhes-produto.component';


const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path:'cadastro', component: CadastroComponent},
  {path:'recuperarSenha', component: RecuperarSenhaComponent},
  {path:'telaPrincipal', component:TelaPrincipalComponent,canActivate: [AuthGuard]},
  {path:'perfil', component:PerfilComponent, canActivate: [AuthGuard]},
  {path:'usuariosAdmin',component:UsuariosAdminComponent,canActivate: [AdminGuard]},
  {path:'editarUsuario', component:EditarUsuarioComponent,canActivate: [AuthGuard]},
  {path: 'produtos', component: ProdutosComponent},
  {path: 'estoque', component: EstoqueComponent, canActivate: [RoleGuard] },
  {path: 'registroBaixas', component: RegistroBaixasComponent, canActivate: [RoleGuard] },
  {path: 'detalhes-produto/:id', component: DetalhesProdutoComponent, canActivate: [AuthGuard] },

  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
    