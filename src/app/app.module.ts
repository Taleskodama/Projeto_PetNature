import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { RecuperarSenhaComponent } from './components/recuperar-senha/recuperar-senha.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { TelaPrincipalComponent } from './components/tela-principal/tela-principal.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import {HeaderComponent} from './shared/components/header/header.component';
import { UsuariosAdminComponent } from './components/usuarios-admin/usuarios-admin.component';
import { EditarUsuarioComponent } from './components/editar-usuario/editar-usuario.component';
import { EstoqueComponent } from './components/estoque/estoque.component';
import { RegistroBaixasComponent } from './components/registro-baixas/registro-baixas.component';
import { ProdutosComponent } from './components/produtos/produtos.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { DetalhesProdutoComponent } from './components/produtos/detalhes-produto/detalhes-produto.component';
import { EditarProdutoComponent } from './components/estoque/editar-produto/editar-produto.component';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { UsuariosGeralComponent } from './components/usuarios-geral/usuarios-geral.component';








@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CadastroComponent,
    RecuperarSenhaComponent,
    HomeComponent,
    SidebarComponent,
    TelaPrincipalComponent,
    PerfilComponent,
    HeaderComponent,
    UsuariosAdminComponent,
    EditarUsuarioComponent,
    EstoqueComponent,
    RegistroBaixasComponent,
    ProdutosComponent,
    DetalhesProdutoComponent,
    EditarProdutoComponent,
    UsuariosGeralComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    
    
    

    
    
  ],
  providers: [provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()), provideStorage(() => getStorage())],
  bootstrap: [AppComponent]
})
export class AppModule { }
