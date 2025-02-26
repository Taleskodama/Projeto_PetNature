import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ProductInterface } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsCollection;

  constructor(private firestore: Firestore) {
    this.productsCollection = collection(this.firestore, 'products');
  }

  getProducts(): Observable<ProductInterface[]> {
    return collectionData(this.productsCollection, { idField: 'id' }) as Observable<ProductInterface[]>;
  }

  addProduct(product: ProductInterface): Promise<void> {
    const productDoc = doc(this.productsCollection, product.uid);
    return setDoc(productDoc, product);
  }

  deleteProduct(id: string): Promise<void> {
    const productDoc = doc(this.productsCollection, id);
    return deleteDoc(productDoc);
  }
}
