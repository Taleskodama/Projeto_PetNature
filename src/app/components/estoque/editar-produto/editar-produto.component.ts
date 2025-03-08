import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstoqueService } from '../../../shared/services/estoque.service';
import { Firestore, doc, setDoc, getDocs, query, collection, where } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-editar-produto',
  templateUrl: './editar-produto.component.html',
  styleUrls: ['./editar-produto.component.scss']
})
export class EditarProdutoComponent implements OnInit {
  estoque: any = {};
  id!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estoqueService: EstoqueService,
    private firestore: Firestore,
    private storage: Storage
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.carregarProduto();
  }

  async carregarProduto() {
    this.estoque = await this.estoqueService.getEstoqueById(this.id);
  
    if (!this.estoque.image || this.estoque.image.trim() === '') {
      this.estoque.image = '/assets/imgs/Foto_Produto.png';
      console.log("Imagem padrão aplicada:", this.estoque.image);
    }
  }
  

  async alterarImagem(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const filePath = `produtos/${file.name}`;
    const fileRef = ref(this.storage, filePath);

    await uploadBytes(fileRef, file);
    const imageUrl = await getDownloadURL(fileRef);

    this.estoque.image = imageUrl;
  }

  async salvarAlteracoes() {
    if (!this.estoque) return;

    // 🔹 Atualiza na coleção "estoques"
    const estoqueRef = doc(this.firestore, 'estoques', this.id);
    await setDoc(estoqueRef, this.estoque, { merge: true });

    // 🔹 Agora buscamos o produto correspondente na coleção "produtos"
    const produtosRef = collection(this.firestore, 'produtos');
    const q = query(produtosRef, where("name", "==", this.estoque.name));
    const querySnapshot = await getDocs(q);

    // 🔹 Se encontrar, atualizar a informação na coleção "produtos"
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (produtoDoc) => {
        const produtoRef = doc(this.firestore, 'produtos', produtoDoc.id);
        await setDoc(produtoRef, this.estoque, { merge: true });
        console.log(`Produto ${produtoDoc.id} atualizado na coleção 'produtos'`);
      });
    }

    alert('Produto atualizado com sucesso!');
    this.router.navigate(['/estoque']);
  }
}
