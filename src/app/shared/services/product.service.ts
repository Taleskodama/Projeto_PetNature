import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ProductInterface } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsCollection;

  constructor(private firestore: Firestore) {
    this.productsCollection = collection(this.firestore, 'produtos'); // Nome corrigido para coincidir com o Firestore
  }

  // Método para obter todos os produtos
  getProducts(): Observable<ProductInterface[]> {
    return collectionData(this.productsCollection, { idField: 'uid' }) as Observable<ProductInterface[]>;
  }

  // Método para adicionar um novo produto
  async addProduct(product: ProductInterface): Promise<void> {
    const productDoc = doc(this.productsCollection, product.uid);
    return setDoc(productDoc, product);
  }

  // Método para deletar um produto
  async deleteProduct(uid: string): Promise<void> {
    const productDoc = doc(this.productsCollection, uid);
    return deleteDoc(productDoc);
  }

  // Método para buscar um único produto por UID
  async getProductById(uid: string): Promise<ProductInterface | null> {
    const productDoc = doc(this.productsCollection, uid);
    const snapshot = await getDoc(productDoc);
    return snapshot.exists() ? (snapshot.data() as ProductInterface) : null;
  }
  async getProductByIdAsync(uid: string): Promise<ProductInterface | null> {
    const productDoc = doc(this.productsCollection, uid);
    const snapshot = await getDoc(productDoc);
    return snapshot.exists() ? (snapshot.data() as ProductInterface) : null;
  }
}
