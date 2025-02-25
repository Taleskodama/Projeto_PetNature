import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { RecuperarSenhaComponent } from './components/recuperar-senha/recuperar-senha.component';
import { HomeComponent } from './components/home/home.component';
import { TelaPrincipalComponent } from './components/tela-principal/tela-principal.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { UsuariosAdminComponent } from './components/usuarios-admin/usuarios-admin.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path:'cadastro', component: CadastroComponent},
  {path:'recuperarSenha', component: RecuperarSenhaComponent},
  {path:'telaPrincipal', component:TelaPrincipalComponent},
  {path:'perfil', component:PerfilComponent},
  {path:'usuariosAdmin',component:UsuariosAdminComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
    