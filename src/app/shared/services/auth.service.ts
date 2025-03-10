import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UserInterface } from '../interfaces/user-interface';
import { firstValueFrom, map, Observable, of, switchMap } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) { }

  cadastro(name: string, email: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }

    this.auth.createUserWithEmailAndPassword(email, password).then(async (userCredential) => {
        const user = userCredential?.user;

        if (user) {
            const userData: UserInterface = {
                name: name,
                email: email,
                code: Math.random().toString(36).substring(2, 8), // Código aleatório
                created_at: Date.now(), // Timestamp da criação
                photo: '', // Inicialmente sem foto
                role: 'Usuário', // Papel do usuário
                uid: user.uid // ID do Firebase Authentication
            };

            await this.salvarDados(user.uid, userData);
            user.sendEmailVerification();
            this.auth.signOut();
        }
    }).catch(error => {
        console.log(error);
    });
}


salvarDados(id: string, user: UserInterface) {
  return this.firestore.collection('users').doc(id).set({
    ...user,
    role: user.role || 'Usuário' // Define a role padrão se não existir
  });
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
  getUserData(): Observable<any> {
    return this.auth.authState.pipe(
        switchMap(user => {
            if (user) {
                return this.firestore.collection('users').doc(user.uid).valueChanges();
            } else {
                return of(null);
            }
        })
    );
}

getUserList(): Observable<any> {
  return this.firestore.collection('users').valueChanges();
}


loginWithGoogle(): Promise<any> {
  const provider = new firebase.auth.GoogleAuthProvider();

  return this.auth.signInWithPopup(provider)
      .then(async (credential) => {
          if (credential.user) {
              const userRef = this.firestore.collection('users').doc(credential.user.uid);
              const userSnapshot = await userRef.get().toPromise();

              if (!userSnapshot?.exists) {
                  const userData: UserInterface = {
                      name: credential.user.displayName || '',
                      email: credential.user.email || '',
                      code: Math.random().toString(36).substring(2, 8),
                      created_at: Date.now(),
                      photo: credential.user.photoURL || '', // Garante que a foto seja salva
                      role: 'Usuário',
                      uid: credential.user.uid
                  };

                  await this.salvarDados(credential.user.uid, userData);
              } else {
                  // Atualiza a foto caso já exista o usuário no banco
                  await userRef.update({ photo: credential.user.photoURL });
              }

              console.log('Usuário logado com Google:', credential.user);
              this.router.navigate(['/telaPrincipal']);
              return credential.user;
          }

          throw new Error("Erro ao autenticar usuário com Google");
      })
      .catch(error => {
          console.error('Erro ao fazer login com Google:', error);
          throw error;
      });
}


async getCurrentUser(): Promise<any> {
  return this.auth.currentUser ?? firstValueFrom(
    new Observable<any>((observer: any) => {
      const unsubscribe = this.auth.onAuthStateChanged(user => {
        observer.next(user);
        observer.complete();
      });
      return { unsubscribe: async () => (await unsubscribe)() };
    })
  );
}

getUserType(id: string): Observable<string | null> {
  return this.firestore.collection('users').doc(id).valueChanges().pipe(
    map((user: any) => user ? user.role : null) // Aqui pega a role do usuário
  );
}

getUserName(id: string): Observable<string | null> {
  return this.firestore.collection('users').doc(id).valueChanges().pipe(
    map((user: any) => user ? user.name : null) // Aqui pega a role do usuário
  );
}
uploadUserPhoto(photoURL: string): Promise<void> {
  return this.auth.currentUser.then(currentUser => {
    if (currentUser) {
      return this.firestore.doc(`users/${currentUser.uid}`).update({ photo: photoURL });
    } else {
      throw new Error('No user is currently logged in.');
    }
  });
}
updateUserData(user: UserInterface): Promise<void> {
  return this.auth.currentUser.then(currentUser => {
    if (currentUser) {
      return this.firestore.doc(`users/${currentUser.uid}`).update(user);
    } else {
      throw new Error('No user is currently logged in.');
    }
  });
}
updateUser(uid: string, userData: any) {
  return this.firestore.collection('users').doc(uid).update(userData);
}

updateUserEmail(email: string): Promise<void> {
  return this.auth.currentUser.then(currentUser => {
    if (currentUser) {
      return currentUser.updateEmail(email);
    } else {
      throw new Error('No user is currently logged in.');
    }
  });
}

updateUserName(name:string): Promise<void> {
  return this.auth.currentUser.then(currentUser => {
    if (currentUser) {
      return this.firestore.doc(`users/${currentUser.uid}`).update({ name: name }),
      console.log('entrou na funçao update');
    } else {
      throw new Error('No user is currently logged in.');
    }
  });
}
deleteUser(uid: string): Promise<void> {
  return this.firestore.collection('users').doc(uid).delete();
}
}
