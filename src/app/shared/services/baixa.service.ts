import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { BaixaInterface } from '../interfaces/baixa.interface';

@Injectable({
  providedIn: 'root'
})
export class BaixaService {
  private baixasCollection;

  constructor(private firestore: Firestore) {
    this.baixasCollection = collection(this.firestore, 'baixas');
  }

  getBaixas(): Observable<BaixaInterface[]> {
    return collectionData(this.baixasCollection, { idField: 'id' }) as Observable<BaixaInterface[]>;
  }

  async getEstoqueById(estoqueId: string) {
    console.log("🛠️ Buscando estoque com ID:", estoqueId);
    const estoqueRef = doc(this.firestore, `estoques/${estoqueId}`);
    const estoqueSnap = await getDoc(estoqueRef);
  
    if (!estoqueSnap.exists()) {
      console.warn("⚠️ Estoque não encontrado para ID:", estoqueId);
      return null;
    }
  
    console.log("📦 Estoque encontrado:", estoqueSnap.data());
    return estoqueSnap.data();
  }
  

  async getUserById(userId: string) {
    const userRef = doc(this.firestore, `users/${userId}`);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  }
}
