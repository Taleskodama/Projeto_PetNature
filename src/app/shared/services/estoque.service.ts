import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, getDoc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { EstoqueInterface } from '../interfaces/estoque.interface';


@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private estoqueCollection;

  constructor(private firestore: Firestore) {
    this.estoqueCollection = collection(this.firestore, 'estoques');
  }

  getEstoques(): Observable<EstoqueInterface[]> {
    return collectionData(this.estoqueCollection, { idField: 'id' }) as Observable<EstoqueInterface[]>;
  }

  async atualizarEstoque(id: string, quantidade: number) {
    const estoqueRef = doc(this.firestore, `estoques/${id}`);
    await updateDoc(estoqueRef, { qtd: quantidade });
  }
  updateEstoque(id: string, data: Partial<EstoqueInterface>): Promise<void> {
    const estoqueDoc = doc(this.firestore, `estoques/${id}`);
    return updateDoc(estoqueDoc, { ...data });
  }
  async getEstoqueById(id: string): Promise<EstoqueInterface | null> {
    const estoqueRef = doc(this.firestore, `estoques/${id}`);
    const estoqueSnap = await getDoc(estoqueRef);

    if (estoqueSnap.exists()) {
      return estoqueSnap.data() as EstoqueInterface;
    } else {
      return null;
    }
  }

  async adicionarProduto(produto: any) {
    try {
      const estoqueRef = collection(this.firestore, 'estoques');
  
      await addDoc(estoqueRef, {
        ...produto,
        lote: Number(produto.lote) || 0, // 🔹 Converte para número
        created_at: Date.now(), // 🔹 Salva como número (timestamp em milissegundos)
      });
  
      console.log("✅ Produto adicionado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao adicionar produto:", error);
    }
  }
  
}
  

