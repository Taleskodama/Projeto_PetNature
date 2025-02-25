import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UserInterface } from '../interfaces/user-interface';
import { Observable, of, switchMap } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) { }

  cadastro(name: string, email : string, password: string, confirmPassword: string){
    if(password != confirmPassword){
      alert('As senhas não coincidem.');
      return;
    }
    this.auth.createUserWithEmailAndPassword(email,password).then( async userCredential =>{
      const user = userCredential?.user;

      if(user){
        const userData: UserInterface = {
          name: name,
          email: email,
          tipo:'Usuário'
        }

        await this.salvarDados(user.uid, userData);
        user.sendEmailVerification();
        this.auth.signOut();
      }
    })
    .catch(error=>{
      console.log(error)
    })
}

  salvarDados(id: string, user: UserInterface){
    return this.firestore.collection('users').doc(id).set(user);
  }

  login(email: string, password: string): Promise<any> {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (userCredential.user?.emailVerified) {
          console.log("sucesso");
          this.router.navigate(['/telaPrincipal']);
          return userCredential; // Retorna o usuário logado
        } else {
          throw new Error("E-mail não verificado. Por favor, verifique seu e-mail.");
        }
      })
      .catch((error) => {
        console.log(error);
        throw error; // Propaga o erro para ser tratado no componente
      });
  }

  redefinirSenha(email:string){
    this.auth.sendPasswordResetEmail(email).then(()=>{ }).catch((error)=>{
      console.log(error)
    })
  }

  logout(){
    this.auth.signOut().then(()=>{
      this.router.navigate(['/'])
    }).catch((error)=>{
      console.log(error)
    })
  }

  getUserData():Observable<any>{
    return this.auth.authState.pipe(
      switchMap(user =>{
        if(user){
          return this.firestore.collection('users').doc(user.uid).valueChanges();
        }else{
          return of(null)
        }
      })
    )
  }

  loginWithGoogle(): Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
  
    return this.auth.signInWithPopup(provider)
      .then(async (credential) => {
        if (credential.user) {
          const userRef = this.firestore.collection('users').doc(credential.user.uid);
  
          // Verifica se o usuário já existe no Firestore
          const userSnapshot = await userRef.get().toPromise();
          if (!userSnapshot?.exists) {
            const userData: UserInterface = {
              name: credential.user.displayName || '',
              email: credential.user.email || '',
              tipo: 'Usuário'
            };
            await this.salvarDados(credential.user.uid, userData);
          }
  
          console.log('Usuário logado com Google:', credential.user);
          this.router.navigate(['/telaPrincipal']);
          return credential.user; // 🔹 Adiciona um retorno explícito
        }
  
        throw new Error("Erro ao autenticar usuário com Google"); // 🔹 Retorna um erro se `credential.user` for `null`
      })
      .catch(error => {
        console.error('Erro ao fazer login com Google:', error);
        throw error; // 🔹 Propaga o erro para ser tratado no componente
      });
  }

}
