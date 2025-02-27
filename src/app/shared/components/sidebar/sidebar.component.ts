import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isAdmin: boolean = false;
  isEstoquista: boolean = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.getCurrentUser()
      .then((user: any) => { // 🔹 Define o tipo do usuário explicitamente
        if (user && user.uid) {
          this.auth.getUserType(user.uid).subscribe((userType: string | null) => { // 🔹 Define o tipo do userType
            this.isAdmin = userType === "admin";
            this.isEstoquista = userType === "estoquista";
          });
        }
      })
      .catch((error: any) => { // 🔹 Define o tipo do erro
        console.log("Erro ao obter o usuário", error);
      });
  }
}
