import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']  //  Corrigido de styleUrl para styleUrls (erro no seu código)
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(private router: Router, private auth: AuthService) { }

  cadastrar() {
    this.router.navigate(['/cadastro']);
  }
  login() {
    if (this.email !== '' && this.password !== '') {
      this.auth.login(this.email, this.password)
        .then(() => {
          this.router.navigate(['/telaPrincipal']);
        })
        .catch((error: any) => {
          alert('Erro ao fazer login: ' + error.message);
        });
    } else {
      alert('Preencha todos os campos');
    }
  }
  
  loginWithGoogle() {
    this.auth.loginWithGoogle()
      .then(() => {
        this.router.navigate(['/telaPrincipal']);
      })
      .catch((error: any) => {
        alert('Erro ao fazer login com Google: ' + error.message);
      });
  }
}
