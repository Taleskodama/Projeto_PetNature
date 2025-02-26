import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  usuario: any;
  fotoPerfilPadrao: string = 'assets/imgs/Foto_Usuario.png'; // Imagem padrão

  constructor(private authService: AuthService,private sanitizer: DomSanitizer) {}
  
  getSafeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  


  ngOnInit() {
    this.authService.getUserData().subscribe(dados => {
      if (dados) {
        this.usuario = dados;
        console.log("Usuário carregado:", this.usuario); // 🔹 Verificar se os dados do usuário estão vindo corretamente
      }
    });
  }
}
