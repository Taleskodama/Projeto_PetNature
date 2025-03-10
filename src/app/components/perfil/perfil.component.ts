import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserInterface } from '../../shared/interfaces/user-interface';
import { Observable, of, take } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  user$: Observable<UserInterface | null> = of(null);
  user: UserInterface | null = null;
  password: string = '';
  actualUser:UserInterface | null = null;
  newName: string |Observable<string | null> = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user$ = this.authService.getUserData();
    this.user$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.actualUser = user;
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && this.user) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const photoURL = e.target.result;
        this.authService.uploadUserPhoto(photoURL).then(() => {
          this.user!.photo = photoURL;
        });
      };
      reader.readAsDataURL(file);
    }
  }
  updateUserName():void{
    this.newName = this.authService.getUserName(this.user!.uid);
  if (this.user && this.user.name.trim() !== '') {
    this.authService.updateUser(this.user.uid, { name: this.user.name })
      .then(() => {
        alert('Nome atualizado com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao atualizar o nome:', error);
      });
  } else {
    alert('O nome não pode estar vazio.');
  }
}


}
