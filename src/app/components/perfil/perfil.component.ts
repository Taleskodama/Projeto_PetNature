import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserInterface } from '../../shared/interfaces/user-interface';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  user$: Observable<UserInterface | null> = of(null);
  user: UserInterface | null = null;
  password: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user$ = this.authService.getUserData();
    this.user$.subscribe(user => {
      this.user = user;
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

  updateUser(): void {
    if (this.user) {
      this.authService.updateUserData(this.user).then(() => {
        if (this.user!.email) {
          this.authService.updateUserEmail(this.user!.email);
        }
        if (this.password) {
          this.authService.updateUserPassword(this.password);
        }
        if (this.user!.photo) {
          // Handle photo update if needed
        }
      });
    }
  }
}
